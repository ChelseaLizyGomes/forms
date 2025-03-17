import { Routes } from '@angular/router';
import { UserdetailsformComponent } from './pages/userdetailsform/userdetailsform.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'user-details-form',
    pathMatch: 'full',
  },
  {
    path: 'user-details-form',
    component: UserdetailsformComponent,
  },
];
