import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { ensureDatabaseExists } from './core/database/database-utils';
import { ResponseInterceptor } from './core/interceptors/response.interceptor';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';

async function bootstrap() {
  // Asegurar que la base de datos existe antes de que TypeORM intente conectarse
  await ensureDatabaseExists();

  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = app.get(Logger);
  app.useLogger(logger);

  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');

  // Configuración de CORS
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN', '*'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
  });


  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Contratos API')
    .setDescription('Documentación de la API de Contratos')
    .setVersion('1.0')
    .addTag('contracts')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Ingrese el token JWT en formato Bearer',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
