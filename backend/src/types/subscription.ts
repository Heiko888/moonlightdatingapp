export interface UserSubscription {
  id: string;
  userId: string;
  packageId: 'free' | 'basic' | 'premium' | 'vip' | 'admin';
  status: 'active' | 'inactive' | 'cancelled' | 'expired';
  startDate: string;
  endDate?: string;
  autoRenew: boolean;
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
}
