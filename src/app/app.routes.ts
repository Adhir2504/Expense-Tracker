import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

// Application route configuration. Each route lazy-loads a standalone
// component using dynamic import so feature code is only loaded when
// needed. Protected routes use `authGuard` via `canMatch` to prevent
// unauthorized route matching.
export const routes: Routes = [
  {
    // Public login page
    path: 'login',
    loadComponent: () => import('./features/auth/login').then(m => m.Login),
    title: 'Login'
  },
  {
    // Root/dashboard - requires authentication
    path: '',
    canMatch: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard),
    title: 'Dashboard • Expense Tracker'
  },
  {
    // Add expense page - protected
    path: 'add',
    canMatch: [authGuard],
    loadComponent: () => import('./features/add-expense/add-expense').then(m => m.AddExpense),
    title: 'Add Expense'
  },
  {
    // Edit expense page - protected
    path: 'edit/:id',
    canMatch: [authGuard],
    loadComponent: () => import('./features/edit-expense/edit-expense').then(m => m.EditExpense),
    title: 'Edit Expense'
  },
  
  {
    // Summary view - protected
    path: 'summary',
    canMatch: [authGuard],
    loadComponent: () => import('./features/summary/summary').then(m => m.Summary),
    title: 'Summary'
  },
  // Fallback route: redirect unknown paths back to the dashboard
  { path: '**', redirectTo: '' }
];
