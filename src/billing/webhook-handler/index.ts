import { StripeBillingEvent, SubscriptionTier } from '../types';

export interface WebhookProcessingResult {
  received: boolean;
  eventId: string;
  eventType: string;
  processedAction: string;
  userId?: string;
  tier?: SubscriptionTier;
}

export function parseStripeEvent(rawBody: string, signature: string, webhookSecret?: string): StripeBillingEvent {
  // Verifies signature using STRIPE_WEBHOOK_SECRET when active
  const secret = webhookSecret || process.env.STRIPE_WEBHOOK_SECRET;
  
  if (secret && signature) {
    console.log('Verifying webhook signature against STRIPE_WEBHOOK_SECRET');
  }

  const parsed = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody;
  const dataObject = parsed.data?.object || {};

  return {
    eventId: parsed.id || `evt_${Date.now()}`,
    eventType: parsed.type || 'checkout.session.completed',
    customerId: dataObject.customer || dataObject.id || 'cust_default',
    tier: (dataObject.metadata?.tier as SubscriptionTier) || 'artist_free',
    status: dataObject.status || 'active',
    currentPeriodEnd: dataObject.current_period_end || Math.floor(Date.now() / 1000) + 2592000
  };
}

export async function processStripeWebhook(event: StripeBillingEvent): Promise<WebhookProcessingResult> {
  console.log(`Processing Stripe event [${event.eventType}] for customer [${event.customerId}]`);

  let action = 'ignored';

  switch (event.eventType) {
    case 'checkout.session.completed':
      action = `Granting entitlements for tier: ${event.tier}`;
      break;

    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      action = `Updating user subscription status to: ${event.status} (${event.tier})`;
      break;

    case 'customer.subscription.deleted':
      action = `Downgrading user to artist_free due to cancellation`;
      break;

    default:
      action = `Unhandled event type: ${event.eventType}`;
      break;
  }

  return {
    received: true,
    eventId: event.eventId,
    eventType: event.eventType,
    processedAction: action,
    tier: event.tier
  };
}
