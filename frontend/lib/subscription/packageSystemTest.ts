/**
 * Paket-System Test Suite
 * Vollständige Tests für AccessControl und Subscription-System
 */

import { checkPageAccess } from './accessControl';
import { UserSubscription } from './types';

// Test-Daten für verschiedene Paket-Level
const testSubscriptions: Record<string, UserSubscription> = {
  free: {
    userId: 'test-free',
    packageId: 'free',
    status: 'active',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    autoRenew: false,
    paymentMethod: 'none',
    billingCycle: 'monthly'
  },
  basic: {
    userId: 'test-basic',
    packageId: 'basic',
    status: 'active',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    autoRenew: true,
    paymentMethod: 'free',
    billingCycle: 'monthly'
  },
  premium: {
    userId: 'test-premium',
    packageId: 'premium',
    status: 'active',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    autoRenew: true,
    paymentMethod: 'card',
    billingCycle: 'monthly'
  },
  vip: {
    userId: 'test-vip',
    packageId: 'vip',
    status: 'active',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    autoRenew: true,
    paymentMethod: 'card',
    billingCycle: 'yearly'
  },
  admin: {
    userId: 'test-admin',
    packageId: 'admin',
    status: 'active',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    autoRenew: true,
    paymentMethod: 'admin',
    billingCycle: 'yearly'
  }
};

// Test-Seiten mit erwarteten Ergebnissen
const testPages = [
  // Öffentliche Seiten (sollten für alle zugänglich sein)
  { path: '/', expectedAccess: { free: true, basic: true, premium: true, vip: true, admin: true } },
  { path: '/login', expectedAccess: { free: true, basic: true, premium: true, vip: true, admin: true } },
  { path: '/register', expectedAccess: { free: true, basic: true, premium: true, vip: true, admin: true } },
  { path: '/sales', expectedAccess: { free: true, basic: true, premium: true, vip: true, admin: true } },
  { path: '/pricing', expectedAccess: { free: true, basic: true, premium: true, vip: true, admin: true } },

  // Basic-Seiten (sollten für basic+ zugänglich sein)
  { path: '/dashboard', expectedAccess: { free: false, basic: true, premium: true, vip: true, admin: true } },
  { path: '/mobile-dashboard', expectedAccess: { free: false, basic: true, premium: true, vip: true, admin: true } },
  { path: '/chart', expectedAccess: { free: false, basic: true, premium: true, vip: true, admin: true } },
  { path: '/community', expectedAccess: { free: false, basic: true, premium: true, vip: true, admin: true } },
  { path: '/settings', expectedAccess: { free: false, basic: true, premium: true, vip: true, admin: true } },

  // Premium-Seiten (sollten für premium+ zugänglich sein)
  { path: '/chart-comparison', expectedAccess: { free: false, basic: false, premium: true, vip: true, admin: true } },
  { path: '/bodygraph-advanced', expectedAccess: { free: false, basic: false, premium: true, vip: true, admin: true } },
  { path: '/coaching-new', expectedAccess: { free: false, basic: false, premium: true, vip: true, admin: true } },
  { path: '/knowledge', expectedAccess: { free: false, basic: false, premium: true, vip: true, admin: true } },
  { path: '/journal', expectedAccess: { free: false, basic: false, premium: true, vip: true, admin: true } },
  { path: '/reading', expectedAccess: { free: false, basic: false, premium: true, vip: true, admin: true } },

  // VIP-Seiten (sollten nur für vip+ zugänglich sein)
  { path: '/dashboard-vip', expectedAccess: { free: false, basic: false, premium: false, vip: true, admin: true } },
  { path: '/vip-community', expectedAccess: { free: false, basic: false, premium: false, vip: true, admin: true } },
  { path: '/personal-coach', expectedAccess: { free: false, basic: false, premium: false, vip: true, admin: true } },
  { path: '/analytics', expectedAccess: { free: false, basic: false, premium: false, vip: true, admin: true } },
  { path: '/api-access', expectedAccess: { free: false, basic: false, premium: false, vip: true, admin: true } },

  // Admin-Seiten (sollten nur für admin zugänglich sein)
  { path: '/admin', expectedAccess: { free: false, basic: false, premium: false, vip: false, admin: true } },
  { path: '/admin/users', expectedAccess: { free: false, basic: false, premium: false, vip: false, admin: true } }
];

export class PackageSystemTestSuite {
  private testResults: Array<{
    page: string;
    package: string;
    expected: boolean;
    actual: boolean;
    passed: boolean;
    message: string;
  }> = [];

