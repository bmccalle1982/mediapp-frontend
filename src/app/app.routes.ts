import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
   //Cuando venga la ruta pages, vamos a cargar todas las definiciones
  //expresadas aqui: lazy load
  //Bloque Lazy Load, dentro de la carpeta pages el archivo pages.route
  //y voy a leer su archivo que esta expuesto
  //Ayuda que nuestro sistema tenga diferentes plantillas
  {
    path: 'pages',
    component: LayoutComponent,//setea que todas las pages de layout se cargue
    loadChildren: () => import('./pages/pages.routes').then (x => x.pagesRoutes)
  }


];
