
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RestService } from 'src/app/erp/dashboard/service/rest.service';
import { UsersService } from 'src/app/erp/service/users.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';


@Injectable({
  providedIn: 'root'
})
export class PaisServices {  
  token      : string     = '';
  parametros : any        = [];

  constructor(
              private rest    : RestService,
              private userSer : UsersService,
              private store   : Store<AppState>
  ) {  }

   getPais(): Observable<any> {
    this.token = this.userSer.getToken();
    
       return this.rest.get('trabPais', this.token, this.parametros).pipe(
        map(
          (data: any) => data
          
      ) 
    );
  }
/*
  createPais(pais: any): Observable<any> {
    let pais = {
      paisDes: pais
    }
    return this.rest.post('insPais', this.token, pais).pipe(
      map((data: any) => data)
    );
  }

  updatePais(pais: any): Observable<any> {
 
    return this.rest.post('updPais', this.token,pais).pipe(
      map((data: any) => data)
    );  
  }

  deletePais(pais: any): Observable<any> {

    return this.rest.post('delPais', this.token, pais).pipe(
      map((data: any) => data)
    );  
  }*/
}
