import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'super-secret',
    });
  }

  async validate(payload: { sub: string; email: string; tenantId: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { userRoles: { include: { role: { include: { rolePermissions: { include: { permission: true } } } } } } },
    });
    if (!user || user.deletedAt) throw new UnauthorizedException();
    const permissions = user.userRoles.flatMap(ur => ur.role.rolePermissions.map(rp => rp.permission.code));
    const roles = user.userRoles.map(ur => ur.role.slug);
    return { userId: user.id, email: user.email, tenantId: user.tenantId, permissions, roles };
  }
}
