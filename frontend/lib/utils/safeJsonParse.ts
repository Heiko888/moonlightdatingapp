/**
 * Sichere JSON.parse Funktion mit umfassender Fehlerbehandlung
 */

/**
 * Parst JSON-String sicher mit Fehlerbehandlung
 * @param jsonString - JSON-String zum Parsen
 * @param fallback - Fallback-Wert bei Fehlern
 * @returns Parsed JSON oder Fallback
 */
export function safeJsonParse<T = any>(
  jsonString: string | null | undefined,
  fallback: T | null = null
): T | null {
  if (!jsonString || jsonString.trim() === '') {
    return fallback;
  }

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('JSON.parse Fehler:', error);
    console.error('Ungültiger JSON-String:', jsonString);
    return fallback;
  }
}

/**
 * Parst localStorage-Item sicher
 * @param key - localStorage-Schlüssel
 * @param fallback - Fallback-Wert
 * @returns Parsed JSON oder Fallback
 */
export function safeLocalStorageParse<T = any>(
  key: string,
  fallback: T | null = null
): T | null {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const item = localStorage.getItem(key);
    return safeJsonParse(item, fallback);
  } catch (error) {
    console.warn(`safeLocalStorageParse: Fehler beim Laden von ${key}:`, error);
    return fallback;
  }
}

/**
 * Speichert Daten sicher in localStorage
 * @param key - localStorage-Schlüssel
 * @param data - Zu speichernde Daten
 * @returns Erfolg der Speicherung
 */
export function safeLocalStorageSet(
  key: string,
  data: any
): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const jsonString = JSON.stringify(data);
    localStorage.setItem(key, jsonString);
    return true;
  } catch (error) {
    console.error(`safeLocalStorageSet: Fehler beim Speichern von ${key}:`, error);
    return false;
  }
}

/**
 * Bereinigt localStorage von ungültigen Einträgen
 */
export function cleanupLocalStorage(): void {
  if (typeof window === 'undefined') {
    return;
  }

  const keysToCheck = ['userData', 'userSubscription', 'userId', 'userEmail', 'userPackage'];
  
  keysToCheck.forEach(key => {
    try {
      const item = localStorage.getItem(key);
      if (item && item.trim() !== '') {
        JSON.parse(item);
      }
    } catch (error) {
      console.warn(`Bereinige ungültigen localStorage-Eintrag: ${key}`);
      localStorage.removeItem(key);
    }
  });
}