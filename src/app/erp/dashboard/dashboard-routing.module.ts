import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
    {
      path: '',
      data: {
        title: 'Home',
      },
      children: [
      
        { path: '',  component: HomeComponent },
         
        ]
      }
    
    ];
    
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashBoardRoutingModule {
}
