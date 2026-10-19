import { inject } from '@angular/core';
import {
    HttpInterceptorFn
} from '@angular/common/http';

import { AuthService } from './auth.service';

export const autenticacaoInterceptor: HttpInterceptorFn =
    (req, next) => {
        const authService = inject(AuthService);
        const autenticacao = authService.autenticacao();

        if (!autenticacao) {
            return next(req);
        }

        const requisicaoAutenticada = req.clone({
            setHeaders: {
                Authorization: `Bearer ${autenticacao.accessToken}`
            }
        });

        return next(requisicaoAutenticada);
    };