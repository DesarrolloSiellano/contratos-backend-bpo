// src/database/database.module.ts
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TenantSubscriber } from '../tenant/tenant.subscriber';

@Global()
@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                host: config.get<string>('DB_HOST_PS') || config.get<string>('DB_HOST') || 'localhost',
                port: Number(config.get<number>('DB_PORT_PS') || config.get<number>('DB_PORT') || 5432),
                username: config.get<string>('DB_USERNAME_PS') || config.get<string>('DB_USERNAME') || 'postgres',
                password: config.get<string>('DB_PASSWORD_PS') || config.get<string>('DB_PASSWORD') || '',
                database: config.get<string>('DB_NAME_PS') || config.get<string>('DB_NAME') || 'contratos_db',
                autoLoadEntities: true,
                synchronize: config.get<string>('NODE_ENV') !== 'production',
            }),
        }),
    ],
    providers: [TenantSubscriber],
    exports: [TypeOrmModule],
})
export class DatabasePSModule { }