import { useState } from 'react';
import { authenticateXBRL, refreshXBRLToken, XBRLAuthError } from '@/api/auth';

export function useXBRLAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<XBRLAuthError | null>(null);

  async function signIn(
    email: string,
    password: string,
    clientId: string,
    clientSecret: string
  ) {
    setIsLoading(true);
    setError(null);

    try {
      const auth = await authenticateXBRL({
        email,
        password,
        clientId,
        clientSecret
      });

      // Store tokens securely
      localStorage.setItem('xbrl_access_token', auth.access_token);
      localStorage.setItem('xbrl_refresh_token', auth.refresh_token);
      localStorage.setItem('xbrl_token_expiry', String(Date.now() + auth.expires_in * 1000));

      return auth;
    } catch (err) {
      const error = err as XBRLAuthError;
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    signIn,
    isLoading,
    error
  };
}