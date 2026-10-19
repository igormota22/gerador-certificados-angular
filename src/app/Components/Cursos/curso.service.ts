import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { URL_API } from "../../Auth/auth.tokens";
import { CursoResponse } from "./curso";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class CursoService {

    //======================================
    // INJECAO DEPENDENCIA
    //======================================

    private readonly http = inject(HttpClient);
    private readonly urlApi = inject(URL_API);

    //=======================================
    // METODOS
    //=======================================

    listar(): Observable<CursoResponse[]> {
        return this.http.get<CursoResponse[]>(`${this.urlApi}/Api/cursos`);
    }

}