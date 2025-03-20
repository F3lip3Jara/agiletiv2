
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RestService } from 'src/app/erp/dashboard/service/rest.service';
import { UsersService } from 'src/app/erp/service/users.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';


@Injectable({
  providedIn: 'root'
})
export class MonedaSerivices {  
  token      : string     = '';
  parametros : any        = [];

  constructor(
              private rest    : RestService,
              private userSer : UsersService,
              private store   : Store<AppState>
  ) {  }

   getMoneda(): Observable<any> {
    this.token = this.userSer.getToken();
    
       return this.rest.get('trabMoneda', this.token, this.parametros).pipe(
        map(
          (data: any) => data
          
      ) 
    );
  }

  /*createMoneda(moneda: any): Observable<any> {
    let moneda = {
      monedaDes: moneda
    }
    return this.rest.post('insMoneda', this.token, moneda).pipe(
      map((data: any) => data)
    );
  }

  updateMoneda(moneda: any): Observable<any> {
 
    return this.rest.post('updMoneda', this.token,moneda).pipe(
      map((data: any) => data)
    );  
  }

  deleteMoneda(moneda: any): Observable<any> {

    return this.rest.post('delMoneda', this.token, moneda).pipe(
      map((data: any) => data)
    );  
  }*/
}
