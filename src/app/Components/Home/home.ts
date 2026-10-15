import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../Auth/auth.service';

@Component({
    selector: 'app-home',
    imports: [RouterLink],
    templateUrl: './home.html'
})
export class Home implements OnInit {

    protected readonly authService = inject(AuthService);

    ngOnInit(): void {
        const autenticacao = this.authService.autenticacao();

        if (!autenticacao) {
            return;
        }

        this.authService
            .obterPorId(autenticacao.usuarioId)
            .subscribe({
                error: () => {
                    this.authService.sair();
                }
            });
    }

    sair(): void {
        this.authService.sair();
    }
}