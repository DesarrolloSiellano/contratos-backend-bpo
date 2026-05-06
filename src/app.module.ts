import { Module } from '@nestjs/common';
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TaskModule } from './task/task.module';
import { DatabasePSModule } from './core/database/postgres.module';
import { ContractorModule } from './contractor/contractor.module';
import { ContractorChecklistModule } from './contractor-checklist/contractor-checklist.module';
import { ContractModule } from './contract/contract.module';
import { EvaluationModule } from './evaluation/evaluation.module';
import { PeriodModule } from './period/period.module';
import { ObjectiveModule } from './objective/objective.module';
import { SupportModule } from './support/support.module';
import { LoggerModule } from 'nestjs-pino';
import { IdempotencyModule } from './core/idempotency/idempotency.module';
import { AuthModule } from './core/modules/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        timestamp: () => `,"time":"${new Intl.DateTimeFormat('sv-SE', {
          timeZone: 'America/Bogota',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }).format(new Date()).replace(' ', 'T')}"`,
        transport: {
          targets: [
            {
              target: 'pino-pretty',
              options: {
                colorize: true,
                singleLine: true,
              },
              level: 'info',
            },
            {
              target: 'pino-roll',
              options: {
                file: path.join(process.cwd(), 'logs', 'app.log'),
                frequency: 'daily',
                mkdir: true,
              },
              level: 'info',
            },
          ],
        },
      },
    }),
    DatabasePSModule,
    TaskModule,
    ContractorModule,
    ContractorChecklistModule,
    ContractModule,
    EvaluationModule,
    PeriodModule,
    ObjectiveModule,
    SupportModule,
    IdempotencyModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
