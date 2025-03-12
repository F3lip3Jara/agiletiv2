
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RestService } from 'src/app/erp/dashboard/service/rest.service';
import { UsersService } from 'src/app/erp/service/users.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';


@Injectable({
  providedIn: 'root'
})
export class AccionesSerivices {  
  token      : string     = '';
  parametros : any        = [];

  constructor(
              private rest    : RestService,
              private userSer : UsersService,
              private store   : Store<AppState>
  ) {  }

   getAcciones(optId: number): Observable<any> {
    this.parametros = [{key: 'optId' , value: optId}]
    this.token = this.userSer.getToken();    
       return this.rest.get('trabAcciones', this.token, this.parametros).pipe(
        map(
          (data: any) => data
          
      ) 
    );
  }

  createAcciones(acciones: any): Observable<any> {   
    return this.rest.post('insAcciones', this.token, acciones).pipe(
      map((data: any) => data)
    );
  }

  updateAcciones(acciones: any): Observable<any> { 
    return this.rest.post('updAcciones', this.token,acciones).pipe(
      map((data: any) => data)
    );  
  }

  deleteAcciones(acciones: any): Observable<any> {

    return this.rest.post('delAcciones', this.token, acciones).pipe(
      map((data: any) => data)
    );  
  }
}
