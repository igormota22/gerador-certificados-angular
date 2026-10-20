import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { URL_API } from "../../Auth/auth.tokens";
import { CertificadoResponse } from "./certificado";
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
}