// src/types/express.d.ts
import { User } from './types';

declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}
