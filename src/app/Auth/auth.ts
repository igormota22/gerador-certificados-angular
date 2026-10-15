export interface CadastrarUsuarioRequest {
    email: string;
    senha: string;
}

export interface CadastrarUsuarioResponse {
    id: string;
    email: string;
}

export interface AutenticarUsuarioRequest {
    email: string;
    senha: string;
}

export interface AutenticarUsuarioResponse {
    usuarioId: string;
    accessToken: string;
    dataExpiracaoEmUtc: string;
}

export interface UsuarioResponse {
    id: string;
    email: string;
}

export interface ProblemDetails {
    title?: string;
    status?: number;
    detail?: string;
    type?: string;
    traceId?: string;
    errors?: Record<string, string[]>;
}