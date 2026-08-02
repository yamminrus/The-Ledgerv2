// Lazy initialization for Stripe client to prevent application startup crashes when STRIPE_SECRET_KEY is not configured.
// Keep all secret keys strictly server-side or in environment variables.

export interface StripeClientConfig {
  apiKey?: string;
  apiVersion?: string;
}

class StripeClientWrapper {
  private key: string | undefined;

  constructor() {
    this.key = process.env.STRIPE_SECRET_KEY;
  }

  public isConfigured(): boolean {
    return Boolean(process.env.STRIPE_SECRET_KEY || this.key);
  }

  public getSecretKey(): string {
    const key = process.env.STRIPE_SECRET_KEY || this.key;
    if (!key) {
      throw new Error(
        'STRIPE_SECRET_KEY environment variable is missing. Set STRIPE_SECRET_KEY in your environment variables to enable live payments.'
      );
    }
    return key;
  }

  public getPublishableKey(): string {
    return process.env.STRIPE_PUBLISHABLE_KEY || '';
  }
}

export const stripeClient = new StripeClientWrapper();
