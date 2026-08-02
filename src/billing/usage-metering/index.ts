import { UsageMetric } from '../types';

const LOCAL_STORAGE_KEY = 'ledger_usage_metrics';

export function getUsageMetric(userId: string = 'default_creator'): UsageMetric {
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_KEY}_${userId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to parse usage metric:', err);
  }

  return {
    userId,
    monthlyAnalysesUsed: 0,
    additionalCreditsPurchased: 0,
    lastAnalysisTimestamp: undefined
  };
}

export function recordAnalysisUsage(userId: string = 'default_creator'): UsageMetric {
  const current = getUsageMetric(userId);
  let remainingCredits = current.additionalCreditsPurchased;
  let usedCount = current.monthlyAnalysesUsed;

  if (remainingCredits > 0) {
    remainingCredits -= 1;
  } else {
    usedCount += 1;
  }

  const updated: UsageMetric = {
    userId,
    monthlyAnalysesUsed: usedCount,
    additionalCreditsPurchased: remainingCredits,
    lastAnalysisTimestamp: new Date().toISOString()
  };

  try {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_${userId}`, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save usage metric:', err);
  }

  return updated;
}

export function addPurchasedCredits(userId: string = 'default_creator', count: number = 5): UsageMetric {
  const current = getUsageMetric(userId);
  const updated: UsageMetric = {
    ...current,
    additionalCreditsPurchased: current.additionalCreditsPurchased + count
  };

  try {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_${userId}`, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to add purchased credits:', err);
  }

  return updated;
}
