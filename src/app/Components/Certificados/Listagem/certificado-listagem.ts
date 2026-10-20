import { Component, OnInit, inject, signal } from '@angular/core';
import { CursoService } from '../../Cursos/curso.service';
import { CursoResponse } from '../../Cursos/curso';
import { CertificadoService } from '../certificado.service';
import { CertificadoResponse } from '../certificado';
import { DatePipe } from '@angular/common';

@Component({
    imports: [DatePipe],
    selector: 'app-certificado-listagem',
    templateUrl: './certificado-listagem.html'
})
export class CertificadoListagem implements OnInit {

    //=======================================================
    //INJECAO DEPENDENCIA
    //=======================================================
    private readonly cursoService = inject(CursoService);
    private readonly certificadoService = inject(CertificadoService);

    //=======================================================
    //ESTADOS
    //========================================================
    protected cursos = signal<CursoResponse[]>([]);
    protected cursoSelecionado = signal('');

    protected certificados = signal<CertificadoResponse[]>([]);
    protected carregandoCursos = signal(false);
    protected carregandoCertificados = signal(false);
    protected mensagemErro = signal<string | null>(null);

    //====================================================
    //METODOS
    //====================================================
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
                this.mensagemErro.set('Não foi possível carregar os cursos.');
                this.carregandoCursos.set(false);
            }
        });
    }

    selecionarCurso(event: Event): void {
        const select = event.target as HTMLSelectElement;
        const cursoId = select.value;

        this.cursoSelecionado.set(cursoId);
        this.certificados.set([]);
        this.mensagemErro.set(null);

        if (!cursoId) {
            return;
        }

        this.carregandoCertificados.set(true);

        this.certificadoService.listar(cursoId).subscribe({
            next: (certificados) => {
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
}