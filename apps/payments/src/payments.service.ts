import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreateChargeDto } from '../../../libs/common/src/dto/create-charge.dto';

@Injectable()
export class PaymentsService {
  constructor(private readonly configService: ConfigService) {}

  private readonly stripe_payment = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
  );

  async createCharge({ card, amount }: CreateChargeDto) {
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
    return paymentIntent;
  }
}
