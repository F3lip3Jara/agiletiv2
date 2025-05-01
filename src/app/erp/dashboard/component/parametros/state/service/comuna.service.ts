
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RestService } from 'src/app/erp/dashboard/service/rest.service';
import { UsersService } from 'src/app/erp/service/users.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';


@Injectable({
  providedIn: 'root'
})
export class ComunaServices {  
  token      : string     = '';
  parametros : any        = [];

  constructor(
              private rest    : RestService,
              private userSer : UsersService,
              private store   : Store<AppState>
  ) {  }

   getComuna(): Observable<any> {
    this.token = this.userSer.getToken();
    
       return this.rest.get('trabComuna', this.token, this.parametros).pipe(
        map(
          (data: any) => data
          
      ) 
    );
  }

  getComunaByCiudad(ciudad: any, region: any, pais: any): Observable<any> {
    this.parametros = [{key: 'ciuId', value: ciudad.ciuId} , {key: 'regId', value: region.regId} , {key: 'paiId', value: pais.paiId}]; 
    return this.rest.get('ciuCom', this.token, this.parametros).pipe(
      map((data: any) => data)
    );
  }
/*
  createComuna(comuna: any): Observable<any> {
    let comuna = {
      comunaDes: comuna
    }
    return this.rest.post('insComuna', this.token, comuna).pipe(
      map((data: any) => data)
    );
  }

  updateComuna(comuna: any): Observable<any> {
 
    return this.rest.post('updComuna', this.token,comuna).pipe(
      map((data: any) => data)
    );  
  }

  deleteComuna(comuna: any): Observable<any> {

    return this.rest.post('delComuna', this.token, comuna).pipe(
      map((data: any) => data)
    );  
  }*/
}
