export type SubscriptionTier = 
  | 'artist_free' 
  | 'single_review' 
  | 'creator_bundle' 
  | 'manager_consultant' 
  | 'business_intelligence' 
  | 'enterprise';

export interface PlanDetails {
  id: SubscriptionTier;
  name: string;
  price: string;
  billingPeriod: 'monthly' | 'one_time' | 'custom';
  description: string;
  features: string[];
  maxUploadsPerMonth: number | 'unlimited';
  maxCreatorProfiles: number | 'unlimited';
  allowsPdfExports: boolean;
  allowsTeamMembers: boolean;
  allowsApiAccess: boolean;
  allowsCustomRules: boolean;
}

export interface UserEntitlements {
  tier: SubscriptionTier;
  monthlyUploadLimit: number | 'unlimited';
  remainingCredits: number;
  canExportPdf: boolean;
  canExportJson: boolean;
  canManageTeam: boolean;
  canAccessApi: boolean;
  hasPrioritySupport: boolean;
  hasCustomRules: boolean;
}

export interface UsageMetric {
  userId: string;
  monthlyAnalysesUsed: number;
  additionalCreditsPurchased: number;
  lastAnalysisTimestamp?: string;
}

export interface StripeBillingEvent {
  eventId: string;
  eventType: 'checkout.session.completed' | 'customer.subscription.created' | 'customer.subscription.updated' | 'customer.subscription.deleted';
  customerId: string;
  tier: SubscriptionTier;
  status: 'active' | 'past_due' | 'canceled' | 'trialing';
  currentPeriodEnd: number;
}
