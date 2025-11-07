import { TPlan } from '@core/types/plan.type';

export type TSubscription = {
  id: number;
  userId: number;
  planId: number;
  plan: TPlan;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
}
