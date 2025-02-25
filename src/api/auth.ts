interface XBRLCredentials {
  email: string;
  password: string;
  clientId: string;
  clientSecret: string;
}

interface XBRLAuthResponse {
  platform: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_token_expires_in: number;
  token_type: 'bearer';
}

interface XBRLErrorResponse {
  error: string;
  error_description: string;
}

export class XBRLAuthError extends Error {
  constructor(
    public readonly code: string,
    message: string
  ) {
    super(message);
    this.name = 'XBRLAuthError';
  }
}

export async function authenticateXBRL({
  email,
  password,
  clientId,
  clientSecret,
}: XBRLCredentials): Promise<XBRLAuthResponse> {
  const response = await fetch('https://api.xbrl.us/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'password',
      client_id: clientId,
      client_secret: clientSecret,
      username: email,
      password: password,
      platform: 'pc'
    })
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as XBRLErrorResponse;
    // Map common XBRL error responses
    switch (error.error) {
      case 'unauthorized':
        throw new XBRLAuthError('UNAUTHORIZED', 'Invalid credentials provided');
      case 'bad_request':
        throw new XBRLAuthError('BAD_REQUEST', error.error_description || 'Invalid request parameters');
      case 'method_not_allowed':
        throw new XBRLAuthError('METHOD_NOT_ALLOWED', 'Invalid request method');
      default:
        throw new XBRLAuthError('UNKNOWN', error.error_description || 'An unknown error occurred');
    }
  }

  return data as XBRLAuthResponse;
}

export async function refreshXBRLToken(
  refreshToken: string,
  clientId: string,
  clientSecret: string,
  email: string
): Promise<XBRLAuthResponse> {
  const response = await fetch('https://api.xbrl.us/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      username: email,
      platform: 'pc'
    })
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as XBRLErrorResponse;
    throw new XBRLAuthError('REFRESH_FAILED', error.error_description || 'Token refresh failed');
  }

  return data as XBRLAuthResponse;
}