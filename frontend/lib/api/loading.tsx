/**
 * Loading-States Management System
 * Zentrale Verwaltung von Loading-Zuständen für API-Aufrufe
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type { LoadingState } from './config';

// Loading-State-Hook
export function useLoadingState(initialState: boolean = false) {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: initialState,
    error: null,
    lastUpdated: undefined
  });

  const setLoading = useCallback((isLoading: boolean) => {
    setLoadingState(prev => ({
      ...prev,
      isLoading,
      error: isLoading ? null : prev.error, // Fehler bei neuem Loading zurücksetzen
      lastUpdated: new Date()
    }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setLoadingState(prev => ({
      ...prev,
      error,
      isLoading: false
    }));
  }, []);

  const clearError = useCallback(() => {
    setLoadingState(prev => ({
      ...prev,
      error: null
    }));
  }, []);

  const reset = useCallback(() => {
    setLoadingState({
      isLoading: false,
      error: null,
      lastUpdated: undefined
    });
  }, []);

  return {
    ...loadingState,
    setLoading,
    setError,
    clearError,
    reset
  };
}

// Multi-Loading-State-Hook für mehrere gleichzeitige API-Aufrufe
export function useMultiLoadingState() {
  const [loadingStates, setLoadingStates] = useState<Record<string, LoadingState>>({});

  const setLoading = useCallback((key: string, isLoading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        isLoading,
        error: isLoading ? null : prev[key]?.error,
        lastUpdated: new Date()
      }
    }));
  }, []);

  const setError = useCallback((key: string, error: string | null) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        error,
        isLoading: false
      }
    }));
  }, []);

  const clearError = useCallback((key: string) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        error: null
      }
    }));
  }, []);

  const reset = useCallback((key?: string) => {
    if (key) {
      setLoadingStates(prev => ({
        ...prev,
        [key]: {
          isLoading: false,
          error: null,
          lastUpdated: undefined
        }
      }));
    } else {
      setLoadingStates({});
    }
  }, []);

  const isLoading = useCallback((key?: string) => {
    if (key) {
      return loadingStates[key]?.isLoading || false;
    }
    return Object.values(loadingStates).some(state => state.isLoading);
  }, [loadingStates]);

  const hasError = useCallback((key?: string) => {
    if (key) {
      return !!loadingStates[key]?.error;
    }
    return Object.values(loadingStates).some(state => !!state.error);
  }, [loadingStates]);

  const getError = useCallback((key: string) => {
    return loadingStates[key]?.error || null;
  }, [loadingStates]);

  return {
    loadingStates,
    setLoading,
    setError,
    clearError,
    reset,
    isLoading,
    hasError,
    getError
  };
}

// Async-Operation-Hook mit Loading-State
export function useAsyncOperation<T = any>() {
  const [state, setState] = useState<{
    data: T | null;
    isLoading: boolean;
    error: string | null;
  }>({
    data: null,
    isLoading: false,
    error: null
  });

  const execute = useCallback(async (
    operation: () => Promise<T>,
    options?: {
      onSuccess?: (data: T) => void;
      onError?: (error: string) => void;
      resetData?: boolean;
    }
  ) => {
    const { onSuccess, onError, resetData = false } = options || {};

    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      data: resetData ? null : prev.data
    }));

    try {
      const result = await operation();
      setState({
        data: result,
        isLoading: false,
        error: null
      });
      onSuccess?.(result);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      onError?.(errorMessage);
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      isLoading: false,
      error: null
    });
  }, []);

  return {
    ...state,
    execute,
    reset
  };
}

// Debounced Loading-State für Suchoperationen
export function useDebouncedLoading(delay: number = 300) {
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setLoading = useCallback((loading: boolean) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (loading) {
      setIsLoading(true);
    } else {
      timeoutRef.current = setTimeout(() => {
        setIsLoading(false);
      }, delay);
    }
  }, [delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { isLoading, setLoading };
}

// Loading-Context für globale Loading-States
import { createContext, useContext, ReactNode } from 'react';

interface GlobalLoadingContextType {
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
  loadingOperations: Set<string>;
  addLoadingOperation: (operation: string) => void;
  removeLoadingOperation: (operation: string) => void;
}

const GlobalLoadingContext = createContext<GlobalLoadingContextType | undefined>(undefined);

export function GlobalLoadingProvider({ children }: { children: ReactNode }) {
  const [loadingOperations, setLoadingOperations] = useState<Set<string>>(new Set());

  const setGlobalLoading = useCallback((loading: boolean) => {
    if (!loading) {
      setLoadingOperations(new Set());
    }
  }, []);

  const addLoadingOperation = useCallback((operation: string) => {
    setLoadingOperations(prev => new Set([...prev, operation]));
  }, []);

  const removeLoadingOperation = useCallback((operation: string) => {
    setLoadingOperations(prev => {
      const newSet = new Set(prev);
      newSet.delete(operation);
      return newSet;
    });
  }, []);

  const globalLoading = loadingOperations.size > 0;

  return (
    <GlobalLoadingContext.Provider value={{
      globalLoading,
      setGlobalLoading,
      loadingOperations,
      addLoadingOperation,
      removeLoadingOperation
    }}>
      {children}
    </GlobalLoadingContext.Provider>
  );
}

export function useGlobalLoading() {
  const context = useContext(GlobalLoadingContext);
  if (!context) {
    throw new Error('useGlobalLoading must be used within a GlobalLoadingProvider');
  }
  return context;
}
