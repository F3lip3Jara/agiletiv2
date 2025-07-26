
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RestService } from 'src/app/erp/dashboard/service/rest.service';
import { UsersService } from 'src/app/erp/service/users.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';


@Injectable({
  providedIn: 'root'
})
export class LoginServices {  
  token      : string     = '';
  parametros : any        = [];

  constructor(
              private rest    : RestService,
              private userSer : UsersService,
              private store   : Store<AppState>
  ) {  }

   getLogin(): Observable<any> {
    this.token = this.userSer.getToken();
    
       return this.rest.get('trabLogin', this.token, this.parametros).pipe(
        map(
          (data: any) => data
          
      ) 
    );
  }
/*
  createLogin(login: any): Observable<any> {
    let login = {
      loginDes: login
    }
    return this.rest.post('insLogin', this.token, login).pipe(
      map((data: any) => data)
    );
  }

  updateLogin(login: any): Observable<any> {
 
    return this.rest.post('updLogin', this.token,login).pipe(
      map((data: any) => data)
    );  
  }

  deleteLogin(login: any): Observable<any> {

    return this.rest.post('delLogin', this.token, login).pipe(
      map((data: any) => data)
    );  
  }*/
}
