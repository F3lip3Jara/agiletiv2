import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { UsersService } from '../../service/users.service';
import {Usuario} from '../model/usuario.model';
import { Route, Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `],
    standalone: false
})
export class LoginComponent {

    valCheck: string[] = ['remember'];
    enabled            = false;
    password!: string;

    constructor(public layoutService: LayoutService , private userService: UsersService , private router: Router ) {
        
     }

     login(userx:string){
        if (this.password && userx.length > 0) {
            this.enabled = true;
            const user   = new Usuario(1, '', this.password, '', userx);
            this.userService.login(user).subscribe(
              async (data:any) => {  
                try{
                  if(data.error == 0){
                    const { reinicio, token, crf, menu, rol, name, img, empresa , error  , id , empNom , empApe } = data;  
                    this.userService.setToken(token);
                    this.userService.setTokenCrf(crf);         
                    this.userService.setUsuario(name, rol, menu, img, empresa, '', empNom, empApe);                      
                    this.router.navigate(['/desk']);
                    this.enabled = false;
                  }else{
                    console.error('Error de autenticación:');
                    this.enabled = false;
                  }
                 
                }catch{
                  console.error('Error de autenticación:');
                  this.enabled = false;
                }          
                   
              },
             async  (error) => {
                console.error('Error de autenticación:');
                this.enabled = false;
              }
            );
          }
        
     }
}
