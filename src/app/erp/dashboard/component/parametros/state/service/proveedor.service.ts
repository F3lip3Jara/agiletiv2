
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RestService } from 'src/app/erp/dashboard/service/rest.service';
import { UsersService } from 'src/app/erp/service/users.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';


@Injectable({
  providedIn: 'root'
})
export class ProveedorServices {  
  token      : string     = '';
  parametros : any        = [];

  constructor(
              private rest    : RestService,
              private userSer : UsersService,
              private store   : Store<AppState>
  ) {  

    this.token = this.userSer.getToken();
  }

   getProveedor(): Observable<any> {
   
      let parametros = [];
       return this.rest.get('trabProveedor', this.token, parametros).pipe(
        map(
          (data: any) => data
          
      ) 
    );
  }
  validaProveedor(proveedor: any): Observable<any> {

    this.parametros = [{key :'prvRut' ,value: proveedor.trim()}];
   
    return this.rest.get('valPrvRut', this.token, this.parametros).pipe(
      map((data: any) => data)
    );
  }


  createProveedor(proveedor: any): Observable<any> {
      return this.rest.post('insProveedor', this.token, proveedor).pipe(
      map((data: any) => data)
    );
  }

  updateProveedor(proveedor: any): Observable<any> { 
    return this.rest.post('updProveedor', this.token,proveedor).pipe(
      map((data: any) => data)
    );  
  }

  aplicarFiltros(filtros: any[]): Observable<any> {
    this.parametros = [{key:'filter', value:btoa(JSON.stringify(filtros))}];
    return this.rest.get('trabProveedor', this.token, this.parametros).pipe(
      map((data: any) => data)
    );
  }
/*
  deleteProveedor(proveedor: any): Observable<any> {

    return this.rest.post('delProveedor', this.token, proveedor).pipe(
      map((data: any) => data)
    );  
  }*/
}
