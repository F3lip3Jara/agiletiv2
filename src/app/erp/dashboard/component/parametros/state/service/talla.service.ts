
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RestService } from 'src/app/erp/dashboard/service/rest.service';
import { UsersService } from 'src/app/erp/service/users.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';


@Injectable({
  providedIn: 'root'
})
export class TallaServices {  
  token      : string     = '';
  parametros : any        = [];

  constructor(
              private rest    : RestService,
              private userSer : UsersService,
              private store   : Store<AppState>
  ) {  
    this.token = this.userSer.getToken();
  }

   getTalla(): Observable<any> {   
       return this.rest.get('trabTalla', this.token, this.parametros).pipe(
        map(
          (data: any) => data
          
      ) 
    );
  }

  createTalla(talla: any): Observable<any> { 
    return this.rest.post('insTalla', this.token, talla).pipe(
      map((data: any) => data)
    );
  }

  updateTalla(talla: any): Observable<any> { 
    return this.rest.post('updTalla', this.token,talla).pipe(
      map((data: any) => data)
    );  
  }
/*
  deleteTalla(talla: any): Observable<any> {

    return this.rest.post('delTalla', this.token, talla).pipe(
      map((data: any) => data)
    );  
  }*/
}
