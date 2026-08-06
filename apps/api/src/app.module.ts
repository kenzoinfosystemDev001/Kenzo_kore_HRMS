import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { LeaveModule } from './modules/leave/leave.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { HealthModule } from './modules/health/health.module';
import { PayrollModule } from './modules/payroll/payroll.module';
import { PerformanceModule } from './modules/performance/performance.module';
import { RecruitmentModule } from './modules/recruitment/recruitment.module';
import { AssetsModule } from './modules/assets/assets.module';
import { HelpdeskModule } from './modules/helpdesk/helpdesk.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

import { AppController } from './app.controller';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        NODE_ENV: Joi.string().required(),
        PORT: Joi.number().required(),
        FRONTEND_URL: Joi.string().required(),
      }),
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    EmployeesModule,
    OrganizationModule,
    AttendanceModule,
    LeaveModule,
    DashboardModule,
    HealthModule,
    PayrollModule,
    PerformanceModule,
    RecruitmentModule,
    AssetsModule,
    HelpdeskModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
