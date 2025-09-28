/**
 * Zentraler Loading-State-Service
 * Verwaltet Loading-States für alle API-Aufrufe
 */

import { useState, useCallback } from 'react';

interface LoadingState {
  isLoading: boolean;
  error: string | null;
  lastUpdated?: Date;
}

interface LoadingStates {
  [key: string]: LoadingState;
}

class LoadingService {
  private states: LoadingStates = {};

  // Loading-State für einen bestimmten Key setzen
  setLoading(key: string, isLoading: boolean, error: string | null = null) {
    this.states[key] = {
      isLoading,
      error,
      lastUpdated: new Date()
    };
  }

  // Loading-State für einen Key abrufen
  getLoading(key: string): LoadingState {
    return this.states[key] || { isLoading: false, error: null };
  }

  // Alle Loading-States abrufen
  getAllLoading(): LoadingStates {
    return { ...this.states };
  }

  // Loading-State für einen Key löschen
  clearLoading(key: string) {
    delete this.states[key];
  }

  // Alle Loading-States löschen
  clearAllLoading() {
    this.states = {};
  }

  // Prüfen ob irgendein Loading-State aktiv ist
  isAnyLoading(): boolean {
    return Object.values(this.states).some(state => state.isLoading);
  }

  // Prüfen ob ein bestimmter Loading-State aktiv ist
  isLoading(key: string): boolean {
    return this.getLoading(key).isLoading;
  }

  // Fehler für einen Key setzen
  setError(key: string, error: string) {
    if (this.states[key]) {
      this.states[key].error = error;
      this.states[key].lastUpdated = new Date();
    } else {
      this.states[key] = {
        isLoading: false,
        error,
        lastUpdated: new Date()
      };
    }
  }

  // Fehler für einen Key löschen
  clearError(key: string) {
    if (this.states[key]) {
      this.states[key].error = null;
    }
  }
}

// Singleton-Instanz
export const loadingService = new LoadingService();

// React Hook für Loading-States
export const useLoadingState = (key: string) => {
  const [state, setState] = useState<LoadingState>(() => 
    loadingService.getLoading(key)
  );

  const setLoading = useCallback((isLoading: boolean, error: string | null = null) => {
    loadingService.setLoading(key, isLoading, error);
    setState(loadingService.getLoading(key));
  }, [key]);

  const setError = useCallback((error: string) => {
    loadingService.setError(key, error);
    setState(loadingService.getLoading(key));
  }, [key]);

  const clearError = useCallback(() => {
    loadingService.clearError(key);
    setState(loadingService.getLoading(key));
  }, [key]);

  const clearLoading = useCallback(() => {
    loadingService.clearLoading(key);
    setState({ isLoading: false, error: null });
  }, [key]);

  return {
    ...state,
    setLoading,
    setError,
    clearError,
    clearLoading
  };
};

// Hook für mehrere Loading-States
export const useMultipleLoadingStates = (keys: string[]) => {
  const [states, setStates] = useState<LoadingStates>(() => {
    const initialStates: LoadingStates = {};
    keys.forEach(key => {
      initialStates[key] = loadingService.getLoading(key);
    });
    return initialStates;
  });

  const updateState = useCallback((key: string, isLoading: boolean, error: string | null = null) => {
    loadingService.setLoading(key, isLoading, error);
    setStates(prev => ({
      ...prev,
      [key]: loadingService.getLoading(key)
    }));
  }, []);

  const setError = useCallback((key: string, error: string) => {
    loadingService.setError(key, error);
    setStates(prev => ({
      ...prev,
      [key]: loadingService.getLoading(key)
    }));
  }, []);

  const clearError = useCallback((key: string) => {
    loadingService.clearError(key);
    setStates(prev => ({
      ...prev,
      [key]: loadingService.getLoading(key)
    }));
  }, []);

  const isAnyLoading = Object.values(states).some(state => state.isLoading);
  const hasAnyError = Object.values(states).some(state => state.error);

  return {
    states,
    updateState,
    setError,
    clearError,
    isAnyLoading,
    hasAnyError
  };
};

// Utility-Funktionen
export const withLoading = async <T>(
  key: string,
  asyncFunction: () => Promise<T>,
  errorMessage: string = 'Ein Fehler ist aufgetreten'
): Promise<T | null> => {
  try {
    loadingService.setLoading(key, true);
    const result = await asyncFunction();
    loadingService.setLoading(key, false);
    return result;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : errorMessage;
    loadingService.setLoading(key, false, errorMsg);
    return null;
  }
};

export const withLoadingState = <T>(
  key: string,
  asyncFunction: () => Promise<T>,
  errorMessage: string = 'Ein Fehler ist aufgetreten'
) => {
  return withLoading(key, asyncFunction, errorMessage);
};

// Export der Singleton-Instanz
export default loadingService;
