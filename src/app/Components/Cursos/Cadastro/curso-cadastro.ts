
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
    form,
    FormField,
    required,
    min,
    submit
} from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { CursoService } from '../curso.service';

interface CursoForm {
    nome: string;
    descricao: string;
    cargaHoraria: number;
    dataConclusao: string;
}

@Component({
    imports: [FormField],
    selector: 'app-curso-cadastro',
    templateUrl: './curso-cadastro.html'
})
export class CursoCadastro {

    // ========================================
    // INJEÇÃO DE DEPENDÊNCIAS
    // ========================================

    private readonly service = inject(CursoService);
    private readonly router = inject(Router);

    // ========================================
    // ESTADOS
    // ========================================

    protected readonly mensagemErro = signal<string | null>(null);

    protected readonly modelo = signal<CursoForm>({
        nome: '',
        descricao: '',
        cargaHoraria: 1,
        dataConclusao: ''
    });

    protected readonly formulario = form(
        this.modelo,
        (caminho) => {
            required(caminho.nome, {
                message: 'Informe o nome do curso.'
            });

            min(caminho.cargaHoraria, 1, {
                message: 'A carga horária deve ser maior que zero.'
            });

            required(caminho.dataConclusao, {
                message: 'Informe a data de conclusão.'
            });
        }
    );

    // ========================================
    // ENVIO DO FORMULÁRIO
    // ========================================

    async enviarFormulario(event: Event): Promise<void> {
        event.preventDefault();
        this.mensagemErro.set(null);

        try {
            await submit(this.formulario, async () => {
                await firstValueFrom(
                    this.service.cadastrar(this.modelo())
                );

                await this.router.navigateByUrl('/curso/listagem');
            });
        } catch {
            this.mensagemErro.set(
                'Não foi possível cadastrar o curso. Tente novamente.'
            );
        }
    }


    cancelar(): void {
        void this.router.navigateByUrl('/curso/listagem');
    }
}
