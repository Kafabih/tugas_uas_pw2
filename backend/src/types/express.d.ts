import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

// Create a custom interface that extends the Express Request interface
declare global {
  namespace Express {
    export interface Request {
      user: any;
  }
  export interface Response {
      user: any;
  }
  }
}