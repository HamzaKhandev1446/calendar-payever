import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'calendar',
    loadComponent: () => import('./calendar/calendar.component').then(m => m.CalendarComponent),
    children: [
      {
        path: 'day',
        loadComponent: () => import('./appointments-day-view/appointments-day-view.component').then(m => m.AppointmentsDayViewComponent)
      },
    ]
  },
  {
    path: 'component1',
    loadComponent: () => import('./component1/component1.component').then(m => m.Component1Component)
  },
  {
    path: 'component2',
    loadComponent: () => import('./component2/component2.component').then(m => m.Component2Component)
  },
  {
    path: 'component3',
    loadComponent: () => import('./component3/component3.component').then(m => m.Component3Component)
  },
  { path: '', redirectTo: '/calendar', pathMatch: 'full' },
  { path: '**', redirectTo: '/calendar' }
];
