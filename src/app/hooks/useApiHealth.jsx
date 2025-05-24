import { useState, useCallback } from 'react';
import { callApi } from '@app/utils/api';
import { useDebounce } from 'use-debounce';

export function useApiHealth() {
  const [status, setStatus] = useState('unknown');
  const [message, setMessage] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const performHealthCheck = useCallback(async () => {
    try {
      const response = await callApi('/remote-health');
      const data = await response.json();

      if (data.status === 'DISABLED') {
        setStatus('disabled');
      } else {
        setStatus(data.status === 'OK' ? 'connected' : 'blocked');
      }
      setMessage(data.message);
    } catch {
      setStatus('blocked');
      setMessage('Network error: Unable to check API health');
    } finally {
      setIsChecking(false);
    }
  }, []);

  const [debouncedHealthCheck] = useDebounce(performHealthCheck, 300);

  const checkHealth = useCallback(async () => {
    setIsChecking(true);
    setStatus('loading');
    await debouncedHealthCheck();
  }, [debouncedHealthCheck]);

  return { status, message, checkHealth, isChecking };
}
