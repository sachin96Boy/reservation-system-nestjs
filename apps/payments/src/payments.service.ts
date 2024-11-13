import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { NOTIFICATION_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from '../dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationServiceClient: ClientProxy,
  ) {}

  private readonly stripe_payment = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
  );

  async createCharge({ card, amount, email }: PaymentsCreateChargeDto) {
    const paymentMethod = await this.stripe_payment.paymentMethods.create({
      type: 'card',
      card: card,
    });

    const paymentIntent = await this.stripe_payment.paymentIntents.create({
      payment_method: paymentMethod.id,
      amount: amount * 100,
      currency: 'usd',
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // apply notifications
    this.notificationServiceClient.emit('notify_email', {
      email: email,
      text: 'Your payment was successful',
    });

    return paymentIntent;
  }
}
