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
        path: '',
        component: Home
    }
];
