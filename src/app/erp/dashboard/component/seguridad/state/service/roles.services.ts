import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RestService } from 'src/app/erp/dashboard/service/rest.service';
import { UsersService } from 'src/app/erp/service/users.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';


@Injectable({
  providedIn: 'root'
})
export class RolesSerivices {  
  token      : string     = '';
  parametros : any        = [];

  constructor(
              private rest    : RestService,
              private userSer : UsersService,
              private store   : Store<AppState>
  ) { 

    this.token = this.userSer.getToken();
   }

   getRoles(): Observable<any> {
 
    
       return this.rest.get('trabRoles', this.token, this.parametros).pipe(
        map(
          (data: any) => data
          
      ) 
    );
  }

  createRoles(roles: any): Observable<any> {
    let rolesx = {
      rolDes: roles
    }
    return this.rest.post('insRoles', this.token, rolesx).pipe(
      map((data: any) => data)
    );
  }

  updateRoles(roles: any): Observable<any> {
 
    return this.rest.post('updRoles', this.token, roles).pipe(
      map((data: any) => data)
    );  
  }

  deleteRoles(roles: any): Observable<any> {

    return this.rest.post('delRoles', this.token, roles).pipe(
      map((data: any) => data)
    );  
  }
}