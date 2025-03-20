import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RestService } from 'src/app/erp/dashboard/service/rest.service';
import { UsersService } from 'src/app/erp/service/users.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';


@Injectable({
  providedIn: 'root'
})
export class SubModuloSerivices {  
  token      : string     = '';
  parametros : any        = [];

  constructor(
              private rest    : RestService,
              private userSer : UsersService,
              private store   : Store<AppState>
  ) { 
    this.token = this.userSer.getToken();
   }

   getSubModulo(modulo: any): Observable<any> {
    
    this.parametros = [{key: 'modulo', value: JSON.stringify(modulo)}]
    
    return this.rest.get('trabsubopc', this.token, this.parametros).pipe(
        map(
          (data: any) => data
          
      ) 
    );
  }

  getOpcionesNoAsignadasSubModuloById(modulo: any): Observable<any> {

    return this.rest.get('snAsigOpt', this.token, [{key: 'modulo', value: JSON.stringify(modulo)}]).pipe(
      map((data: any) => data)
    );
  }

  getOpcionesAsignadasSubModuloById(modulo: any , molsId : number): Observable<any> {
    return this.rest.get('asigOpt', this.token, [{key: 'modulo', value: JSON.stringify(modulo)}, {key: 'molsId', value: molsId}]).pipe(
      map((data: any) => data)
    );
  }

  createSubModulo(subModulo: any): Observable<any> {
    console.log(subModulo);
    let subModulos : any = {
      modulo : subModulo.modulo,       
      opt    : subModulo.opt,
      molId  : subModulo.molId,
      molsDes: subModulo.molsDes,
      name   : subModulo.name,
      molsId : subModulo.molsId
    }
    return this.rest.post('insSubOpc', this.token, subModulos).pipe(
      map((data: any) => data)
    );
  }

  updateSubModulo(subModulo: any): Observable<any> {
    let subModulos : any = {
      modulo : subModulo.modulo,       
      opt    : subModulo.opt,
      molId  : subModulo.molId,
      molsDes: subModulo.molsDes,
      molsId : subModulo.molsId
    }
    return this.rest.post('insSubOpc', this.token, subModulos).pipe(
      map((data: any) => data)
    );
  }

  deleteSubModulo(subModulo: any): Observable<any> {

    return this.rest.post('delSubOpc', this.token, subModulo).pipe(
      map((data: any) => data)
    );
  }
}
