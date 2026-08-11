import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: { email: email.toLowerCase().trim(), deletedAt: null, isActive: true },
      include: {
        userRoles: { include: { role: { include: { rolePermissions: { include: { permission: true } } } } } },
        tenant: true,
      },
    });
    if (!user || !user.passwordHash) throw new UnauthorizedException('Invalid credentials');
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);
    const tokens = await this.generateAndPersistTokens(user);

    const hasAdminAccess = user.userRoles?.some((ur: any) => {
      const s = ur.role?.slug?.toLowerCase() || '';
      const n = ur.role?.name?.toLowerCase() || '';
      return (
        s === 'super-admin' ||
        s === 'admin' ||
        s === 'hr' ||
        s === 'hr-manager' ||
        n === 'super_admin' ||
        n === 'super admin' ||
        n === 'admin' ||
        n === 'hr'
      );
    });

    const primaryRole = user.userRoles?.[0]?.role?.name || (hasAdminAccess ? 'Admin' : 'Employee');

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        tenantId: user.tenantId,
        avatarUrl: user.avatarUrl,
        role: primaryRole,
        systemRole: primaryRole,
        hasAdminAccess,
        userRoles: user.userRoles,
      },
    };
  }

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findFirst({ where: { email: dto.email.toLowerCase().trim() } });
    if (existingUser) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const slug = dto.companyName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

    const result = await this.prisma.$transaction(async (tx: any) => {
      const tenant = await tx.tenant.create({ data: { name: dto.companyName, slug: `${slug}-${Date.now()}` } });
      const org = await tx.organization.create({ data: { tenantId: tenant.id, name: dto.companyName } });
      const user = await tx.user.create({
        data: { tenantId: tenant.id, email: dto.email.toLowerCase().trim(), passwordHash, firstName: dto.firstName, lastName: dto.lastName, emailVerified: true },
      });
      const adminRole = await tx.role.create({ data: { tenantId: tenant.id, name: 'Super Admin', slug: 'super-admin', isSystemRole: true } });
      await tx.role.createMany({ data: [
        { tenantId: tenant.id, name: 'HR Manager', slug: 'hr-manager', isSystemRole: true },
        { tenantId: tenant.id, name: 'Employee', slug: 'employee', isSystemRole: true },
      ]});
      await tx.userRole.create({ data: { userId: user.id, roleId: adminRole.id } });
      return { tenant, org, user };
    });

    const tokens = await this.generateAndPersistTokens(result.user);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: { id: result.user.id, email: result.user.email, firstName: result.user.firstName, lastName: result.user.lastName, tenantId: result.user.tenantId },
    };
  }

  async refresh(refreshTokenStr: string) {
    if (!refreshTokenStr) throw new UnauthorizedException('Refresh token required');

    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(refreshTokenStr);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const tokenHash = crypto.createHash('sha256').update(refreshTokenStr).digest('hex');
    const existingToken = await this.prisma.refreshToken.findFirst({
      where: { userId: payload.sub, tokenHash, revokedAt: null },
    });

    if (!existingToken || existingToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token revoked or expired');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { userRoles: { include: { role: true } } },
    });

    if (!user || !user.isActive) throw new UnauthorizedException('User account inactive');

    // Token Rotation: revoke previous token
    await this.prisma.refreshToken.update({
      where: { id: existingToken.id },
      data: { revokedAt: new Date() },
    });

    const tokens = await this.generateAndPersistTokens(user);
    return tokens;
  }

  async logout(userId?: string, refreshTokenStr?: string) {
    if (refreshTokenStr) {
      const tokenHash = crypto.createHash('sha256').update(refreshTokenStr).digest('hex');
      await this.prisma.refreshToken.updateMany({
        where: { tokenHash, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    } else if (userId) {
      await this.prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
    return { success: true, message: 'Logged out successfully' };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        employee: true,
        userRoles: { include: { role: true } },
        tenant: { select: { id: true, name: true, slug: true, logoUrl: true } },
      },
    });
    if (!user) throw new UnauthorizedException();
    const { passwordHash, ...userData } = user;
    return userData;
  }

  private async generateAndPersistTokens(user: any) {
    const payload = { sub: user.id, email: user.email, tenantId: user.tenantId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION', '15m') }),
      this.jwtService.signAsync(payload, { expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION', '7d') }),
    ]);

    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: {
        tenantId: user.tenantId,
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    return { accessToken, refreshToken };
  }
}
