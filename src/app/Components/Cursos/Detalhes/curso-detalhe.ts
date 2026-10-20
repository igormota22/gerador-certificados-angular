
import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CursoService } from '../curso.service';
import { CursoResponse } from '../curso';

@Component({
    selector: 'app-curso-detalhe',
    imports: [DatePipe],
    templateUrl: './curso-detalhe.html'
})
export class CursoDetalhe implements OnInit {

    // ========================================
    // INJEÇÃO DE DEPENDÊNCIAS
    // ========================================

    private readonly service = inject(CursoService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);

    // ========================================
    // ESTADOS
    // ========================================

    protected readonly curso = signal<CursoResponse | null>(null);
    protected readonly mensagemErro = signal<string | null>(null);
    protected readonly carregando = signal(false);

    // ========================================
    // CICLO DE VIDA
    // ========================================

    ngOnInit(): void {
        this.exibirDetalhes();
    }

    // ========================================
    // MÉTODOS
    // ========================================

    exibirDetalhes(): void {
        const cursoId = this.route.snapshot.paramMap.get('id');

        if (!cursoId) {
            this.mensagemErro.set('Identificador do curso não informado.');
            return;
        }

        this.carregando.set(true);
        this.mensagemErro.set(null);

        this.service.obterPorId(cursoId).subscribe({
            next: (curso) => {
                this.curso.set(curso);
                this.carregando.set(false);
            },
            error: () => {
                this.mensagemErro.set('Não foi possível carregar os detalhes do curso.');
                this.carregando.set(false);
            }
        });
    }

    cancelar(): void {
        void this.router.navigateByUrl('/curso/listagem');
    }
}
