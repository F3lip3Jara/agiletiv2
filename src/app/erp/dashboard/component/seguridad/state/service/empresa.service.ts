
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RestService } from 'src/app/erp/dashboard/service/rest.service';
import { UsersService } from 'src/app/erp/service/users.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';


@Injectable({
  providedIn: 'root'
})
export class EmpresaSerivices {  
  token      : string     = '';
  parametros : any        = [];

  constructor(
              private rest    : RestService,
              private userSer : UsersService,
              private store   : Store<AppState>
  ) { 

    this.token = this.userSer.getToken();    
   }

   getEmpresa(): Observable<any> {
    
       return this.rest.get('trabEmpresa', this.token, this.parametros).pipe(
        map(
          (data: any) => data
          
      ) 
    );
  }

  createEmpresa(empresa: any): Observable<any> {
  
    return this.rest.post('insEmpresa', this.token, empresa).pipe(
      map((data: any) => data)
    );
  }

  updateEmpresa(empresa: any): Observable<any> {
 
    return this.rest.post('updEmpresa', this.token,empresa).pipe(
      map((data: any) => data)
    );  
  }

  deleteEmpresa(empresa: any): Observable<any> {
    return this.rest.post('delEmpresa', this.token, empresa).pipe(
      map((data: any) => data)
    );  
  }

  logoEmpresa(id: number): Observable<any> {
    this.parametros = [{key: 'empresa', value: id}];
    return this.rest.get('upImg', this.token, this.parametros).pipe(
      map((data: any) => data)
    );
  }

  getOpcionesAsignadas(id: number): Observable<any> {
    this.parametros = [{key : 'empId', value:id}];  
    return this.rest.get('optAsig', this.token, this.parametros).pipe(
      map((data: any) => data)
    );
  } 

  getOpcionesNoAsignadas(id: number): Observable<any> {
    this.parametros = [{key: 'empId', value: id}];
    return this.rest.get('optsnAsig', this.token, this.parametros).pipe(
      map((data: any) => data)
    );
  } 
  
  createOpcionAsignada(empresaId: number, opciones: any[]): Observable<any> {
    const payload = {
      empId: empresaId,
      asig: opciones
    };
    return this.rest.post('insEmpOpt', this.token, payload).pipe(
      map((data: any) => data)
    );
  }
}
