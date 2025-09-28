/**
 * Sichere JSON-Parse-Utility
 * Verhindert JSON-Parse-Fehler durch robuste Fehlerbehandlung
 */

/**
 * Parst JSON-String sicher mit Fallback
 * @param jsonString - Der zu parsende JSON-String
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
    // Prüfe ob es gültiges JSON ist
    if (!jsonString.startsWith('{') && !jsonString.startsWith('[') && !jsonString.startsWith('"')) {
      console.warn('safeJsonParse: String ist kein gültiges JSON:', jsonString.substring(0, 50) + '...');
      return fallback;
    }

    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('safeJsonParse: Fehler beim Parsen von JSON:', error);
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
export function safeLocalStorageSet(key: string, data: any): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const jsonString = JSON.stringify(data);
    localStorage.setItem(key, jsonString);
    return true;
  } catch (error) {
    console.warn(`safeLocalStorageSet: Fehler beim Speichern von ${key}:`, error);
    return false;
  }
}

/**
 * Löscht localStorage-Item sicher
 * @param key - localStorage-Schlüssel
 * @returns Erfolg der Löschung
 */
export function safeLocalStorageRemove(key: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`safeLocalStorageRemove: Fehler beim Löschen von ${key}:`, error);
    return false;
  }
}
