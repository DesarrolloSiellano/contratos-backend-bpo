import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObjectiveService } from './objective.service';
import { ObjectiveController } from './objective.controller';
import { Objective } from './entities/objective.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Objective])],
    controllers: [ObjectiveController],
    providers: [ObjectiveService],
    exports: [ObjectiveService],
})
export class ObjectiveModule {}
