import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { URL_API } from "../../Auth/auth.tokens";

@Injectable({
    providedIn: 'root'
})

export class CursoService {

    //======================================
    // INJECAO DEPENDENCIA
    //======================================

    private readonly http = inject(HttpClient);
    private readonly urlApi = inject(URL_API);

}