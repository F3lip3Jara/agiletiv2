
import { EventEmitter, Injectable, Output } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";



@Injectable({
  providedIn: "root"
})
export class UsersService {

  @Output() disparador  :EventEmitter <any> = new EventEmitter();   
  modulo  : any        = [];
  menu    : any        = [];


  constructor(private http: HttpClient , private cookies: CookieService ) {}

  login(user: any): Observable<any> {
     const headers = { 'Content-Type': 'application/json' };
     let xuser ={'Authentication':btoa(JSON.stringify(user))};
     return this.http.post('log', xuser, { headers });
  }

  setToken(token: string ) { 
    localStorage.setItem('token', token);   
  }

  getToken() : string{
   // return this.cookies.get("token");
   let datos = localStorage.getItem('token');

     if (!datos) {
       datos = '';
     }
     return datos;
  }

  eliminarToken () {
    localStorage.clear();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.setUsuario('','','','','','','','');
    this.menu     = [];
  }


  setTokenCrf(token: string) { 
    localStorage.setItem('crf', token);   
  }

  getTokenCrf() : string{
   // return this.cookies.get("token");
   let datos = localStorage.getItem('crf');
     if (!datos) {
       datos = '';
     }
     return datos;
  }

  setUsuario(usuario : string , rol : string , menu:string , img:string , empresa:string , imgEmp:string  , empNom:string , empApe:string  ){
    let user = {usuario : usuario , rol : rol , menu : menu, img:img , empresa: empresa , imgEmp : imgEmp , empNom : empNom , empApe : empApe};
    localStorage.setItem('user',btoa(JSON.stringify(user)));
   }

  getUser() :any{
    let datos = localStorage.getItem('user'); 
    if (!datos) {
      datos = '';
    }
    let datox  = JSON.parse(atob(datos));
    return datox;    

   }


   getNavItem(){
    let icono      = {};
    let dato = this.getUser();
    this.menu = [];
    this.menu = dato.menu;
    
    
    this.menu.forEach((element:any) => {
    
    });

  }
  

}
