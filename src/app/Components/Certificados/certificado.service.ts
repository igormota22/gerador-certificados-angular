import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { URL_API } from "../../Auth/auth.tokens";
import {
    CertificadoResponse,
    SolicitarCertificadosRequest,
    SolicitarCertificadosResponse,
    StatusSolicitacaoResponse
} from "./certificado";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CertificadoService {

    //=========================================================
    //INJECAO DE DEPENDENCIAS
    //=========================================================
    private readonly http = inject(HttpClient);
    private readonly urlApi = inject(URL_API);

    //===========================================================================
    //ESTADOS
    //===========================================================================
    private readonly solicitacaoIdAtual = signal<string | null>(null);
    private readonly cursoIdSolicitacaoAtual = signal<string | null>(null);

    readonly solicitacaoAtual = this.solicitacaoIdAtual.asReadonly();

    readonly cursoDaSolicitacaoAtual =
        this.cursoIdSolicitacaoAtual.asReadonly();

    //==================================================================================
    //METODOS
    //==================================================================================    
    listar(cursoId: string): Observable<CertificadoResponse[]> {
        return this.http.get<CertificadoResponse[]>(
            `${this.urlApi}/cursos/${cursoId}/certificados`
        );
    }

    solicitar(
        cursoId: string,
        req: SolicitarCertificadosRequest
    ): Observable<SolicitarCertificadosResponse> {
        return this.http.post<SolicitarCertificadosResponse>(
            `${this.urlApi}/cursos/${cursoId}/certificados`,
            req
        );
    }

    registrarSolicitacaoAtual(cursoId: string, solicitacaoId: string): void {
        this.cursoIdSolicitacaoAtual.set(cursoId);
        this.solicitacaoIdAtual.set(solicitacaoId);
    }

    limparSolicitacaoAtual(): void {
        this.cursoIdSolicitacaoAtual.set(null);
    }

    obterStatus(cursoId: string): Observable<StatusSolicitacaoResponse> {
        return this.http.get<StatusSolicitacaoResponse>(
            `${this.urlApi}/cursos/${cursoId}/status`
        );
    }

    baixarZip(cursoId: string) {
        return this.http.get(
            `${this.urlApi}/cursos/${cursoId}/certificados/download`,
            { responseType: 'blob' }
        );
    }
}