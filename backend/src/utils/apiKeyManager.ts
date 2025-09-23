// API Key Management für bessere Fehlerbehandlung
export class APIKeyManager {
  
  static isOpenAIKeyValid(apiKey: string): boolean {
    if (!apiKey || apiKey === '') return false;
    if (apiKey === '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') {
      console.log('⚠️ Demo API Key erkannt - verwende Fallback-Modus');
      return false;
    }
    return apiKey.startsWith('sk-') && apiKey.length > 20;
  }

  static getAPIKeyStatus(): {
    hasKey: boolean;
    isValid: boolean;
    isDemo: boolean;
    message: string;
  } {
    const apiKey = process.env.OPENAI_API_KEY || '';
    
    if (!apiKey) {
      return {
        hasKey: false,
        isValid: false,
        isDemo: false,
        message: 'Kein OpenAI API Key gesetzt'
      };
    }

    if (apiKey === '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') {
      return {
        hasKey: true,
        isValid: false,
        isDemo: true,
        message: 'Demo API Key erkannt - Fallback-Modus aktiviert'
      };
    }

    if (!this.isOpenAIKeyValid(apiKey)) {
      return {
        hasKey: true,
        isValid: false,
        isDemo: false,
        message: 'Ungültiger OpenAI API Key Format'
      };
    }

    return {
      hasKey: true,
      isValid: true,
      isDemo: false,
      message: 'OpenAI API Key ist gültig'
    };
  }

  static async testAPIKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error('API Key Test fehlgeschlagen:', error);
      return false;
    }
  }
}

export default APIKeyManager;
