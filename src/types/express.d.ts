import { Session, SessionData } from 'express-session';

declare module 'express-session' {
  interface SessionData {
    cart: CartProduct[];
  }
}

export interface CartProduct {
  id: string;
  quantity: number;
}