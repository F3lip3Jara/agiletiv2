import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { RestService } from 'src/app/erp/dashboard/service/rest.service';
import { UsersService } from 'src/app/erp/service/users.service';
import { AppState } from '../../../app.state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class OpcionesService {
    token      : string     = '';
    parametros : any        = [];
  
    constructor(
                private rest    : RestService,
                private userSer : UsersService,
                private store   : Store<AppState>
    ) { 

      this.token = this.userSer.getToken();
     }
  
     getOpciones(): Observable<any> {
      
      
         return this.rest.get('trabOpciones', this.token, this.parametros).pipe(
          map(
            (data: any) => data.data
            
        ) 
      );
    }
  
      insertOpciones(opciones: any): Observable<any> {
     
      return this.rest.post('insOpciones', this.token, opciones).pipe(
        map((data: any) => data)
      );
    }
  
    updateOpciones(opciones: any): Observable<any> {
   
      return this.rest.post('updOpciones', this.token, opciones).pipe(
        map((data: any) => data)
      );  
    }
  
    deleteOpciones(opciones: any): Observable<any> {
      return this.rest.post('delOpciones', this.token, opciones).pipe(
        map((data: any) => data)
      );  
    }
  }
