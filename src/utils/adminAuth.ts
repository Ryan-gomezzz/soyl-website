import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

const HEADER_TOKEN = 'x-admin-token';

function isAuthorized(req: NextApiRequest) {
  const configuredToken = process.env.ADMIN_API_TOKEN;
  if (!configuredToken) {
    console.warn('ADMIN_API_TOKEN missing. Admin routes are unprotected.');
    return false;
  }

  const headerToken = req.headers[HEADER_TOKEN] ?? req.cookies?.['admin-token'];
  if (typeof headerToken === 'string') {
    return headerToken === configuredToken;
  }

  if (Array.isArray(headerToken)) {
    return headerToken.includes(configuredToken);
  }

  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader?.startsWith('Basic ')) {
    return false;
  }

  const decoded = Buffer.from(authorizationHeader.slice(6), 'base64').toString();
  const [, token = ''] = decoded.split(':');
  return token === configuredToken;
}

export function requireAdmin(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (!isAuthorized(req)) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    return handler(req, res);
  };
}


