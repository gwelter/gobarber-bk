import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '../config/auth';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAUthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void | Response<{ error: string }> {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({ error: 'Unauthorized' });
    // throw new Error('Unauthorized');
  }

  const [, token] = authHeader.split(' ');
  try {
    const decoded = verify(token, authConfig.jwt.secret);
    const { sub } = decoded as TokenPayload;
    request.user = {
      id: sub,
    };

    return next();
  } catch {
    return response.status(401).json({ error: 'Unauthorized' });
    // throw new Error('Unauthorized');
  }
}
