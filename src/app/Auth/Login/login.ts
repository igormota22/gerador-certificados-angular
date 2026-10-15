import { Component, inject, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { AuthShell } from "../Shell/auth-shell";
import { AuthService } from "../auth.service";
import { HttpErrorResponse } from "@angular/common/http";
import { ProblemDetails } from "../auth";
import { FormsModule } from "@angular/forms";

interface FormModel {
    email: string,
    senha: string
}

@Component({
    imports: [RouterLink, FormsModule, AuthShell],
    selector: 'app-login',
    templateUrl: './login.html'
})

export class Login {

    //=============================
    //INJECAO DE DEPENDENCIA
    //=============================
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    //==============================
    // ESTADOS
    //==============================

    protected form: FormModel = {
        email: '',
        senha: ''
    };


    protected erroSenha = signal<string | null>(null);
    protected erroEmail = signal<string | null>(null);

    enviarFormulario(): void {
        this.erroEmail.set(null);
        this.erroSenha.set(null);

        this.authService.login(this.form).subscribe({
            next: () => {
                void this.router.navigateByUrl('/home');
            },
            error: (erro: HttpErrorResponse) => {
                const problema = erro.error as ProblemDetails;

                this.erroEmail.set(
                    problema.errors?.['Email']?.[0] ?? null
                );

                this.erroSenha.set(
                    problema.errors?.['Senha']?.[0] ?? null
                );
            }
        });
    }

}