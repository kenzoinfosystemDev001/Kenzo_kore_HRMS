import { Module } from '@nestjs/common';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { DesignationsController } from './designations.controller';
import { DesignationsService } from './designations.service';
import { BranchesController } from './branches.controller';
import { BranchesService } from './branches.service';

@Module({
  controllers: [DepartmentsController, TeamsController, DesignationsController, BranchesController],
  providers: [DepartmentsService, TeamsService, DesignationsService, BranchesService],
  exports: [DepartmentsService, TeamsService, DesignationsService, BranchesService],
})
export class OrganizationModule {}
