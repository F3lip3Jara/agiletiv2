
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RestService } from 'src/app/erp/dashboard/service/rest.service';
import { UsersService } from 'src/app/erp/service/users.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';


@Injectable({
  providedIn: 'root'
})
export class GrupoServices {  
  token      : string     = '';
  parametros : any        = [];

  constructor(
              private rest    : RestService,
              private userSer : UsersService,
              private store   : Store<AppState>
  ) { 

    this.token = this.userSer.getToken();
   }

   getGrupo(): Observable<any> {   
       return this.rest.get('trabGrupo', this.token, this.parametros).pipe(
        map(
          (data: any) => data
          
      ) 
    );
  }

  createGrupo(grupo: any): Observable<any> {
   
    return this.rest.post('insGrupo', this.token, grupo).pipe(
      map((data: any) => data)
    );
  }

  updateGrupo(grupo: any): Observable<any> {
 
    return this.rest.post('updGrupo', this.token,grupo).pipe(
      map((data: any) => data)
    );  
  }

  deleteGrupo(grupo: any): Observable<any> {

    return this.rest.post('delGrupo', this.token, grupo).pipe(
      map((data: any) => data)
    );  
  }
}
