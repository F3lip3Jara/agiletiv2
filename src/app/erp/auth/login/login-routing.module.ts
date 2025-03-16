import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';
import { CambiodepassComponent } from './cambiodepass/cambiodepass.component';
@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: LoginComponent },
        { path: 'cambiopass', component: CambiodepassComponent }
    ])],
    exports: [RouterModule]
})
export class LoginRoutingModule { }
