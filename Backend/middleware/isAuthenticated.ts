import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({
        message: 'user not authenticated',
        success: false,
      });
    }

    const decoded = verify(token, process.env.SECRET_KEY as string) as { userId: string } | null;
    if (!decoded) {
      return res.status(401).json({ message: 'invalid', success: false });
    }

    req.id = decoded.userId;
    next();
  } catch (err) {
    console.error('isAuthenticated error:', err);
    return res.status(401).json({ message: 'authentication failed', success: false });
  }
};

export default isAuthenticated;
