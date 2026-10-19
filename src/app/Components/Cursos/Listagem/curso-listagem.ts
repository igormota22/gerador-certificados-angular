import { Component } from "@angular/core";
import { RouterLinkActive } from "@angular/router";
import { CursoShell } from "../Shell/curso-shell";

@Component({
    imports: [RouterLinkActive, CursoShell],
    selector: 'app-curso-listagem',
    templateUrl: './curso-listagem.html'
})

export class CursoListagem { }