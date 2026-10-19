import { Routes } from '@angular/router';
import { Home } from './Components/Home/home';

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () => import('./Components/Home/home').then((c) => c.Home)
    },
    {
        path: 'cadastro',
        loadComponent: () => import('./Auth/Cadastro/cadastro').then((c) => c.Cadastro)
    },
    {
        path: 'login',
        loadComponent: () => import('./Auth/Login/login').then((c) => c.Login)
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
        component: Home
    }
];
