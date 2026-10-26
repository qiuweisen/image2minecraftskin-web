import { createFileRoute } from '@tanstack/react-router';
import { handleWebhookEvent, isPaymentEnabled } from '@/payment';

export const Route = createFileRoute('/api/webhooks/creem')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isPaymentEnabled())
          return Response.json({ received: true }, { status: 200 });
        const payload = await request.text();
        const signature = request.headers.get('creem-signature') ?? '';
        if (!payload || !signature)
          return Response.json(
            { error: 'Missing payload or signature' },
            { status: 400 }
          );
        try {
          await handleWebhookEvent(payload, signature);
          return Response.json({ received: true }, { status: 200 });
        } catch (error) {
          console.error('Creem webhook processing failed', error);
          return Response.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
          );
        }
      },
    },
  },
});
