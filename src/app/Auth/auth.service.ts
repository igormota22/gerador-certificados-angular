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
import { URL_API } from './auth.tokens';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly http = inject(HttpClient);
    private readonly urlApi = inject(URL_API);

    private readonly _usuarioAutenticado =
        signal<UsuarioResponse | null>(null);

    readonly usuarioAutenticado =
        this._usuarioAutenticado.asReadonly();

    private readonly _autenticacao =
        signal<AutenticarUsuarioResponse | null>(null);

    readonly autenticacao = this._autenticacao.asReadonly();


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
        this._autenticacao.set(resposta);
    }


}
