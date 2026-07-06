// src/hooks/useApi.js
// Generic hook: wraps any async API fn with loading + error + auto toast.
//
// Usage:
//   const { loading, execute } = useApi(pickingApi.scanProduct);
//   const res = await execute(orderId, qrCode);

import { useState, useCallback } from 'react';
import Toast from '../utils/toast';

const useApi = (apiFn, { suppressToast = false } = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      if (!apiFn) return null;
      setLoading(true);
      setError(null);
      try {
        const result = await apiFn(...args);
        setData(result?.data ?? result);
        return result;
      } catch (err) {
        const msg = err?.message || 'Something went wrong. Please try again.';
        setError(msg);
        if (!suppressToast) Toast.error(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFn, suppressToast],
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
};

export default useApi;
