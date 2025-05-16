
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RestService } from 'src/app/erp/dashboard/service/rest.service';
import { UsersService } from 'src/app/erp/service/users.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';


@Injectable({
  providedIn: 'root'
})
export class ParametrosServices {  
  token      : string     = '';
  parametros : any        = [];

  constructor(
              private rest    : RestService,
              private userSer : UsersService,
              private store   : Store<AppState>
  ) {  }

   getParametros(): Observable<any> {
    this.token = this.userSer.getToken();
    
       return this.rest.get('reporteParametros', this.token, this.parametros).pipe(
        map(
          (data: any) => data
          
      ) 
    );
  }
/*
  createParametros(parametros: any): Observable<any> {
    let parametros = {
      parametrosDes: parametros
    }
    return this.rest.post('insParametros', this.token, parametros).pipe(
      map((data: any) => data)
    );
  }

  updateParametros(parametros: any): Observable<any> {
 
    return this.rest.post('updParametros', this.token,parametros).pipe(
      map((data: any) => data)
    );  
  }

  deleteParametros(parametros: any): Observable<any> {

    return this.rest.post('delParametros', this.token, parametros).pipe(
      map((data: any) => data)
    );  
  }*/
}
