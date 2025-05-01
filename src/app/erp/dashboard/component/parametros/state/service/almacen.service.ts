
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { RestService } from 'src/app/erp/dashboard/service/rest.service';
import { UsersService } from 'src/app/erp/service/users.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';


@Injectable({
  providedIn: 'root'
})
export class AlmacenServices {  
  token      : string     = '';
  parametros : any        = [];

  constructor(
              private rest    : RestService,
              private userSer : UsersService,
              private store   : Store<AppState>
  ) {     
    this.token = this.userSer.getToken();   
   }

   getAlmacen(centro: any): Observable<any> { 
       this.parametros = [{key : 'centroId', value : centro.centroId}];
       return this.rest.get('trabAlmacen', this.token, this.parametros).pipe(
        map(
          (data: any) => data          
          ) 
       );
    
  }

  createAlmacen(almacen: any): Observable<any> {
    
    return this.rest.post('insAlmacen', this.token, almacen).pipe(
      map((data: any) => data)
    );
  }

  updateAlmacen(almacen: any): Observable<any> { 
    return this.rest.post('updAlmacen', this.token,almacen).pipe(
      map((data: any) => data)
    );  
  }
/*
  deleteAlmacen(almacen: any): Observable<any> {

    return this.rest.post('delAlmacen', this.token, almacen).pipe(
      map((data: any) => data)
    );  
  }*/
}
