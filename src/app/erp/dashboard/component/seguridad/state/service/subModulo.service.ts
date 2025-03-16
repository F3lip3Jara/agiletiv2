
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RestService } from 'src/app/erp/dashboard/service/rest.service';
import { UsersService } from 'src/app/erp/service/users.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';


@Injectable({
  providedIn: 'root'
})
export class SubModuloSerivices {  
  token      : string     = '';
  parametros : any        = [];

  constructor(
              private rest    : RestService,
              private userSer : UsersService,
              private store   : Store<AppState>
  ) {  }

   getSubModulo(): Observable<any> {
    this.token = this.userSer.getToken();
    
       return this.rest.get('trabSubModulo', this.token, this.parametros).pipe(
        map(
          (data: any) => data
          
      ) 
    );
  }

  createSubModulo(subModulo: any): Observable<any> {
    let subModulo = {
      subModuloDes: subModulo
    }
    return this.rest.post('insSubModulo', this.token, subModulo).pipe(
      map((data: any) => data)
    );
  }

  updateSubModulo(subModulo: any): Observable<any> {
 
    return this.rest.post('updSubModulo', this.token,subModulo).pipe(
      map((data: any) => data)
    );  
  }

  deleteSubModulo(subModulo: any): Observable<any> {

    return this.rest.post('delSubModulo', this.token, subModulo).pipe(
      map((data: any) => data)
    );  
  }
}
