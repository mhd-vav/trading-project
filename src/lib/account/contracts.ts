// src/lib/account/contracts.ts
export type VerificationStatus = "verified" | "pending" | "not_started" | "rejected";

export type AccountProfile = {
  id: string;
  displayName: string | null;
  phone: string;
  email: string | null;
  avatarUrl: string | null;
  membership: {
    planName: string | null;
    status: "active" | "inactive" | "grace" | "none";
    expiresAt: string | null;
  };
  verification: {
    phone: VerificationStatus;
    identity: VerificationStatus;
    bankCard: VerificationStatus;
  };
  preferences: {
    locale: "fa-IR" | "en-US";
    timezone: string;
    markets: Array<"forex" | "crypto">;
    tradingStyle: Array<"intraday" | "swing">;
    newsletterEnabled: boolean;
    telegramLinked: boolean;
  };
};

export type AccountSession = {
  id: string;
  deviceLabel: string;
  locationLabel: string | null;
  lastSeenAt: string;
  current: boolean;
};

export type ProfilePayload = {
  profile: AccountProfile;
  sessions: AccountSession[];
};

export type ReferralReward = {
  qualifyingSubscriptionsPerReward: number;
  chartAccessDaysPerReward: number;
  qualifiedSubscriptions: number;
  pendingSubscriptions: number;
  earnedRewardMonths: number;
  nextRewardProgress: number;
};

export type ReferralInvite = {
  id: string;
  displayName: string | null;
  joinedAt: string;
  subscriptionStatus: "pending" | "qualified" | "not_qualified";
  qualifiedAt: string | null;
};

export type ReferralPayload = {
  referralCode: string | null;
  referralUrl: string | null;
  reward: ReferralReward;
  invites: ReferralInvite[];
};

export type ReferralCodePayload = {
  referralCode: string;
  referralUrl: string;
};

export type UpdateAccountProfileInput = {
  displayName: string | null;
  preferences: AccountProfile["preferences"];
};

export type AccountApiEnvelope<TData> = {
  configured: boolean;
  data: TData | null;
  message?: string;
};

export function isAccountApiEnvelope<TData>(value: unknown): value is AccountApiEnvelope<TData> {
  return (
    value !== null &&
    typeof value === "object" &&
    "configured" in value &&
    typeof (value as { configured?: unknown }).configured === "boolean"
  );
}
