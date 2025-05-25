import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'vacancies',
    loadComponent: () => import('./components/vacancies/vacancy-list/vacancy-list.component').then(m => m.VacancyListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'candidates',
    loadComponent: () => import('./components/candidates/candidate-list/candidate-list.component').then(m => m.CandidateListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'candidates/:id',
    loadComponent: () => import('./components/candidates/candidate-details/candidate-details.component').then(m => m.CandidateDetailsComponent),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: '/vacancies',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/vacancies'
  }
];
