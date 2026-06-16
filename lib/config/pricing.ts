// lib/config/pricing.ts
export const PRICING = {
  INDIVIDUAL: 17, // USD
  TEAM_PER_PERSON: 17, // USD per person
  TEAM_MIN_MEMBERS: 3,
  TEAM_UNLOCK_THRESHOLD: 3, // Basic insights
  TEAM_FULL_UNLOCK_THRESHOLD: 5, // Full diagnostic
  CURRENCY: "USD",
  CURRENCY_SYMBOL: "$",
} as const;

export function formatPrice(amount: number): string {
  return `${PRICING.CURRENCY_SYMBOL}${amount}`;
}

export function getTeamTotalPrice(memberCount: number): number {
  return memberCount * PRICING.TEAM_PER_PERSON;
}
