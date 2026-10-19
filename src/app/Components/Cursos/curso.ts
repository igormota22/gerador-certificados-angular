export interface CadastrarCursoRequest {
    nome: string;
    descricao: string | null;
    cargaHoraria: number;
    dataConclusao: string;
}

export interface CadastrarCursoResponse {
    cursoId: string;
}

export interface CursoResponse {
    id: string;
    nome: string;
    descricao: string | null;
    cargaHoraria: number;
    dataConclusao: string;
}