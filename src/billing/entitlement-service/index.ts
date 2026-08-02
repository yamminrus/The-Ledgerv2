import { SubscriptionTier, UserEntitlements } from '../types';
import { resolveEntitlements } from '../entitlements';
import { getUsageMetric } from '../usage-metering';

export interface EntitlementCheckResult {
  allowed: boolean;
  tier: SubscriptionTier;
  reason?: string;
  remainingUploads: number | 'unlimited';
  purchasedCredits: number;
}

export class EntitlementService {
  private userId: string;
  private currentTier: SubscriptionTier;

  constructor(userId: string = 'default_creator', tier: SubscriptionTier = 'artist_free') {
    this.userId = userId;
    this.currentTier = tier;
  }

  public getEntitlements(): UserEntitlements {
    const usage = getUsageMetric(this.userId);
    return resolveEntitlements(this.currentTier, usage.additionalCreditsPurchased);
  }

  public canPerformContractAnalysis(): EntitlementCheckResult {
    const entitlements = this.getEntitlements();
    const usage = getUsageMetric(this.userId);

    // If customer has prepaid credits from Single Review or Creator Bundle
    if (usage.additionalCreditsPurchased > 0) {
      return {
        allowed: true,
        tier: this.currentTier,
        remainingUploads: 'unlimited',
        purchasedCredits: usage.additionalCreditsPurchased
      };
    }

    // Unlimited monthly uploads
    if (entitlements.monthlyUploadLimit === 'unlimited') {
      return {
        allowed: true,
        tier: this.currentTier,
        remainingUploads: 'unlimited',
        purchasedCredits: 0
      };
    }

    // Check monthly usage cap
    const remaining = entitlements.monthlyUploadLimit - usage.monthlyAnalysesUsed;
    if (remaining > 0) {
      return {
        allowed: true,
        tier: this.currentTier,
        remainingUploads: remaining,
        purchasedCredits: 0
      };
    }

    return {
      allowed: false,
      tier: this.currentTier,
      reason: `Monthly upload limit reached (${entitlements.monthlyUploadLimit} analyses/month for ${entitlements.tier}). Upgrade your plan or purchase additional reviews to continue.`,
      remainingUploads: 0,
      purchasedCredits: 0
    };
  }

  public canExportPdfReport(): boolean {
    const entitlements = this.getEntitlements();
    return entitlements.canExportPdf;
  }

  public canExportJsonData(): boolean {
    const entitlements = this.getEntitlements();
    return entitlements.canExportJson;
  }

  public canManageTeamMembers(): boolean {
    const entitlements = this.getEntitlements();
    return entitlements.canManageTeam;
  }

  public canAccessApi(): boolean {
    const entitlements = this.getEntitlements();
    return entitlements.canAccessApi;
  }
}

export const entitlementService = new EntitlementService();
