
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RestService } from 'src/app/erp/dashboard/service/rest.service';
import { UsersService } from 'src/app/erp/service/users.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';


@Injectable({
  providedIn: 'root'
})
export class SubgrupoServices {  
  token      : string     = '';
  parametros : any        = [];

  constructor(
              private rest    : RestService,
              private userSer : UsersService,
              private store   : Store<AppState>
  ) {  }

   getSubgrupo(): Observable<any> {
    this.token = this.userSer.getToken();
    
       return this.rest.get('trabSubGrupo', this.token, this.parametros).pipe(
        map(
          (data: any) => data
          
      ) 
    );
  }
/*
  createSubgrupo(subgrupo: any): Observable<any> {
    let subgrupo = {
      subgrupoDes: subgrupo
    }
    return this.rest.post('insSubgrupo', this.token, subgrupo).pipe(
      map((data: any) => data)
    );
  }

  updateSubgrupo(subgrupo: any): Observable<any> {
 
    return this.rest.post('updSubgrupo', this.token,subgrupo).pipe(
      map((data: any) => data)
    );  
  }

  deleteSubgrupo(subgrupo: any): Observable<any> {

    return this.rest.post('delSubgrupo', this.token, subgrupo).pipe(
      map((data: any) => data)
    );  
  }*/
}
