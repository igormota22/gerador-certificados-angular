import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { URL_API } from "../../Auth/auth.tokens";
import { CertificadoResponse, SolicitarCertificadosRequest, SolicitarCertificadosResponse, StatusSolicitacaoResponse } from "./certificado";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class CertificadoService {

    //======================================
    // INJECAO DEPENDENCIA
    //======================================

    private readonly http = inject(HttpClient);
    private readonly urlApi = inject(URL_API);

    //=======================================
    // METODOS
    //=======================================

    listar(cursoId: string): Observable<CertificadoResponse[]> {
        return this.http.get<CertificadoResponse[]>(`${this.urlApi}/cursos/${cursoId}/certificados`);
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

    obterStatus(cursoId: string): Observable<StatusSolicitacaoResponse> {
        return this.http.get<StatusSolicitacaoResponse>(
            `${this.urlApi}/cursos/${cursoId}/status`
        );
    }
    baixarZip(cursoId: string) {
        return this.http.get(
            `${this.urlApi}/cursos/${cursoId}/certificados/download`,
            {
                responseType: 'blob'
            }
        );
    }
}