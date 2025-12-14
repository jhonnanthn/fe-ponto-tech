import { Routes } from '@angular/router';
import { NotFoundComponent } from './component/not-found/not-found';
import { LoginComponent } from './component/login/login';
import { TimeClockRecordsComponent } from './component/time-clock-records/time-clock-records';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'records', component: TimeClockRecordsComponent, canActivate: [authGuard] },
  { path: '**', component: NotFoundComponent }         // Rota para erros (não encontrada)
];
