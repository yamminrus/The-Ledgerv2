import { PlanDetails, SubscriptionTier } from '../types';

export const PLANS: Record<SubscriptionTier, PlanDetails> = {
  artist_free: {
    id: 'artist_free',
    name: 'Artist Free',
    price: '$0/mo',
    billingPeriod: 'monthly',
    description: 'Designed for independent artists, producers, and creators reviewing occasional agreements.',
    maxUploadsPerMonth: 3,
    maxCreatorProfiles: 1,
    allowsPdfExports: true,
    allowsTeamMembers: false,
    allowsApiAccess: false,
    allowsCustomRules: false,
    features: [
      '3 Contract Uploads / Month',
      'AI Contract Summary',
      'Risk Identification',
      'Fairness Score',
      'Basic Clause Explanations',
      'Contract History'
    ]
  },
  single_review: {
    id: 'single_review',
    name: 'Single Review',
    price: '$9.99',
    billingPeriod: 'one_time',
    description: 'For artists who only need immediate help with one specific contract.',
    maxUploadsPerMonth: 1,
    maxCreatorProfiles: 1,
    allowsPdfExports: true,
    allowsTeamMembers: false,
    allowsApiAccess: false,
    allowsCustomRules: false,
    features: [
      '1 Contract Analysis',
      'Risk Report',
      'AI Explanations',
      'Downloadable PDF Summary'
    ]
  },
  creator_bundle: {
    id: 'creator_bundle',
    name: 'Creator Bundle',
    price: '$24.99',
    billingPeriod: 'one_time',
    description: 'Five review passes for creators negotiating upcoming deal cycles.',
    maxUploadsPerMonth: 5,
    maxCreatorProfiles: 1,
    allowsPdfExports: true,
    allowsTeamMembers: false,
    allowsApiAccess: false,
    allowsCustomRules: false,
    features: [
      '5 Contract Analyses',
      'Extended History',
      'Downloadable Reports',
      'Watermark-free exports'
    ]
  },
  manager_consultant: {
    id: 'manager_consultant',
    name: 'Manager / Consultant',
    price: '$29/mo',
    billingPeriod: 'monthly',
    description: 'Designed for artist managers, consultants, and legal advisors.',
    maxUploadsPerMonth: 25,
    maxCreatorProfiles: 10,
    allowsPdfExports: true,
    allowsTeamMembers: true,
    allowsApiAccess: false,
    allowsCustomRules: false,
    features: [
      'Multiple Creator Profiles',
      '25 Reviews / Month',
      'Contract Library',
      'Export PDF Reports',
      'Client Organization Tools'
    ]
  },
  business_intelligence: {
    id: 'business_intelligence',
    name: 'Business Intelligence',
    price: '$99/mo',
    billingPeriod: 'monthly',
    description: 'Designed for companies and agencies handling recurring agreements.',
    maxUploadsPerMonth: 'unlimited',
    maxCreatorProfiles: 'unlimited',
    allowsPdfExports: true,
    allowsTeamMembers: true,
    allowsApiAccess: false,
    allowsCustomRules: true,
    features: [
      'Unlimited Team Members',
      'Higher Contract Limits',
      'Custom Review Rules',
      'Organization Policies',
      'Audit Logs',
      'Collaboration Workflows',
      'Priority Support'
    ]
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    billingPeriod: 'custom',
    description: 'For record labels, publishing houses, legal teams, and enterprise scale.',
    maxUploadsPerMonth: 'unlimited',
    maxCreatorProfiles: 'unlimited',
    allowsPdfExports: true,
    allowsTeamMembers: true,
    allowsApiAccess: true,
    allowsCustomRules: true,
    features: [
      'Dedicated Infrastructure',
      'SSO Authentication',
      'API Access & Webhooks',
      'Custom Integrations',
      'Compliance Reporting',
      'SLA Agreements'
    ]
  }
};

export function getPlanDetails(tier: SubscriptionTier): PlanDetails {
  return PLANS[tier] || PLANS.artist_free;
}
