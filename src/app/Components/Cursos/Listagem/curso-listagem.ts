import { Component, inject, signal, OnInit } from '@angular/core';
import { CursoService } from '../curso.service';
import { CursoResponse } from '../curso';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
    imports: [RouterLink, DatePipe],
    selector: 'app-curso-listagem',
    templateUrl: './curso-listagem.html'
})
export class CursoListagem implements OnInit {

    //========================================
    // INJEÇÃO DE DEPENDÊNCIA
    //========================================

    private readonly service = inject(CursoService);

    //========================================
    // ESTADOS
    //========================================

    protected cursos = signal<CursoResponse[]>([]);
    protected mensagemErro = signal<string | null>(null);
    protected carregando = signal(false);

    //========================================
    // CICLO DE VIDA
    //========================================

    ngOnInit(): void {
        this.exibirCursos();
    }

    //========================================
    // MÉTODOS
    //========================================

    exibirCursos(): void {
        this.carregando.set(true);
        this.mensagemErro.set(null);

        this.service.listar().subscribe({
            next: (cursos) => {
                this.cursos.set(cursos);
                this.carregando.set(false);
            },
            error: () => {
                this.mensagemErro.set(
                    'Não foi possível carregar os cursos.'
                );
                this.carregando.set(false);
            }
        });
    }

    calcularCargaHorariaTotal(): number {
        return this.cursos().reduce(
            (total, curso) => total + curso.cargaHoraria,
            0
        );
    }
}