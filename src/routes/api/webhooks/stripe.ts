import { createFileRoute } from '@tanstack/react-router';
import { handleWebhookEvent, isPaymentEnabled } from '@/payment';

/** Stripe webhook; configure checkout.session.completed and invoice.paid. */
export const Route = createFileRoute('/api/webhooks/stripe')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isPaymentEnabled())
          return Response.json({ received: true }, { status: 200 });
        const payload = await request.text();
        const signature = request.headers.get('stripe-signature') ?? '';
        if (!payload || !signature)
          return Response.json(
            { error: 'Missing payload or signature' },
            { status: 400 }
          );
        try {
          await handleWebhookEvent(payload, signature);
          return Response.json({ received: true }, { status: 200 });
        } catch (error) {
          console.error('Stripe webhook processing failed', error);
          return Response.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
          );
        }
      },
    },
  },
});
