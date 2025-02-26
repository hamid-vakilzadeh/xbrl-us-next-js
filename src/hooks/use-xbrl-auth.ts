import { useMutation } from '@tanstack/react-query';
import { authenticateXBRL, refreshXBRLToken, XBRLAuthError } from '@/api/auth';

interface SignInCredentials {
  email: string;
  password: string;
  clientId: string;
  clientSecret: string;
}

export function useXBRLAuth() {
  // Convert to useMutation for sign in
  const signInMutation = useMutation({
    mutationKey: ['auth', 'signIn'], // Add a mutation key
    mutationFn: async (credentials: SignInCredentials) => {
      // Check for missing credentials
      if (!credentials.email || !credentials.password || !credentials.clientId || !credentials.clientSecret) {
        throw new XBRLAuthError('MISSING_CREDENTIALS', 'All credential fields are required');
      }
      
      const auth = await authenticateXBRL(credentials);
      
      // Store tokens securely
      localStorage.setItem('xbrl_access_token', auth.access_token);
      localStorage.setItem('xbrl_refresh_token', auth.refresh_token);
      localStorage.setItem('xbrl_token_expiry', String(Date.now() + auth.expires_in * 1000));
      localStorage.setItem('xbrl_email', credentials.email);
      
      return auth;
    }
  });

  // Add token refresh mutation
  const refreshTokenMutation = useMutation({
    mutationKey: ['auth', 'refreshToken'], // Add a mutation key
    mutationFn: async () => {
      const refreshToken = localStorage.getItem('xbrl_refresh_token');
      const clientId = localStorage.getItem('xbrl_client_id');
      const clientSecret = localStorage.getItem('xbrl_client_secret');
      const email = localStorage.getItem('xbrl_email');

      if (!refreshToken || !clientId || !clientSecret || !email) {
        throw new XBRLAuthError('MISSING_CREDENTIALS', 'Missing refresh credentials');
      }

      const auth = await refreshXBRLToken(refreshToken, clientId, clientSecret, email);
      
      // Update tokens
      localStorage.setItem('xbrl_access_token', auth.access_token);
      localStorage.setItem('xbrl_refresh_token', auth.refresh_token);
      localStorage.setItem('xbrl_token_expiry', String(Date.now() + auth.expires_in * 1000));
      
      return auth;
    }
  });
  
  // Wrapper function with the same interface as before for backward compatibility
  const signIn = async (
    email: string,
    password: string,
    clientId: string,
    clientSecret: string
  ) => {
    // Store client credentials for later token refresh
    localStorage.setItem('xbrl_client_id', clientId);
    localStorage.setItem('xbrl_client_secret', clientSecret);
    
    return signInMutation.mutateAsync({ 
      email, 
      password, 
      clientId, 
      clientSecret 
    });
  };

  const refreshToken = async () => {
    return refreshTokenMutation.mutateAsync();
  };

  const logout = () => {
    localStorage.removeItem('xbrl_access_token');
    localStorage.removeItem('xbrl_refresh_token');
    localStorage.removeItem('xbrl_token_expiry');
    localStorage.removeItem('xbrl_email');
    // Don't remove client credentials to make future logins easier
  };

  return {
    signIn,
    refreshToken,
    logout,
    isLoading: signInMutation.isPending || refreshTokenMutation.isPending,
    error: signInMutation.error || refreshTokenMutation.error,
  };
}