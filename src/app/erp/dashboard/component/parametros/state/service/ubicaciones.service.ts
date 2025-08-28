
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RestService } from 'src/app/erp/dashboard/service/rest.service';
import { UsersService } from 'src/app/erp/service/users.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';


@Injectable({
  providedIn: 'root'
})
export class UbicacionesServices {  
  token      : string     = '';
  parametros : any        = [];

  constructor(
              private rest    : RestService,
              private userSer : UsersService,
              private store   : Store<AppState>
  ) {  }

   getUbicaciones(sectorId: number): Observable<any> {
    this.token = this.userSer.getToken();
    let parametros = [{column: "sectorId", values: [sectorId]}];
    this.parametros = [{ key: 'filter', value: btoa(JSON.stringify(parametros)) }];
       return this.rest.get('trabSdUbicaciones', this.token, this.parametros).pipe(
        map(
          (data: any) => data
          
      ) 
    );
  }

  createUbicaciones(ubicaciones: any): Observable<any> { 
    let parametros = {
      datos: ubicaciones
    }
    return this.rest.post('insSdUbicaciones', this.token, parametros).pipe(
      map((data: any) => data)
    );
  }
/*
  updateUbicaciones(ubicaciones: any): Observable<any> {
 
    return this.rest.post('updUbicaciones', this.token,ubicaciones).pipe(
      map((data: any) => data)
    );  
  }

  deleteUbicaciones(ubicaciones: any): Observable<any> {

    return this.rest.post('delUbicaciones', this.token, ubicaciones).pipe(
      map((data: any) => data)
    );  
  }*/
}
