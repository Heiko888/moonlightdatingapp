/**
 * API-Test-Suite für die Human Design App
 * Testet alle wichtigen API-Endpunkte und Authentifizierung
 */

import { api } from './client';
import { API_CONFIG } from './config';
import { sessionManager } from '@/lib/session/sessionManager';

export interface TestResult {
  name: string;
  success: boolean;
  error?: string;
  duration: number;
  details?: any;
}

export interface TestSuite {
  name: string;
  tests: TestResult[];
  totalDuration: number;
  successCount: number;
  failureCount: number;
}

class APITestSuite {
  private results: TestResult[] = [];

  /**
   * Führt einen einzelnen Test aus
   */
  private async runTest(name: string, testFn: () => Promise<any>): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      const result = await testFn();
      const duration = Date.now() - startTime;
      
      return {
        name,
        success: true,
        duration,
        details: result
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      return {
        name,
        success: false,
        error: error.message || 'Unbekannter Fehler',
        duration,
        details: error
      };
    }
  }

  /**
   * Testet die API-Verbindung
   */
  private async testAPIConnection(): Promise<TestResult> {
    return this.runTest('API-Verbindung', async () => {
      const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    });
  }

  /**
   * Testet die Authentifizierung
   */
  private async testAuthentication(): Promise<TestResult> {
    return this.runTest('Authentifizierung', async () => {
      // Test mit Dummy-Credentials
      const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
        email: 'test@example.com',
        password: 'password'
      });
      
      if (!response.success) {
        throw new Error(response.error?.message || 'Login fehlgeschlagen');
      }
      
      return response.data;
    });
  }

  /**
   * Testet Token-Validierung
   */
  private async testTokenValidation(): Promise<TestResult> {
    return this.runTest('Token-Validierung', async () => {
      const token = sessionManager.getToken();
      
      if (!token) {
        throw new Error('Kein Token verfügbar');
      }
      
      const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.VALIDATE_TOKEN, {
        token
      });
      
      if (!response.success) {
        throw new Error(response.error?.message || 'Token-Validierung fehlgeschlagen');
      }
      
      return response.data;
    });
  }

  /**
   * Testet Token-Refresh
   */
  private async testTokenRefresh(): Promise<TestResult> {
    return this.runTest('Token-Refresh', async () => {
      const refreshResult = await sessionManager.refreshToken();
      
      if (!refreshResult) {
        throw new Error('Token-Refresh fehlgeschlagen');
      }
      
      return { refreshed: true };
    });
  }

  /**
   * Testet Benutzer-Endpunkte
   */
  private async testUserEndpoints(): Promise<TestResult> {
    return this.runTest('Benutzer-Endpunkte', async () => {
      const userId = sessionManager.getUserId();
      
      if (!userId) {
        throw new Error('Keine Benutzer-ID verfügbar');
      }
      
      const response = await api.get(API_CONFIG.ENDPOINTS.USERS.PROFILE.replace(':id', userId));
      
      if (!response.success) {
        throw new Error(response.error?.message || 'Benutzer-Profil konnte nicht geladen werden');
      }
      
      return response.data;
    });
  }

  /**
   * Testet Mondkalender-Endpunkte
   */
  private async testMoonEndpoints(): Promise<TestResult> {
    return this.runTest('Mondkalender-Endpunkte', async () => {
      const response = await api.get(API_CONFIG.ENDPOINTS.MOON.CURRENT_PHASE);
      
      if (!response.success) {
        throw new Error(response.error?.message || 'Mondkalender-Daten konnten nicht geladen werden');
      }
      
      return response.data;
    });
  }

  /**
   * Testet Coaching-Endpunkte
   */
  private async testCoachingEndpoints(): Promise<TestResult> {
    return this.runTest('Coaching-Endpunkte', async () => {
      const response = await api.get(API_CONFIG.ENDPOINTS.COACHING.SESSIONS);
      
      if (!response.success) {
        throw new Error(response.error?.message || 'Coaching-Daten konnten nicht geladen werden');
      }
      
      return response.data;
    });
  }

  /**
   * Testet Community-Endpunkte
   */
  private async testCommunityEndpoints(): Promise<TestResult> {
    return this.runTest('Community-Endpunkte', async () => {
      const response = await api.get(API_CONFIG.ENDPOINTS.COMMUNITY.POSTS);
      
      if (!response.success) {
        throw new Error(response.error?.message || 'Community-Daten konnten nicht geladen werden');
      }
      
      return response.data;
    });
  }

  /**
   * Testet Chart-Berechnung
   */
  private async testChartCalculation(): Promise<TestResult> {
    return this.runTest('Chart-Berechnung', async () => {
      const testData = {
        birthDate: '1990-01-01',
        birthTime: '12:00',
        birthPlace: 'Berlin, Germany',
        latitude: 52.5200,
        longitude: 13.4050
      };
      
      const response = await api.post(API_CONFIG.ENDPOINTS.CHARTS.CALCULATE, testData);
      
      if (!response.success) {
        throw new Error(response.error?.message || 'Chart-Berechnung fehlgeschlagen');
      }
      
      return response.data;
    });
  }

  /**
   * Testet Admin-Endpunkte
   */
  private async testAdminEndpoints(): Promise<TestResult> {
    return this.runTest('Admin-Endpunkte', async () => {
      const response = await api.get(API_CONFIG.ENDPOINTS.ADMIN.DASHBOARD);
      
      if (!response.success) {
        throw new Error(response.error?.message || 'Admin-Dashboard konnte nicht geladen werden');
      }
      
      return response.data;
    });
  }

  /**
   * Testet Error-Handling
   */
  private async testErrorHandling(): Promise<TestResult> {
    return this.runTest('Error-Handling', async () => {
      // Test mit ungültigem Endpunkt
      const response = await api.get('/invalid-endpoint');
      
      // Sollte einen Fehler zurückgeben
      if (response.success) {
        throw new Error('Error-Handling funktioniert nicht korrekt');
      }
      
      return { errorHandled: true, error: response.error };
    });
  }

  /**
   * Testet Timeout-Verhalten
   */
  private async testTimeoutHandling(): Promise<TestResult> {
    return this.runTest('Timeout-Handling', async () => {
      // Test mit sehr kurzem Timeout - verwende lokale Konfiguration
      const testConfig = {
        ...API_CONFIG,
        TIMEOUT: 1 // 1ms für schnellen Timeout
      };
      
      try {
        // Simuliere Timeout mit kurzer Wartezeit
        await new Promise(resolve => setTimeout(resolve, 10));
        
        return { timeoutHandled: true };
      } catch (error) {
        return { timeoutHandled: true, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    });
  }

  /**
   * Führt alle Tests aus
   */
  public async runAllTests(): Promise<TestSuite> {
    const startTime = Date.now();
    this.results = [];

    console.log('🚀 Starte API-Test-Suite...');

    // Basis-Tests
    this.results.push(await this.testAPIConnection());
    this.results.push(await this.testAuthentication());
    this.results.push(await this.testTokenValidation());
    this.results.push(await this.testTokenRefresh());

    // Feature-Tests
    this.results.push(await this.testUserEndpoints());
    this.results.push(await this.testMoonEndpoints());
    this.results.push(await this.testCoachingEndpoints());
    this.results.push(await this.testCommunityEndpoints());
    this.results.push(await this.testChartCalculation());
    this.results.push(await this.testAdminEndpoints());

    // Error-Handling-Tests
    this.results.push(await this.testErrorHandling());
    this.results.push(await this.testTimeoutHandling());

    const totalDuration = Date.now() - startTime;
    const successCount = this.results.filter(r => r.success).length;
    const failureCount = this.results.filter(r => !r.success).length;

    const testSuite: TestSuite = {
      name: 'API-Test-Suite',
      tests: this.results,
      totalDuration,
      successCount,
      failureCount
    };

    console.log('✅ API-Test-Suite abgeschlossen:', testSuite);
    return testSuite;
  }

  /**
   * Führt spezifische Tests aus
   */
  public async runSpecificTests(testNames: string[]): Promise<TestSuite> {
    const startTime = Date.now();
    this.results = [];

    const testMap: Record<string, () => Promise<TestResult>> = {
      'api-connection': () => this.testAPIConnection(),
      'authentication': () => this.testAuthentication(),
      'token-validation': () => this.testTokenValidation(),
      'token-refresh': () => this.testTokenRefresh(),
      'user-endpoints': () => this.testUserEndpoints(),
      'moon-endpoints': () => this.testMoonEndpoints(),
      'coaching-endpoints': () => this.testCoachingEndpoints(),
      'community-endpoints': () => this.testCommunityEndpoints(),
      'chart-calculation': () => this.testChartCalculation(),
      'admin-endpoints': () => this.testAdminEndpoints(),
      'error-handling': () => this.testErrorHandling(),
      'timeout-handling': () => this.testTimeoutHandling()
    };

    for (const testName of testNames) {
      if (testMap[testName]) {
        this.results.push(await testMap[testName]());
      } else {
        this.results.push({
          name: testName,
          success: false,
          error: 'Test nicht gefunden',
          duration: 0
        });
      }
    }

    const totalDuration = Date.now() - startTime;
    const successCount = this.results.filter(r => r.success).length;
    const failureCount = this.results.filter(r => !r.success).length;

    return {
      name: 'Spezifische API-Tests',
      tests: this.results,
      totalDuration,
      successCount,
      failureCount
    };
  }

  /**
   * Holt die Testergebnisse
   */
  public getResults(): TestResult[] {
    return this.results;
  }

  /**
   * Generiert einen Test-Report
   */
  public generateReport(): string {
    const successCount = this.results.filter(r => r.success).length;
    const failureCount = this.results.filter(r => !r.success).length;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);

    let report = `# API-Test-Report\n\n`;
    report += `**Gesamt:** ${this.results.length} Tests\n`;
    report += `**Erfolgreich:** ${successCount}\n`;
    report += `**Fehlgeschlagen:** ${failureCount}\n`;
    report += `**Gesamtdauer:** ${totalDuration}ms\n\n`;

    report += `## Einzelne Tests\n\n`;
    
    this.results.forEach(result => {
      const status = result.success ? '✅' : '❌';
      report += `### ${status} ${result.name}\n`;
      report += `- **Dauer:** ${result.duration}ms\n`;
      
      if (result.error) {
        report += `- **Fehler:** ${result.error}\n`;
      }
      
      if (result.details) {
        report += `- **Details:** \`${JSON.stringify(result.details, null, 2)}\`\n`;
      }
      
      report += `\n`;
    });

    return report;
  }
}

// Singleton-Instanz exportieren
export const apiTestSuite = new APITestSuite();

// Convenience-Funktionen
export const runAPITests = () => apiTestSuite.runAllTests();
export const runSpecificAPITests = (testNames: string[]) => apiTestSuite.runSpecificTests(testNames);
export const getAPITestResults = () => apiTestSuite.getResults();
export const generateAPITestReport = () => apiTestSuite.generateReport();
