import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractorService } from './contractor.service';
import { ContractorController } from './contractor.controller';
import { Contratista } from './entities/contractor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contratista])],
  controllers: [ContractorController],
  providers: [ContractorService],
  exports: [ContractorService],
})
export class ContractorModule {}
