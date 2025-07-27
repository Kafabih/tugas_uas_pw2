import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];  // Assuming "Bearer <token>"

  if (!token) {
    return res.status(403).json({ message: 'Token is required' });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    console.log("Decoded Token:", decoded);  // Log the decoded token

    req.user = decoded as { id: number; email: string; role: number };  // Add decoded user data to req.user
    next();
  });
};
