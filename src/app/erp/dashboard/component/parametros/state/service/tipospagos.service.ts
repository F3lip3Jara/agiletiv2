
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RestService } from 'src/app/erp/dashboard/service/rest.service';
import { UsersService } from 'src/app/erp/service/users.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';


@Injectable({
  providedIn: 'root'
})
export class TipospagosServices {  
  token      : string     = '';
  parametros : any        = [];

  constructor(
              private rest    : RestService,
              private userSer : UsersService,
              private store   : Store<AppState>
  ) {  }

   getTipospagos(): Observable<any> {
    this.token = this.userSer.getToken();
    
       return this.rest.get('trabTipPag', this.token, this.parametros).pipe(
        map(
          (data: any) => data
          
      ) 
    );
  }

  createTipospagos(tipospagos: any): Observable<any> {
    
    return this.rest.post('insTipPag', this.token, tipospagos).pipe(
      map((data: any) => data)
    );
  }

  updateTipospagos(tipospagos: any): Observable<any> {
 
    return this.rest.post('updTipPag', this.token,tipospagos).pipe(
      map((data: any) => data)
    );  
  }
/*
  deleteTipospagos(tipospagos: any): Observable<any> {

    return this.rest.post('delTipospagos', this.token, tipospagos).pipe(
      map((data: any) => data)
    );  
  }*/
}
