/**
 * Tests für das Paket-System
 * Überprüft Zugriffsrechte und Paket-Hierarchie
 */

import { 
  hasAccess, 
  checkPageAccess, 
  getAvailablePages, 
  getPackageFeatures, 
  getPackageHierarchy,
  canUpgrade,
  getNextPackage,
  UserPackage,
  UserSubscription
} from '@/lib/access-control/packageSystem';

describe('Package System Tests', () => {
  
  describe('hasAccess', () => {
    it('should allow access for same package level', () => {
      expect(hasAccess('basic', 'basic')).toBe(true);
      expect(hasAccess('premium', 'premium')).toBe(true);
      expect(hasAccess('vip', 'vip')).toBe(true);
    });

    it('should allow access for higher package levels', () => {
      expect(hasAccess('premium', 'basic')).toBe(true);
      expect(hasAccess('vip', 'premium')).toBe(true);
      expect(hasAccess('admin', 'vip')).toBe(true);
    });

    it('should deny access for lower package levels', () => {
      expect(hasAccess('basic', 'premium')).toBe(false);
      expect(hasAccess('premium', 'vip')).toBe(false);
      expect(hasAccess('vip', 'admin')).toBe(false);
    });

    it('should handle free package correctly', () => {
      expect(hasAccess('free', 'free')).toBe(true);
      expect(hasAccess('basic', 'free')).toBe(true);
      expect(hasAccess('free', 'basic')).toBe(false);
    });
  });

  describe('checkPageAccess', () => {
    const mockUserSubscription: UserSubscription = {
      id: 'test-user-1',
      user_id: 'user-123',
      package: 'basic',
      status: 'active',
      expires_at: '2024-12-31T23:59:59Z',
      created_at: '2024-01-01T00:00:00Z'
    };

    it('should allow access to public pages', () => {
      expect(checkPageAccess('/', mockUserSubscription)).toBe(true);
      expect(checkPageAccess('/login', mockUserSubscription)).toBe(true);
      expect(checkPageAccess('/register', mockUserSubscription)).toBe(true);
    });

    it('should allow access to basic pages for basic users', () => {
      expect(checkPageAccess('/dashboard', mockUserSubscription)).toBe(true);
      expect(checkPageAccess('/chart', mockUserSubscription)).toBe(true);
      expect(checkPageAccess('/community', mockUserSubscription)).toBe(true);
    });

    it('should deny access to premium pages for basic users', () => {
      expect(checkPageAccess('/mondkalender', mockUserSubscription)).toBe(false);
      expect(checkPageAccess('/coaching', mockUserSubscription)).toBe(false);
      expect(checkPageAccess('/analytics', mockUserSubscription)).toBe(false);
    });

    it('should handle null subscription', () => {
      expect(checkPageAccess('/', null)).toBe(true);
      expect(checkPageAccess('/dashboard', null)).toBe(false);
    });
  });

  describe('getAvailablePages', () => {
    it('should return correct pages for free users', () => {
      const pages = getAvailablePages('free');
      expect(pages).toContainEqual(expect.objectContaining({ path: '/' }));
      expect(pages).toContainEqual(expect.objectContaining({ path: '/login' }));
      expect(pages).not.toContainEqual(expect.objectContaining({ path: '/dashboard' }));
    });

    it('should return correct pages for basic users', () => {
      const pages = getAvailablePages('basic');
      expect(pages).toContainEqual(expect.objectContaining({ path: '/dashboard' }));
      expect(pages).toContainEqual(expect.objectContaining({ path: '/chart' }));
      expect(pages).not.toContainEqual(expect.objectContaining({ path: '/mondkalender' }));
    });

    it('should return correct pages for premium users', () => {
      const pages = getAvailablePages('premium');
      expect(pages).toContainEqual(expect.objectContaining({ path: '/mondkalender' }));
      expect(pages).toContainEqual(expect.objectContaining({ path: '/coaching' }));
      expect(pages).not.toContainEqual(expect.objectContaining({ path: '/analytics' }));
    });

    it('should return all pages for admin users', () => {
      const pages = getAvailablePages('admin');
      expect(pages.length).toBeGreaterThan(0);
      expect(pages).toContainEqual(expect.objectContaining({ path: '/admin' }));
    });
  });

  describe('getPackageFeatures', () => {
    it('should return correct features for each package', () => {
      const freeFeatures = getPackageFeatures('free');
      expect(freeFeatures).toContain('App-Übersicht');
      expect(freeFeatures).toContain('Grundlegende Informationen');

      const basicFeatures = getPackageFeatures('basic');
      expect(basicFeatures).toContain('Persönliches Dashboard');
      expect(basicFeatures).toContain('Human Design Chart');

      const premiumFeatures = getPackageFeatures('premium');
      expect(premiumFeatures).toContain('Mondkalender');
      expect(premiumFeatures).toContain('Coaching-Sessions');

      const vipFeatures = getPackageFeatures('vip');
      expect(vipFeatures).toContain('VIP Dashboard');
      expect(vipFeatures).toContain('Persönlicher Coach');

      const adminFeatures = getPackageFeatures('admin');
      expect(adminFeatures).toContain('Admin-Dashboard');
      expect(adminFeatures).toContain('Benutzerverwaltung');
    });
  });

  describe('getPackageHierarchy', () => {
    it('should return correct hierarchy', () => {
      const hierarchy = getPackageHierarchy();
      expect(hierarchy.free).toBe(0);
      expect(hierarchy.basic).toBe(1);
      expect(hierarchy.premium).toBe(2);
      expect(hierarchy.vip).toBe(3);
      expect(hierarchy.admin).toBe(4);
    });
  });

  describe('canUpgrade', () => {
    it('should allow upgrades to higher packages', () => {
      expect(canUpgrade('free', 'basic')).toBe(true);
      expect(canUpgrade('basic', 'premium')).toBe(true);
      expect(canUpgrade('premium', 'vip')).toBe(true);
      expect(canUpgrade('vip', 'admin')).toBe(true);
    });

    it('should deny upgrades to same or lower packages', () => {
      expect(canUpgrade('basic', 'basic')).toBe(false);
      expect(canUpgrade('premium', 'basic')).toBe(false);
      expect(canUpgrade('vip', 'premium')).toBe(false);
    });
  });

  describe('getNextPackage', () => {
    it('should return next higher package', () => {
      expect(getNextPackage('free')).toBe('basic');
      expect(getNextPackage('basic')).toBe('premium');
      expect(getNextPackage('premium')).toBe('vip');
      expect(getNextPackage('vip')).toBe('admin');
      expect(getNextPackage('admin')).toBe(null);
    });
  });

  describe('Edge Cases', () => {
    it('should handle invalid package types gracefully', () => {
      // @ts-ignore - Testing invalid input
      expect(() => hasAccess('invalid', 'basic')).not.toThrow();
      // @ts-ignore - Testing invalid input
      expect(() => getPackageFeatures('invalid')).not.toThrow();
    });

    it('should handle expired subscriptions', () => {
      const expiredSubscription: UserSubscription = {
        id: 'test-user-2',
        user_id: 'user-456',
        package: 'premium',
        status: 'expired',
        expires_at: '2023-01-01T00:00:00Z',
        created_at: '2023-01-01T00:00:00Z'
      };

      // Should still allow access to free pages
      expect(checkPageAccess('/', expiredSubscription)).toBe(true);
      // Should deny access to premium pages
      expect(checkPageAccess('/mondkalender', expiredSubscription)).toBe(false);
    });

    it('should handle inactive subscriptions', () => {
      const inactiveSubscription: UserSubscription = {
        id: 'test-user-3',
        user_id: 'user-789',
        package: 'basic',
        status: 'inactive',
        expires_at: '2024-12-31T23:59:59Z',
        created_at: '2024-01-01T00:00:00Z'
      };

      // Should still allow access to free pages
      expect(checkPageAccess('/', inactiveSubscription)).toBe(true);
      // Should deny access to basic pages
      expect(checkPageAccess('/dashboard', inactiveSubscription)).toBe(false);
    });
  });
});
