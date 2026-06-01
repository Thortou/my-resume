'use client';

import { useState, useCallback, useTransition } from 'react';
import type { ActionState } from '@/types';

interface UseActionOptions<TOutput> {
  onSuccess?: (data: TOutput) => void;
  onError?: (error: string) => void;
  onComplete?: () => void;
}

interface UseActionReturn<TInput, TOutput> {
  execute: (input: TInput) => Promise<ActionState<TOutput>>;
  isLoading: boolean;
  error: string | null;
  data: TOutput | null;
  reset: () => void;
}

// Generic hook for handling server actions
export function useAction<TInput, TOutput = unknown>(
  action: (input: TInput) => Promise<ActionState<TOutput>>,
  options?: UseActionOptions<TOutput>
): UseActionReturn<TInput, TOutput> {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TOutput | null>(null);

  const execute = useCallback(
    async (input: TInput): Promise<ActionState<TOutput>> => {
      setError(null);

      return new Promise((resolve) => {
        startTransition(async () => {
          try {
            const result = await action(input);

            if (result.success) {
              setData(result.data ?? null);
              options?.onSuccess?.(result.data as TOutput);
            } else {
              setError(result.error ?? 'Something went wrong');
              options?.onError?.(result.error ?? 'Something went wrong');
            }

            options?.onComplete?.();
            resolve(result);
          } catch (err) {
            const errorMessage =
              err instanceof Error ? err.message : 'Something went wrong';
            setError(errorMessage);
            options?.onError?.(errorMessage);
            options?.onComplete?.();
            resolve({
              success: false,
              error: errorMessage,
            });
          }
        });
      });
    },
    [action, options]
  );

  const reset = useCallback(() => {
    setError(null);
    setData(null);
  }, []);

  return {
    execute,
    isLoading: isPending,
    error,
    data,
    reset,
  };
}
