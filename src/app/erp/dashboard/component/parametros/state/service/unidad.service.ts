
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RestService } from 'src/app/erp/dashboard/service/rest.service';
import { UsersService } from 'src/app/erp/service/users.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';


@Injectable({
  providedIn: 'root'
})
export class UnidadServices {  
  token      : string     = '';
  parametros : any        = [];

  constructor(
              private rest    : RestService,
              private userSer : UsersService,
              private store   : Store<AppState>
  ) {  }

   getUnidad(): Observable<any> {
    this.token = this.userSer.getToken();
    
       return this.rest.get('trabUnidad', this.token, this.parametros).pipe(
        map(
          (data: any) => data
          
      ) 
    );
  }
/*
  createUnidad(unidad: any): Observable<any> {
    let unidad = {
      unidadDes: unidad
    }
    return this.rest.post('insUnidad', this.token, unidad).pipe(
      map((data: any) => data)
    );
  }

  updateUnidad(unidad: any): Observable<any> {
 
    return this.rest.post('updUnidad', this.token,unidad).pipe(
      map((data: any) => data)
    );  
  }

  deleteUnidad(unidad: any): Observable<any> {

    return this.rest.post('delUnidad', this.token, unidad).pipe(
      map((data: any) => data)
    );  
  }*/
}
