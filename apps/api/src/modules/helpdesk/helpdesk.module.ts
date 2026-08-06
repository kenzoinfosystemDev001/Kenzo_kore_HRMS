import { Module } from '@nestjs/common';
import { HelpdeskController } from './helpdesk.controller';
import { HelpdeskService } from './helpdesk.service';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HelpdeskController],
  providers: [HelpdeskService],
})
export class HelpdeskModule {}
