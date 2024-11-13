import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule, NOTIFICATION_SERVICE } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        STRIPE_SECRET_KEY: Joi.string().required(),
        NOTIFICATION_SERVICE_HOST: Joi.string().required(),
        NOTIFICATION_SERVICE_PORT: Joi.number().required(),
      }),
      envFilePath: '.env',
      cache: true,
      expandVariables: true,
    }),
    LoggerModule,
    ClientsModule.registerAsync([
      {
        name: NOTIFICATION_SERVICE,
        useFactory: (configSerice: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configSerice.get('NOTIFICATION_SERVICE_HOST'),
            port: configSerice.get('NOTIFICATION_SERVICE_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
