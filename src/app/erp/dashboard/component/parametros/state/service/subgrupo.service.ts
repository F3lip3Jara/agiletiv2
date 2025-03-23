
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
  ) { 
    this.token = this.userSer.getToken();
   }

   getSubgrupo(): Observable<any> {
       
       return this.rest.get('trabSubGrupo', this.token, this.parametros).pipe(
        map(
          (data: any) => data
          
      ) 
    );
  }

  createSubgrupo(subgrupo: any): Observable<any> {    
    return this.rest.post('insSubGrupo', this.token, subgrupo).pipe(
      map((data: any) => data)
    );
  }

  updateSubgrupo(subgrupo: any): Observable<any> {
 
    return this.rest.post('updSubGrupo', this.token,subgrupo).pipe(
      map((data: any) => data)
    );  
  }

/*  deleteSubgrupo(subgrupo: any): Observable<any> {

    return this.rest.post('delSubgrupo', this.token, subgrupo).pipe(
      map((data: any) => data)
    );  
  }*/
}
