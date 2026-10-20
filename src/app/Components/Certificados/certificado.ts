
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
    Gerado = 'Gerado',
    Falha = 'Falha'
}

export enum StatusProcessamento {
    Pendente = 'Pendente',
    GerandoCertificados = 'GerandoCertificados',
    GerandoZip = 'GerandoZip',
    Concluido = 'Concluido',
    Falha = 'Falha'
}
