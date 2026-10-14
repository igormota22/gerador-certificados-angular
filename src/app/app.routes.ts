import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./Components/Home/home').then((c) => c.Home)
    },
    {
        path: 'cadastro',
        loadComponent: () => import('./Auth/Cadastro/cadastro').then((c) => c.Cadastro)
    },
    {
        path: 'login',
        loadComponent: () => import('./Auth/Login/login').then((c) => c.Login)
    }
];
