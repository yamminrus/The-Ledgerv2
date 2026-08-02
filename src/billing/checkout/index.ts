import { SubscriptionTier } from '../types';
import { stripeClient } from '../stripe-client';

export interface CreateCheckoutSessionParams {
  tier: SubscriptionTier;
  userId?: string;
  customerEmail?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutSessionResult {
  sessionId: string;
  url: string;
  mode: 'subscription' | 'payment';
  tier: SubscriptionTier;
  isMock: boolean;
}

// Default Stripe Price IDs map (configurable via env vars in production)
export const STRIPE_PRICE_MAP: Record<SubscriptionTier, string> = {
  artist_free: 'price_free_tier',
  single_review: process.env.STRIPE_PRICE_SINGLE_REVIEW || 'price_100_single_review_999',
  creator_bundle: process.env.STRIPE_PRICE_CREATOR_BUNDLE || 'price_101_creator_bundle_2499',
  manager_consultant: process.env.STRIPE_PRICE_MANAGER || 'price_102_manager_consultant_2900',
  business_intelligence: process.env.STRIPE_PRICE_BUSINESS || 'price_103_business_intel_9900',
  enterprise: process.env.STRIPE_PRICE_ENTERPRISE || 'price_104_enterprise_custom'
};

export async function createCheckoutSession(
  params: CreateCheckoutSessionParams
): Promise<CheckoutSessionResult> {
  const { tier, userId = 'user_default', customerEmail, successUrl, cancelUrl } = params;
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : (process.env.APP_URL || 'http://localhost:3000');
  
  const finalSuccessUrl = successUrl || `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&tier=${tier}`;
  const finalCancelUrl = cancelUrl || `${baseUrl}/pricing`;

  const isLiveStripe = stripeClient.isConfigured();

  if (isLiveStripe) {
    try {
      const priceId = STRIPE_PRICE_MAP[tier];
      const isOneTime = tier === 'single_review' || tier === 'creator_bundle';
      
      // Live Stripe Checkout dispatch via proxy endpoint
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          tier,
          userId,
          customerEmail,
          mode: isOneTime ? 'payment' : 'subscription',
          successUrl: finalSuccessUrl,
          cancelUrl: finalCancelUrl
        })
      });

      if (response.ok) {
        const data = await response.json();
        return {
          sessionId: data.sessionId,
          url: data.url,
          mode: isOneTime ? 'payment' : 'subscription',
          tier,
          isMock: false
        };
      }
    } catch (err) {
      console.warn('Live Stripe API call failed, falling back to simulated session:', err);
    }
  }

  // Simulated Checkout Session for pre-production testing
  const mockSessionId = `cs_ledger_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  return {
    sessionId: mockSessionId,
    url: `${finalSuccessUrl.replace('{CHECKOUT_SESSION_ID}', mockSessionId)}`,
    mode: tier === 'single_review' || tier === 'creator_bundle' ? 'payment' : 'subscription',
    tier,
    isMock: true
  };
}
