import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ConfiguracionuserComponent } from './configuracionuser.component';


const routes: Routes = [
    {
      path: '',
      data: {
        title: 'Configuracion de Usuario',
      },
      children: [
      
        { path: 'user',  component: ConfiguracionuserComponent },
         
        ]
      }
    
    ];
    
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConfiguracionuserRoutingModule {
}
