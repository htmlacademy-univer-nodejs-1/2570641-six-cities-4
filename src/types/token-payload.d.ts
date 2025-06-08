import { TokenPayload } from '../shared/modules/auth/types/token-payload.type.js';

declare module 'express-serve-static-core' {
  export interface Request {
    tokenPayload?: TokenPayload;
  }
}
