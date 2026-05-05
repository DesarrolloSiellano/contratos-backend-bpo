import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigService } from '@nestjs/config';



@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'), // Lee la URI desde las variables de entorno
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([

    ]),
  ],
  exports: [MongooseModule]
})
export class DatabaseModule { }