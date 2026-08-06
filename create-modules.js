const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'apps/api/src/modules');

const modules = {
  payroll: {
    controller: `import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreatePayrollRunDto } from './dto/create-payroll-run.dto';
import { GeneratePayslipDto } from './dto/generate-payslip.dto';

@ApiTags('Payroll')
@ApiBearerAuth()
@Controller('payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Get('runs')
  @ApiOperation({ summary: 'Get payroll runs' })
  getPayrollRuns(@Req() req) {
    return this.payrollService.getPayrollRuns(req.user.tenantId);
  }

  @Post('runs')
  @ApiOperation({ summary: 'Create payroll run' })
  createPayrollRun(@Req() req, @Body() dto: CreatePayrollRunDto) {
    return this.payrollService.createPayrollRun(req.user.tenantId, dto);
  }

  @Get('payslips')
  @ApiOperation({ summary: 'Get all payslips' })
  getPayslips(@Req() req) {
    return this.payrollService.getPayslips(req.user.tenantId);
  }

  @Get('payslips/:employeeId')
  @ApiOperation({ summary: 'Get payslips for employee' })
  getEmployeePayslips(@Req() req, @Param('employeeId') employeeId: string) {
    return this.payrollService.getEmployeePayslips(req.user.tenantId, employeeId);
  }

  @Post('payslips/generate')
  @ApiOperation({ summary: 'Generate payslip' })
  generatePayslip(@Req() req, @Body() dto: GeneratePayslipDto) {
    return this.payrollService.generatePayslip(req.user.tenantId, dto);
  }
}
`,
    service: `import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePayrollRunDto } from './dto/create-payroll-run.dto';
import { GeneratePayslipDto } from './dto/generate-payslip.dto';

@Injectable()
export class PayrollService {
  constructor(private prisma: PrismaService) {}

  async getPayrollRuns(tenantId: string) {
    return this.prisma.payrollRun.findMany({ where: { tenantId } });
  }

  async createPayrollRun(tenantId: string, dto: CreatePayrollRunDto) {
    return this.prisma.payrollRun.create({ data: { ...dto, tenantId } });
  }

  async getPayslips(tenantId: string) {
    return this.prisma.payslip.findMany({ where: { tenantId } });
  }

  async getEmployeePayslips(tenantId: string, employeeId: string) {
    return this.prisma.payslip.findMany({ where: { tenantId, employeeId } });
  }

  async generatePayslip(tenantId: string, dto: GeneratePayslipDto) {
    return this.prisma.payslip.create({ data: { ...dto, tenantId } });
  }
}
`,
    module: `import { Module } from '@nestjs/common';
import { PayrollController } from './payroll.controller';
import { PayrollService } from './payroll.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PayrollController],
  providers: [PayrollService],
})
export class PayrollModule {}
`,
    dtos: {
      'create-payroll-run.dto.ts': `import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreatePayrollRunDto {
  @IsString()
  @IsNotEmpty()
  month: string;

  @IsString()
  @IsNotEmpty()
  year: string;
}
`,
      'generate-payslip.dto.ts': `import { IsString, IsNotEmpty } from 'class-validator';

export class GeneratePayslipDto {
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsString()
  @IsNotEmpty()
  payrollRunId: string;
}
`
    }
  },
  performance: {
    controller: `import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Performance')
@ApiBearerAuth()
@Controller('performance')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  @Get('review-cycles')
  @ApiOperation({ summary: 'Get review cycles' })
  getReviewCycles(@Req() req) {
    return this.performanceService.getReviewCycles(req.user.tenantId);
  }

  @Post('review-cycles')
  @ApiOperation({ summary: 'Create review cycle' })
  createReviewCycle(@Req() req, @Body() dto: any) {
    return this.performanceService.createReviewCycle(req.user.tenantId, dto);
  }

  @Get('reviews')
  @ApiOperation({ summary: 'Get reviews' })
  getReviews(@Req() req) {
    return this.performanceService.getReviews(req.user.tenantId);
  }

  @Post('reviews')
  @ApiOperation({ summary: 'Create review' })
  createReview(@Req() req, @Body() dto: any) {
    return this.performanceService.createReview(req.user.tenantId, dto);
  }

  @Get('goals')
  @ApiOperation({ summary: 'Get goals' })
  getGoals(@Req() req) {
    return this.performanceService.getGoals(req.user.tenantId);
  }

  @Post('goals')
  @ApiOperation({ summary: 'Create goal' })
  createGoal(@Req() req, @Body() dto: any) {
    return this.performanceService.createGoal(req.user.tenantId, dto);
  }
}
`,
    service: `import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PerformanceService {
  constructor(private prisma: PrismaService) {}

  async getReviewCycles(tenantId: string) {
    return this.prisma.reviewCycle.findMany({ where: { tenantId } });
  }

  async createReviewCycle(tenantId: string, dto: any) {
    return this.prisma.reviewCycle.create({ data: { ...dto, tenantId } });
  }

  async getReviews(tenantId: string) {
    return this.prisma.performanceReview.findMany({ where: { tenantId } });
  }

  async createReview(tenantId: string, dto: any) {
    return this.prisma.performanceReview.create({ data: { ...dto, tenantId } });
  }

  async getGoals(tenantId: string) {
    return this.prisma.goal.findMany({ where: { tenantId } });
  }

  async createGoal(tenantId: string, dto: any) {
    return this.prisma.goal.create({ data: { ...dto, tenantId } });
  }
}
`,
    module: `import { Module } from '@nestjs/common';
import { PerformanceController } from './performance.controller';
import { PerformanceService } from './performance.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PerformanceController],
  providers: [PerformanceService],
})
export class PerformanceModule {}
`,
    dtos: {
      'review.dto.ts': `import { IsString, IsNotEmpty } from 'class-validator';
export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  title: string;
}
`
    }
  },
  recruitment: {
    controller: `import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { RecruitmentService } from './recruitment.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Recruitment')
@ApiBearerAuth()
@Controller('recruitment')
export class RecruitmentController {
  constructor(private readonly recruitmentService: RecruitmentService) {}

  @Get('requisitions')
  @ApiOperation({ summary: 'Get job requisitions' })
  getRequisitions(@Req() req) {
    return this.recruitmentService.getRequisitions(req.user.tenantId);
  }

  @Post('requisitions')
  @ApiOperation({ summary: 'Create job requisition' })
  createRequisition(@Req() req, @Body() dto: any) {
    return this.recruitmentService.createRequisition(req.user.tenantId, dto);
  }

  @Get('candidates')
  @ApiOperation({ summary: 'Get candidates' })
  getCandidates(@Req() req) {
    return this.recruitmentService.getCandidates(req.user.tenantId);
  }

  @Get('applications')
  @ApiOperation({ summary: 'Get applications' })
  getApplications(@Req() req) {
    return this.recruitmentService.getApplications(req.user.tenantId);
  }
  
  @Get('interviews')
  @ApiOperation({ summary: 'Get interviews' })
  getInterviews(@Req() req) {
    return this.recruitmentService.getInterviews(req.user.tenantId);
  }
}
`,
    service: `import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RecruitmentService {
  constructor(private prisma: PrismaService) {}

  async getRequisitions(tenantId: string) {
    return this.prisma.jobRequisition.findMany({ where: { tenantId } });
  }

  async createRequisition(tenantId: string, dto: any) {
    return this.prisma.jobRequisition.create({ data: { ...dto, tenantId } });
  }

  async getCandidates(tenantId: string) {
    return this.prisma.candidate.findMany({ where: { tenantId } });
  }

  async getApplications(tenantId: string) {
    return this.prisma.jobApplication.findMany({ where: { tenantId } });
  }

  async getInterviews(tenantId: string) {
    return this.prisma.interview.findMany({ where: { tenantId } });
  }
}
`,
    module: `import { Module } from '@nestjs/common';
import { RecruitmentController } from './recruitment.controller';
import { RecruitmentService } from './recruitment.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RecruitmentController],
  providers: [RecruitmentService],
})
export class RecruitmentModule {}
`,
    dtos: {
      'recruitment.dto.ts': `export class CreateRequisitionDto {}`
    }
  },
  assets: {
    controller: `import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Assets')
@ApiBearerAuth()
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  @ApiOperation({ summary: 'Get assets' })
  getAssets(@Req() req) {
    return this.assetsService.getAssets(req.user.tenantId);
  }

  @Post()
  @ApiOperation({ summary: 'Create asset' })
  createAsset(@Req() req, @Body() dto: any) {
    return this.assetsService.createAsset(req.user.tenantId, dto);
  }

  @Get('assignments')
  @ApiOperation({ summary: 'Get asset assignments' })
  getAssignments(@Req() req) {
    return this.assetsService.getAssignments(req.user.tenantId);
  }
}
`,
    service: `import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AssetsService {
  constructor(private prisma: PrismaService) {}

  async getAssets(tenantId: string) {
    return this.prisma.asset.findMany({ where: { tenantId } });
  }

  async createAsset(tenantId: string, dto: any) {
    return this.prisma.asset.create({ data: { ...dto, tenantId } });
  }

  async getAssignments(tenantId: string) {
    return this.prisma.assetAssignment.findMany({ where: { tenantId } });
  }
}
`,
    module: `import { Module } from '@nestjs/common';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AssetsController],
  providers: [AssetsService],
})
export class AssetsModule {}
`,
    dtos: {
      'asset.dto.ts': `export class CreateAssetDto {}`
    }
  },
  helpdesk: {
    controller: `import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { HelpdeskService } from './helpdesk.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Helpdesk')
@ApiBearerAuth()
@Controller('helpdesk')
export class HelpdeskController {
  constructor(private readonly helpdeskService: HelpdeskService) {}

  @Get('tickets')
  @ApiOperation({ summary: 'Get tickets' })
  getTickets(@Req() req) {
    return this.helpdeskService.getTickets(req.user.tenantId);
  }

  @Post('tickets')
  @ApiOperation({ summary: 'Create ticket' })
  createTicket(@Req() req, @Body() dto: any) {
    return this.helpdeskService.createTicket(req.user.tenantId, dto);
  }
}
`,
    service: `import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class HelpdeskService {
  constructor(private prisma: PrismaService) {}

  async getTickets(tenantId: string) {
    return this.prisma.ticket.findMany({ where: { tenantId } });
  }

  async createTicket(tenantId: string, dto: any) {
    return this.prisma.ticket.create({ data: { ...dto, tenantId } });
  }
}
`,
    module: `import { Module } from '@nestjs/common';
import { HelpdeskController } from './helpdesk.controller';
import { HelpdeskService } from './helpdesk.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HelpdeskController],
  providers: [HelpdeskService],
})
export class HelpdeskModule {}
`,
    dtos: {
      'ticket.dto.ts': `export class CreateTicketDto {}`
    }
  },
  notifications: {
    controller: `import { Controller, Get, Post, Patch, Body, Param, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get notifications' })
  getNotifications(@Req() req) {
    return this.notificationsService.getNotifications(req.user.tenantId);
  }

  @Post()
  @ApiOperation({ summary: 'Create notification' })
  createNotification(@Req() req, @Body() dto: any) {
    return this.notificationsService.createNotification(req.user.tenantId, dto);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  markAsRead(@Req() req, @Param('id') id: string) {
    return this.notificationsService.markAsRead(req.user.tenantId, id);
  }
}
`,
    service: `import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getNotifications(tenantId: string) {
    return this.prisma.notification.findMany({ where: { tenantId } });
  }

  async createNotification(tenantId: string, dto: any) {
    return this.prisma.notification.create({ data: { ...dto, tenantId } });
  }

  async markAsRead(tenantId: string, id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });
  }
}
`,
    module: `import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
`,
    dtos: {
      'notification.dto.ts': `export class CreateNotificationDto {}`
    }
  }
};

for (const [modName, modContent] of Object.entries(modules)) {
  const modDir = path.join(baseDir, modName);
  const dtoDir = path.join(modDir, 'dto');
  
  fs.mkdirSync(dtoDir, { recursive: true });
  
  fs.writeFileSync(path.join(modDir, \`\${modName}.module.ts\`), modContent.module);
  fs.writeFileSync(path.join(modDir, \`\${modName}.controller.ts\`), modContent.controller);
  fs.writeFileSync(path.join(modDir, \`\${modName}.service.ts\`), modContent.service);
  
  if (modContent.dtos) {
    for (const [dtoName, dtoContent] of Object.entries(modContent.dtos)) {
      fs.writeFileSync(path.join(dtoDir, dtoName), dtoContent);
    }
  }
}
console.log('Modules created successfully');
