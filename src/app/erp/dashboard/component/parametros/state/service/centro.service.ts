
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RestService } from 'src/app/erp/dashboard/service/rest.service';
import { UsersService } from 'src/app/erp/service/users.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';


@Injectable({
  providedIn: 'root'
})
export class CentroServices {  
  token      : string     = '';
  parametros : any        = [];

  constructor(
              private rest    : RestService,
              private userSer : UsersService,
              private store   : Store<AppState>
  ) { 

    
    this.token = this.userSer.getToken();
   }

   getCentro(): Observable<any> {
    
    
       return this.rest.get('trabCentro', this.token, this.parametros).pipe(
        map(
          (data: any) => data
          
      ) 
    );
  }

 /* createCentro(centro: any): Observable<any> {
    let centro = {
      centroDes: centro
    }
    return this.rest.post('insCentro', this.token, centro).pipe(
      map((data: any) => data)
    );
  }

  updateCentro(centro: any): Observable<any> {
 
    return this.rest.post('updCentro', this.token,centro).pipe(
      map((data: any) => data)
    );  
  }

  deleteCentro(centro: any): Observable<any> {

    return this.rest.post('delCentro', this.token, centro).pipe(
      map((data: any) => data)
    );  
  }*/
}
