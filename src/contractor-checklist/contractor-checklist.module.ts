import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractorChecklistService } from './contractor-checklist.service';
import { ContractorChecklistController } from './contractor-checklist.controller';
import { ContractorChecklist } from './entities/contractor-checklist.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ContractorChecklist])],
    controllers: [ContractorChecklistController],
    providers: [ContractorChecklistService],
    exports: [ContractorChecklistService],
})
export class ContractorChecklistModule {}
