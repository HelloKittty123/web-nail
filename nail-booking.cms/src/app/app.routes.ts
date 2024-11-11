import { Routes } from '@angular/router';
import { DashboardComponent } from './views/pages/dashboard/dashboard.component';
import { AuthGuard } from './services/auth.guard';
import { LayoutComponent } from './layout/layout/layout.component';
import { ManagerServiceComponent } from './views/pages/services/manager-service.component';
import { EmployeeComponent } from './views/pages/employee/employee.component';
import { CustomerComponent } from './views/pages/customer/customer.component';
import { SettingComponent } from './views/pages/setting/setting.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    data: {
      title: 'Home'
    },
    children: [
      { path: 'dashboard', component: DashboardComponent, pathMatch: 'full' },
      { path: 'customer', component: CustomerComponent, pathMatch: 'full' },
      { path: 'manager-service', component: ManagerServiceComponent, pathMatch: 'full' },
      { path: 'manager-staff', component: EmployeeComponent, pathMatch: 'full' },

      { path: 'setting', component: SettingComponent, pathMatch: 'full' },
    ]
  },
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    loadComponent: () => import('./views/pages/auth/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login page'
    }
  },

  { path: '**', redirectTo: 'dashboard' }

];
