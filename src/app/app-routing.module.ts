import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { NotfoundComponent } from './erp/auth/notfound/notfound.component';


@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: 'desk', component: AppLayoutComponent,
                children: [
                    { path: 'home', loadChildren: () => import('./erp/dashboard/dashboard.module').then(m => m.DashboardModule) },
                    { path: 'parametros', loadChildren: () => import('./erp/dashboard/component/parametros/parametros.module').then(m => m.ParametrosModule) },
                    { path: 'seguridad', loadChildren: () => import('./erp/dashboard/component/seguridad/seguridad.module').then(m => m.SeguridadModule) }
                ]
            },
            {
                path: '',
                redirectTo: 'auth/login',
                pathMatch: 'full'
              },
             { path: 'auth', loadChildren: () => import('./erp/auth/auth.module').then(m => m.AuthModule) },
             { path: 'notfound', component: NotfoundComponent },
             { path: '**', redirectTo: '/desk' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
