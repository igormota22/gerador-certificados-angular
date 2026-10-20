
export interface SolicitarCertificadosRequest {
    nomesAlunos: string[];
}

export interface SolicitarCertificadosResponse {
    id: string;
    cursoId: string;
    dataDeCriacao: string;
}

export interface CertificadoResponse {
    id: string;
    cursoId: string;
    solicitacaoCertificadoId: string;
    nomeAluno: string;
    caminhoArquivo: string | null;
    dataDeGeracao: string | null;
    status: StatusCertificado;
}

export interface StatusSolicitacaoResponse {
    cursoId: string;
    status: StatusProcessamento;
}

export enum StatusCertificado {
    Gerado = 0,
    Falha = 1
}

export enum StatusProcessamento {
    Pendente = 0,
    GerandoCertificados = 1,
    GerandoZip = 2,
    Concluido = 3,
    Falha = 4
}
