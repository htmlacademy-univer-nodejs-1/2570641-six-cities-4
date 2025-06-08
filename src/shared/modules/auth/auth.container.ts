import { Container } from 'inversify';
import { types } from '../../container/types.js';
import { AuthService } from './auth-service.interface.js';
import { DefaultAuthService } from './default-auth.service.js';
import { AuthExceptionFilter } from './auth.exception-filter.js';

export function createAuthContainer() {
  const authContainer = new Container();

  authContainer.bind<AuthService>(types.AuthService).to(DefaultAuthService).inSingletonScope();
  authContainer.bind<AuthExceptionFilter>(types.AuthExceptionFilter).to(AuthExceptionFilter).inSingletonScope();

  return authContainer;
}

export { createAuthContainer as AuthContainer };
