
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RestService } from 'src/app/erp/dashboard/service/rest.service';
import { UsersService } from 'src/app/erp/service/users.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';


@Injectable({
  providedIn: 'root'
})
export class ClaseServices {  
  token      : string     = '';
  parametros : any        = [];

  constructor(
              private rest    : RestService,
              private userSer : UsersService,
              private store   : Store<AppState>
  ) {  }

   getClase(): Observable<any> {
    this.token = this.userSer.getToken();
    
       return this.rest.get('trabSdClass', this.token, this.parametros).pipe(
        map(
          (data: any) => data
          
      ) 
    );
  }

  createClase(clase: any): Observable<any> {
    return this.rest.post('insSdClass', this.token, clase).pipe(
      map((data: any) => data)
    );
  }

  updateClase(clase: any): Observable<any> {
 
    return this.rest.post('updSdClass', this.token,clase).pipe(
      map((data: any) => data)
    );  
  }
/*
  deleteClase(clase: any): Observable<any> {

    return this.rest.post('delClase', this.token, clase).pipe(
      map((data: any) => data)
    );  
  }*/
}
