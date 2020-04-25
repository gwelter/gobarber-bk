import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import AppError from '../errors/AppError';

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
    throw new AppError('Unauthorized', 401);
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
    throw new AppError('Unauthorized', 401);
  }
}