  /**
   * Führe alle Paket-System-Tests aus
   */
  async runAllTests(): Promise<{
    totalTests: number;
    passedTests: number;
    failedTests: number;
    successRate: number;
    results: typeof this.testResults;
  }> {
    console.log('🧪 Starte Paket-System-Tests...');
    
    this.testResults = [];

    // Teste jede Seite mit jedem Paket-Level
    for (const testPage of testPages) {
      for (const [packageName, subscription] of Object.entries(testSubscriptions)) {
        const expectedAccess = testPage.expectedAccess[packageName as keyof typeof testPage.expectedAccess];
        const actualAccess = checkPageAccess(testPage.path, subscription);
        
        const passed = actualAccess.canAccess === expectedAccess;
        const message = passed 
          ? `✅ ${packageName} → ${testPage.path}: ${actualAccess.canAccess ? 'Zugang gewährt' : 'Zugang verweigert'}`
          : `❌ ${packageName} → ${testPage.path}: Erwartet ${expectedAccess}, erhalten ${actualAccess.canAccess}`;

        this.testResults.push({
          page: testPage.path,
          package: packageName,
          expected: expectedAccess,
          actual: actualAccess.canAccess,
          passed,
          message
        });

        console.log(message);
      }
    }

    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;
    const successRate = (passedTests / totalTests) * 100;

    console.log(`\n📊 Test-Ergebnisse:`);
    console.log(`   Gesamt: ${totalTests}`);
    console.log(`   Bestanden: ${passedTests}`);
    console.log(`   Fehlgeschlagen: ${failedTests}`);
    console.log(`   Erfolgsrate: ${successRate.toFixed(1)}%`);

    if (failedTests > 0) {
      console.log(`\n❌ Fehlgeschlagene Tests:`);
      this.testResults
        .filter(r => !r.passed)
        .forEach(r => console.log(`   ${r.message}`));
    }

    return {
      totalTests,
      passedTests,
      failedTests,
      successRate,
      results: this.testResults
    };
  }

  /**
   * Teste spezifische Paket-Hierarchie
   */
  testPackageHierarchy(): boolean {
    console.log('🔍 Teste Paket-Hierarchie...');
    
    const hierarchy = ['free', 'basic', 'premium', 'vip', 'admin'];
    let allPassed = true;

    for (let i = 0; i < hierarchy.length; i++) {
      const currentPackage = hierarchy[i];
      const subscription = testSubscriptions[currentPackage];
      
      // Teste, dass höhere Pakete Zugang zu niedrigeren Paket-Seiten haben
      for (let j = 0; j <= i; j++) {
        const testPackage = hierarchy[j];
        const testPath = testPackage === 'free' ? '/' : `/${testPackage}-page`;
        
        // Für Basic+ sollte Zugang zu Basic-Seiten gewährt werden
        if (testPackage === 'basic' && ['basic', 'premium', 'vip', 'admin'].includes(currentPackage)) {
          const access = checkPageAccess('/dashboard', subscription);
          if (!access.canAccess) {
            console.log(`❌ ${currentPackage} sollte Zugang zu Basic-Seiten haben`);
            allPassed = false;
          }
        }
      }
    }

    console.log(allPassed ? '✅ Paket-Hierarchie korrekt' : '❌ Paket-Hierarchie fehlerhaft');
    return allPassed;
  }

  /**
   * Teste Edge Cases
   */
  testEdgeCases(): boolean {
    console.log('🔍 Teste Edge Cases...');
    
    let allPassed = true;

    // Test 1: Null/undefined subscription
    const nullAccess = checkPageAccess('/dashboard', null);
    if (nullAccess.canAccess) {
      console.log('❌ Null-Subscription sollte keinen Zugang gewähren');
      allPassed = false;
    }

    // Test 2: Ungültige Pfade
    const invalidPathAccess = checkPageAccess('/invalid-path', testSubscriptions.basic);
    if (invalidPathAccess.canAccess) {
      console.log('❌ Ungültige Pfade sollten keinen Zugang gewähren');
      allPassed = false;
    }

    // Test 3: Leere Pfade
    const emptyPathAccess = checkPageAccess('', testSubscriptions.basic);
    if (emptyPathAccess.canAccess) {
      console.log('❌ Leere Pfade sollten keinen Zugang gewähren');
      allPassed = false;
    }

    console.log(allPassed ? '✅ Edge Cases korrekt' : '❌ Edge Cases fehlerhaft');
    return allPassed;
  }

  /**
   * Generiere Test-Report
   */
  generateReport(): string {
    const failedTests = this.testResults.filter(r => !r.passed);
    
    let report = '# 📊 Paket-System Test Report\n\n';
    report += `**Datum:** ${new Date().toLocaleString()}\n\n`;
    report += `**Gesamt-Tests:** ${this.testResults.length}\n`;
    report += `**Bestanden:** ${this.testResults.filter(r => r.passed).length}\n`;
    report += `**Fehlgeschlagen:** ${failedTests.length}\n`;
    report += `**Erfolgsrate:** ${((this.testResults.filter(r => r.passed).length / this.testResults.length) * 100).toFixed(1)}%\n\n`;

    if (failedTests.length > 0) {
      report += '## ❌ Fehlgeschlagene Tests\n\n';
      failedTests.forEach(test => {
        report += `- **${test.package}** → **${test.page}**: Erwartet ${test.expected}, erhalten ${test.actual}\n`;
      });
    }

    return report;
  }
}

// Export für direkte Verwendung
export const packageSystemTest = new PackageSystemTestSuite();
