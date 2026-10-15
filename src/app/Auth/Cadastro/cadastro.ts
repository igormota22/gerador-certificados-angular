import { Component, inject, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { AuthShell } from "../Shell/auth-shell";
import { AuthService } from "../auth.service";
import { HttpErrorResponse } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { ProblemDetails } from "../auth";

interface FormModel {
    email: string,
    senha: string
}

@Component({
    imports: [AuthShell, RouterLink, FormsModule],
    selector: 'app-cadastro',
    templateUrl: './cadastro.html',
})

export class Cadastro {
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
    protected erroApi = signal<string | null>(null);

    enviarFormulario(): void {
        this.erroEmail.set(null);
        this.erroSenha.set(null);
        this.erroApi.set(null);

        this.authService.cadastrar(this.form).subscribe({
            next: (resposta) => {
                void this.router.navigateByUrl('/login', {
                    state: {
                        emailCadastrado: resposta.email
                    }
                });
            },
            error: (erro: HttpErrorResponse) => {
                const problema = erro.error as ProblemDetails;

                this.erroEmail.set(problema.errors?.['Email']?.[0] ?? null);
                this.erroSenha.set(problema.errors?.['Senha']?.[0] ?? null);

                if (erro.status === 0) {
                    this.erroApi.set(problema.detail ?? 'Não foi possivel fazer conexão com a API.');
                } else if (erro.status === 409) {
                    this.erroApi.set(problema.detail ?? 'Já existe um usúario com esse email');
                } else if (!this.erroEmail() && !this.erroSenha()) {
                    this.erroApi.set(problema.detail ?? 'Ocorreu um erro ao tentar fazer o cadastro. Tente novamente.');
                }

            }
        });
    }

}