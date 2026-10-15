import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
    AutenticarUsuarioRequest,
    AutenticarUsuarioResponse,
    CadastrarUsuarioRequest,
    CadastrarUsuarioResponse,
    UsuarioResponse
} from './auth';
import { TOKEN_ARMAZENADO, URL_API } from './auth.tokens';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor() {
        const autenticacaoArmazenada =
            localStorage.getItem(this.token);

        if (!autenticacaoArmazenada) {
            return;
        }

        try {
            const autenticacao: AutenticarUsuarioResponse =
                JSON.parse(autenticacaoArmazenada);


            if (!this.autenticacaoEstaValida(autenticacao)) {
                this.sair();
                return;
            }

            this._autenticacao.set(autenticacao);
        } catch {
            localStorage.removeItem(this.token);
        }
    }

    //==============================================
    //INJEÇAO DE DEPENDENCIA
    //===============================================

    private readonly http = inject(HttpClient);
    private readonly urlApi = inject(URL_API);
    private readonly token = inject(TOKEN_ARMAZENADO);

    //===============================================
    //ESTADOS
    //===============================================

    private readonly _usuarioAutenticado =
        signal<UsuarioResponse | null>(null);

    readonly usuarioAutenticado =
        this._usuarioAutenticado.asReadonly();

    private readonly _autenticacao =
        signal<AutenticarUsuarioResponse | null>(null);

    readonly autenticacao = this._autenticacao.asReadonly();

    //================================================
    //METODOS
    //================================================

    cadastrar(
        req: CadastrarUsuarioRequest
    ): Observable<CadastrarUsuarioResponse> {
        return this.http.post<CadastrarUsuarioResponse>(
            `${this.urlApi}/auth/cadastro`,
            req
        );
    }

    login(
        usuario: AutenticarUsuarioRequest
    ): Observable<AutenticarUsuarioResponse> {
        return this.http.post<AutenticarUsuarioResponse>(
            `${this.urlApi}/auth/login`,
            usuario,
        ).pipe(
            tap(resposta => this.guardarAutenticacao(resposta))
        );

    }

    sair(): void {
        localStorage.removeItem(this.token);
        this._autenticacao.set(null);
        this._usuarioAutenticado.set(null);
    }



    obterPorId(usuarioId: string): Observable<UsuarioResponse> {
        const autenticacao = this._autenticacao();

        if (!autenticacao) {
            throw new Error("Não existe uma autenticação armazenada.");
        }

        const headers = new HttpHeaders({
            Authorization: `Bearer ${autenticacao.accessToken}`
        });

        return this.http.get<UsuarioResponse>(
            `${this.urlApi}/auth/${usuarioId}`,
            { headers }
        ).pipe(
            tap(usuario => this._usuarioAutenticado.set(usuario))
        );
    }

    guardarAutenticacao(
        resposta: AutenticarUsuarioResponse
    ): void {
        this._usuarioAutenticado.set(null);

        localStorage.setItem(
            this.token,
            JSON.stringify(resposta)
        );

        this._autenticacao.set(resposta);
    }

    private autenticacaoEstaValida(
        autenticacao: AutenticarUsuarioResponse
    ): boolean {
        const dataExpiracao = new Date(
            autenticacao.dataExpiracaoEmUtc
        ).getTime();

        return (
            Number.isFinite(dataExpiracao) &&
            dataExpiracao > Date.now()
        );
    }


}
