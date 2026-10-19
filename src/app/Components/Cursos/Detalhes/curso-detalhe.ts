import { Component } from "@angular/core";
import { RouterLinkActive } from "@angular/router";
import { CursoShell } from "../Shell/curso-shell";

@Component({
    imports: [RouterLinkActive, CursoShell],
    selector: './curso-detalhe',
    templateUrl: './curso-detalhe.html'
})

export class CursoDetalhe { }