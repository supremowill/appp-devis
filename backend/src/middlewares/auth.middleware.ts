import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define Role enum locally to avoid Prisma client dependency during build
export enum Role {
  DRIVER = 'DRIVER',
  PASSENGER = 'PASSENGER'
}

export interface UserPayload {
  id: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as UserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
