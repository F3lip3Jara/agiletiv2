
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RestService } from 'src/app/erp/dashboard/service/rest.service';
import { UsersService } from 'src/app/erp/service/users.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';


@Injectable({
  providedIn: 'root'
})
export class MotivoServices {  
  token      : string     = '';
  parametros : any        = [];

  constructor(
              private rest    : RestService,
              private userSer : UsersService,
              private store   : Store<AppState>
  ) {  }

   getMotivo(): Observable<any> {
    this.token = this.userSer.getToken();
    
       return this.rest.get('trabMotivo', this.token, this.parametros).pipe(
        map(
          (data: any) => data
          
      ) 
    );
  }
/*
  createMotivo(motivo: any): Observable<any> {
    let motivo = {
      motivoDes: motivo
    }
    return this.rest.post('insMotivo', this.token, motivo).pipe(
      map((data: any) => data)
    );
  }

  updateMotivo(motivo: any): Observable<any> {
 
    return this.rest.post('updMotivo', this.token,motivo).pipe(
      map((data: any) => data)
    );  
  }

  deleteMotivo(motivo: any): Observable<any> {

    return this.rest.post('delMotivo', this.token, motivo).pipe(
      map((data: any) => data)
    );  
  }*/
}
