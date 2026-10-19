import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TOKEN_ARMAZENADO, URL_API } from './Auth/auth.tokens';
import { environment } from '../enviroments/enviroment.develpoment';
import { autenticacaoInterceptor } from './Auth/autenticacao.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([autenticacaoInterceptor])
    ),
    {
      provide: URL_API,
      useValue: environment.urlApi,
    },
    {
      provide: TOKEN_ARMAZENADO,
      useValue: 'Certifica+_Acesso'
    },
  ]
};
