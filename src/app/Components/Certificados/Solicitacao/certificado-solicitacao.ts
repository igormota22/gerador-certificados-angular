
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CursoService } from '../../Cursos/curso.service';
import { CursoResponse } from '../../Cursos/curso';

import { CertificadoService } from '../certificado.service';
import {
    SolicitarCertificadosRequest,
    SolicitarCertificadosResponse
} from '../certificado';

@Component({
    selector: 'app-certificado-solicitacao',
    imports: [FormsModule],
    templateUrl: './certificado-solicitacao.html'
})
export class CertificadoSolicitacao implements OnInit {

    //=======================================================
    //INJECAO DEPENDENCIA
    //======================================================
    private readonly cursoService = inject(CursoService);
    private readonly certificadoService = inject(CertificadoService);

    //============================================================
    //ESTADOS
    //===========================================================
    protected cursos = signal<CursoResponse[]>([]);
    protected cursoSelecionado = signal('');
    protected nomeAluno = signal('');
    protected nomesAlunos = signal<string[]>([]);

    protected carregandoCursos = signal(false);
    protected enviando = signal(false);
    protected mensagemErro = signal<string | null>(null);
    protected mensagemSucesso = signal<string | null>(null);

    //===========================================================
    //METODOS
    //============================================================
    ngOnInit(): void {
        this.carregarCursos();
    }

    carregarCursos(): void {
        this.carregandoCursos.set(true);
        this.mensagemErro.set(null);

        this.cursoService.listar().subscribe({
            next: (cursos) => {
                this.cursos.set(cursos);
                this.carregandoCursos.set(false);
            },
            error: () => {
                this.mensagemErro.set(
                    'Não foi possível carregar os cursos.'
                );
                this.carregandoCursos.set(false);
            }
        });
    }

    selecionarCurso(event: Event): void {
        const select = event.target as HTMLSelectElement;

        this.cursoSelecionado.set(select.value);
        this.mensagemErro.set(null);
        this.mensagemSucesso.set(null);
    }

    atualizarNomeAluno(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.nomeAluno.set(input.value);
    }

    adicionarAluno(): void {
        const nome = this.nomeAluno().trim();

        if (!nome) {
            this.mensagemErro.set('Informe o nome do aluno.');
            return;
        }

        const nomeExistente = this.nomesAlunos().some(
            aluno => aluno.toLocaleLowerCase() === nome.toLocaleLowerCase()
        );

        if (nomeExistente) {
            this.mensagemErro.set(
                'Este aluno já foi adicionado à solicitação.'
            );
            return;
        }

        this.nomesAlunos.update(nomes => [...nomes, nome]);
        this.nomeAluno.set('');
        this.mensagemErro.set(null);
        this.mensagemSucesso.set(null);
    }

    removerAluno(indice: number): void {
        this.nomesAlunos.update(
            nomes => nomes.filter((_, i) => i !== indice)
        );

        this.mensagemErro.set(null);
        this.mensagemSucesso.set(null);
    }

    adicionarComEnter(event: Event): void {
        event.preventDefault();
        this.adicionarAluno();
    }

    solicitarCertificados(): void {
        const cursoId = this.cursoSelecionado();
        const nomes = this.nomesAlunos();

        this.mensagemErro.set(null);
        this.mensagemSucesso.set(null);

        if (!cursoId) {
            this.mensagemErro.set('Selecione um curso.');
            return;
        }

        if (nomes.length === 0) {
            this.mensagemErro.set(
                'Adicione pelo menos um aluno à solicitação.'
            );
            return;
        }

        const req: SolicitarCertificadosRequest = {
            nomesAlunos: nomes
        };

        this.enviando.set(true);

        this.certificadoService.solicitar(cursoId, req).subscribe({
            next: (resposta: SolicitarCertificadosResponse) => {
                this.enviando.set(false);

                this.mensagemSucesso.set(
                    `Solicitação criada com sucesso! Identificador: ${resposta.id}`
                );

                this.nomesAlunos.set([]);
                this.nomeAluno.set('');
            },
            error: (erro) => {
                this.enviando.set(false);

                this.mensagemErro.set(
                    erro?.error?.detail ??
                    erro?.error?.message ??
                    'Não foi possível solicitar a geração dos certificados.'
                );
            }
        });
    }
}
