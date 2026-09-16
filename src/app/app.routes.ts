import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/onboarding/onboarding.component').then((m) => m.OnboardingComponent),
    title: 'Persa',
  },
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      {
        path: 'inicio',
        loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
        title: 'Inicio · Persa',
      },
      {
        path: 'tareas',
        loadComponent: () => import('./features/tasks/tasks.component').then((m) => m.TasksComponent),
        title: 'Mis tareas · Persa',
      },
      {
        path: 'calendario',
        loadComponent: () => import('./features/calendar/calendar.component').then((m) => m.CalendarComponent),
        title: 'Calendario · Persa',
      },
      {
        path: 'metas',
        loadComponent: () => import('./features/goals/goals.component').then((m) => m.GoalsComponent),
        title: 'Mis metas · Persa',
      },
      {
        path: 'journal',
        loadComponent: () => import('./features/journal/journal.component').then((m) => m.JournalComponent),
        title: 'Journal · Persa',
      },
      {
        path: 'recompensas',
        loadComponent: () => import('./features/rewards/rewards.component').then((m) => m.RewardsComponent),
        title: 'Recompensas · Persa',
      },
      {
        path: 'mensajes',
        loadComponent: () => import('./features/messages/messages.component').then((m) => m.MessagesComponent),
        title: 'Mensajes · Persa',
      },
      {
        path: 'nosotros',
        loadComponent: () => import('./features/us/us.component').then((m) => m.UsComponent),
        title: 'Nosotros · Persa',
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
