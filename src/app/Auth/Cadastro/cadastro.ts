import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { AuthShell } from "../Shell/auth-shell";

@Component({
    imports: [AuthShell, RouterLink],
    selector: 'app-cadastro',
    templateUrl: './cadastro.html',
})

export class Cadastro { }