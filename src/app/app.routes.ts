import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login').then(m => m.Login),
    title: 'Login'
  },
  {
    path: '',
    canMatch: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard),
    title: 'Dashboard • Expense Tracker'
  },
  {
    path: 'add',
    canMatch: [authGuard],
    loadComponent: () => import('./features/add-expense/add-expense').then(m => m.AddExpense),
    title: 'Add Expense'
  },
  {
    path: 'summary',
    canMatch: [authGuard],
    loadComponent: () => import('./features/summary/summary').then(m => m.Summary),
    title: 'Summary'
  },
  { path: '**', redirectTo: '' }
];
