
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RestService } from 'src/app/erp/dashboard/service/rest.service';
import { UsersService } from 'src/app/erp/service/users.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';


@Injectable({
  providedIn: 'root'
})
export class SeguridadServices {  
  token      : string     = '';
  parametros : any        = [];

  constructor(
              private rest    : RestService,
              private userSer : UsersService,
              private store   : Store<AppState>
  ) {  }

   getSeguridad(): Observable<any> {
    this.token = this.userSer.getToken();
    
       return this.rest.get('reporteSeguridad', this.token, this.parametros).pipe(
        map(
          (data: any) => data
          
      ) 
    );
  }
/*
  createSeguridad(seguridad: any): Observable<any> {
    let seguridad = {
      seguridadDes: seguridad
    }
    return this.rest.post('insSeguridad', this.token, seguridad).pipe(
      map((data: any) => data)
    );
  }

  updateSeguridad(seguridad: any): Observable<any> {
 
    return this.rest.post('updSeguridad', this.token,seguridad).pipe(
      map((data: any) => data)
    );  
  }

  deleteSeguridad(seguridad: any): Observable<any> {

    return this.rest.post('delSeguridad', this.token, seguridad).pipe(
      map((data: any) => data)
    );  
  }*/
}
