import { useState } from 'react';

interface UseMutationOptions<TData, TError> {
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
}

export function useMutation<TArgs, TData, TError = Error>(
  mutationFn: (args: TArgs) => Promise<TData>,
  options?: UseMutationOptions<TData, TError>
) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<TData | null>(null);
  const [error, setError] = useState<TError | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  async function mutate(
    args: TArgs,
    callbacks?: UseMutationOptions<TData, TError>
  ) {
    setIsLoading(true);
    setIsSuccess(false);
    setError(null);

    try {
      const result = await mutationFn(args);
      setData(result);
      setIsSuccess(true);
      options?.onSuccess?.(result);
      callbacks?.onSuccess?.(result);
    } catch (err: unknown) {
      const error = err as TError;
      setError(error);
      options?.onError?.(error);
      callbacks?.onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    mutate,
    isLoading,
    isSuccess,
    data,
    error,
  };
}
