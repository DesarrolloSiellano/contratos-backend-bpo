import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportService } from './support.service';
import { SupportController } from './support.controller';
import { Support } from './entities/support.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Support])],
    controllers: [SupportController],
    providers: [SupportService],
    exports: [SupportService],
})
export class SupportModule {}
