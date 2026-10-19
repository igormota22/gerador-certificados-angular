import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'cadastro',
        loadComponent: () =>
            import('./Auth/Cadastro/cadastro')
                .then(m => m.Cadastro)
    },
    {
        path: 'login',
        loadComponent: () =>
            import('./Auth/Login/login')
                .then(m => m.Login)
    },
    {
        path: 'home',
        loadComponent: () =>
            import('./Components/Home/home')
                .then(m => m.Home)
    },
    {
        path: 'curso',
        loadComponent: () =>
            import('./Components/Cursos/Shell/curso-shell')
                .then(m => m.CursoShell),
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'listagem'
            },
            {
                path: 'listagem',
                loadComponent: () =>
                    import('./Components/Cursos/Listagem/curso-listagem')
                        .then(m => m.CursoListagem)
            },
            {
                path: 'cadastro',
                loadComponent: () =>
                    import('./Components/Cursos/Cadastro/curso-cadastro')
                        .then(m => m.CursoCadastro)
            },
            {
                path: ':id',
                loadComponent: () =>
                    import('./Components/Cursos/Detalhes/curso-detalhe')
                        .then(m => m.CursoDetalhe)
            }
        ]
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
    }
];