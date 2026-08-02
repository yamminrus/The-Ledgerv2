import { SubscriptionTier, UserEntitlements } from '../types';
import { PLANS } from '../subscriptions';

export function resolveEntitlements(
  tier: SubscriptionTier = 'artist_free',
  purchasedCredits: number = 0
): UserEntitlements {
  const plan = PLANS[tier] || PLANS.artist_free;

  return {
    tier,
    monthlyUploadLimit: plan.maxUploadsPerMonth,
    remainingCredits: purchasedCredits,
    canExportPdf: plan.allowsPdfExports,
    canExportJson: tier === 'business_intelligence' || tier === 'enterprise',
    canManageTeam: plan.allowsTeamMembers,
    canAccessApi: plan.allowsApiAccess,
    hasPrioritySupport: tier === 'business_intelligence' || tier === 'enterprise',
    hasCustomRules: plan.allowsCustomRules
  };
}

export function canAnalyzeContract(
  entitlements: UserEntitlements,
  currentUsageCount: number
): boolean {
  if (entitlements.remainingCredits > 0) return true;
  if (entitlements.monthlyUploadLimit === 'unlimited') return true;
  return currentUsageCount < entitlements.monthlyUploadLimit;
}
