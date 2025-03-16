
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RestService } from 'src/app/erp/dashboard/service/rest.service';
import { UsersService } from 'src/app/erp/service/users.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { Modulo } from '../interface/modulo.interface';


@Injectable({
  providedIn: 'root'
})
export class ModuloSerivices {  
  token      : string     = '';
  parametros : any        = [];

  constructor(
              private rest    : RestService,
              private userSer : UsersService,
              private store   : Store<AppState>
  ) { 

    this.token = this.userSer.getToken();
    
   }

   getModulo(): Observable<any> {    
       return this.rest.get('trabModule', this.token, this.parametros).pipe(
        map(
          (data: any) => data          
      ) 
    );
  }

  createModulo(data: any): Observable<any> {
    let modulo  :any = {
      molId: 0 , 
      opt:data.opt , 
      molDes: data.molDes ,
      molIcon : data.molIcon ,
      ok:'S' ,
      roles:data.roles  
    }
    console.log(modulo);
    return this.rest.post('insModulo', this.token, modulo).pipe(
      map((data: any) => data)
    );
  }

  updateModulo(data: any): Observable<any> {
    let modulo  :any = {
      molId: data.molId , 
      opt:data.opt , 
      molDes: data.molDes ,
      molIcon : data.molIcon ,
      ok:'S' ,
      roles:data.roles  
    }

    return this.rest.post('upModulo', this.token,modulo).pipe(
      map((data: any) => data)
    );  
  }

  deleteModulo(modulo: any): Observable<any> {

    return this.rest.post('delModulo', this.token, modulo).pipe(
      map((data: any) => data)
    );  
  }

  getModuloOpcionesById(id: number): Observable<any> {
    let empresaId : any = this.userSer.getUser().empresa;
    let parametros : any = [ {'key': 'molId', 'value': id  } ]
    return this.rest.get('asig', this.token, parametros).pipe(
      map((data: any) => data)
    );
  }

  getModuloRolById(id: number): Observable<any> {
    let empresaId : any = this.userSer.getUser().empresa;
    let parametros : any = [ {'key': 'molId', 'value': id  }]
    return this.rest.get('asigRol', this.token, parametros).pipe(
      map((data: any) => data)
    );
  }

  getOpcionesNoAsignadasModuloById(id: number): Observable<any> {
    let empresaId : any = this.userSer.getUser().empresa;
    let parametros : any = [ {'key': 'molId', 'value': id  } ]
    return this.rest.get('snAsig', this.token, parametros).pipe(
      map((data: any) => data)
    );
  }
  getRolesNoAsignadasModuloById(id: number): Observable<any> {
    let empresaId : any = this.userSer.getUser().empresa;
    let parametros : any = [ {'key': 'molId', 'value': id  } ]
    return this.rest.get('snAsigRol', this.token, parametros).pipe(
      map((data: any) => data)
    );
  } 

}

