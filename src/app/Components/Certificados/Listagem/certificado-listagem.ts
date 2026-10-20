
import {
    Component,
    OnInit,
    OnDestroy,
    inject,
    signal,
    computed
} from '@angular/core';

import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
    Subscription,
    interval,
    EMPTY
} from 'rxjs';

import {
    startWith,
    exhaustMap,
    takeWhile,
    catchError,
    finalize
} from 'rxjs/operators';

import { CursoService } from '../../Cursos/curso.service';
import { CursoResponse } from '../../Cursos/curso';

import { CertificadoService } from '../certificado.service';

import {
    CertificadoResponse,
    StatusSolicitacaoResponse,
    StatusCertificado,
    StatusProcessamento
} from '../certificado';

@Component({
    selector: 'app-certificado-listagem',
    imports: [DatePipe, RouterLink],
    templateUrl: './certificado-listagem.html'
})
export class CertificadoListagem implements OnInit, OnDestroy {

    //=======================================================
    // INJEÇÃO DE DEPENDÊNCIA
    //=======================================================
    private readonly cursoService = inject(CursoService);
    private readonly certificadoService = inject(CertificadoService);

    private acompanhamento?: Subscription;

    //=======================================================
    // ESTADOS
    //=======================================================
    protected cursos = signal<CursoResponse[]>([]);
    protected cursoSelecionado = signal('');

    protected certificados = signal<CertificadoResponse[]>([]);

    protected statusSolicitacao =
        signal<StatusSolicitacaoResponse | null>(null);

    protected carregandoCursos = signal(false);
    protected carregandoCertificados = signal(false);

    protected mensagemErro = signal<string | null>(null);

    //=======================================================
    // VALORES CALCULADOS
    //=======================================================
    protected totalCertificados = computed(
        () => this.certificados().length
    );

    protected totalGerados = computed(
        () => this.certificados().filter(
            certificado =>
                certificado.status === StatusCertificado.Gerado
        ).length
    );

    protected totalFalhas = computed(
        () => this.certificados().filter(
            certificado =>
                certificado.status === StatusCertificado.Falha
        ).length
    );

    protected nomeCursoSelecionado = computed(
        () => this.cursos().find(
            curso => curso.id === this.cursoSelecionado()
        )?.nome ?? '—'
    );

    //=======================================================
    // CICLO DE VIDA
    //=======================================================
    ngOnInit(): void {
        this.carregarCursos();
    }

    ngOnDestroy(): void {
        this.pararAcompanhamento();
    }

    //=======================================================
    // CURSOS
    //=======================================================
    carregarCursos(): void {
        this.carregandoCursos.set(true);
        this.mensagemErro.set(null);

        this.cursoService.listar().subscribe({
            next: cursos => {
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

    //=======================================================
    // SELEÇÃO DO CURSO
    //=======================================================
    selecionarCurso(event: Event): void {
        const select = event.target as HTMLSelectElement;
        const cursoId = select.value;

        // Cancela o acompanhamento do curso anterior.
        this.pararAcompanhamento();

        this.cursoSelecionado.set(cursoId);
        this.certificados.set([]);
        this.statusSolicitacao.set(null);
        this.mensagemErro.set(null);

        if (!cursoId) {
            this.carregandoCertificados.set(false);
            return;
        }

        this.carregarCertificados(cursoId);
        this.acompanharProcessamento(cursoId);
    }

    //=======================================================
    // CERTIFICADOS
    //=======================================================
    private carregarCertificados(cursoId: string): void {
        this.carregandoCertificados.set(true);

        this.certificadoService.listar(cursoId).subscribe({
            next: certificados => {
                this.certificados.set(certificados);
                this.carregandoCertificados.set(false);
            },

            error: () => {
                this.mensagemErro.set(
                    'Não foi possível carregar os certificados deste curso.'
                );

                this.carregandoCertificados.set(false);
            }
        });
    }

    //=======================================================
    // STATUS DA SOLICITAÇÃO
    //=======================================================
    private acompanharProcessamento(cursoId: string): void {
        this.acompanhamento = interval(2000)
            .pipe(
                // Executa a primeira consulta imediatamente.
                startWith(0),

                // Não inicia outra consulta enquanto a anterior estiver ativa.
                exhaustMap(() =>
                    this.certificadoService.obterStatus(cursoId).pipe(
                        catchError(() => {
                            this.mensagemErro.set(
                                'Não foi possível consultar o status da solicitação.'
                            );

                            // Tenta novamente na próxima execução do intervalo.
                            return EMPTY;
                        })
                    )
                ),

                // Continua consultando até o processamento terminar.
                // O segundo argumento permite emitir o estado final.
                takeWhile(
                    resposta =>
                        resposta.status !== StatusProcessamento.Concluido &&
                        resposta.status !== StatusProcessamento.Falha,
                    true
                ),

                finalize(() => {
                    this.carregandoCertificados.set(false);
                })
            )
            .subscribe({
                next: resposta => {
                    this.statusSolicitacao.set(resposta);
                    this.mensagemErro.set(null);

                    // Ao terminar, atualiza a lista com os resultados finais.
                    if (
                        resposta.status === StatusProcessamento.Concluido ||
                        resposta.status === StatusProcessamento.Falha
                    ) {
                        this.carregarCertificados(cursoId);
                    }
                }
            });
    }

    //=======================================================
    // CANCELAMENTO DO ACOMPANHAMENTO
    //=======================================================
    private pararAcompanhamento(): void {
        this.acompanhamento?.unsubscribe();
        this.acompanhamento = undefined;
    }
}
