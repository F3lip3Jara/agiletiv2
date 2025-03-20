
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RestService } from 'src/app/erp/dashboard/service/rest.service';
import { UsersService } from 'src/app/erp/service/users.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';


@Injectable({
  providedIn: 'root'
})
export class CiudadSerivices {  
  token      : string     = '';
  parametros : any        = [];

  constructor(
              private rest    : RestService,
              private userSer : UsersService,
              private store   : Store<AppState>
  ) {  }

   getCiudad(): Observable<any> {
    this.token = this.userSer.getToken();
    
       return this.rest.get('trabCiudad', this.token, this.parametros).pipe(
        map(
          (data: any) => data
          
      ) 
    );
  }

 /* createCiudad(ciudad: any): Observable<any> {
    let ciudad = {
      ciudadDes: ciudad
    }
    return this.rest.post('insCiudad', this.token, ciudad).pipe(
      map((data: any) => data)
    );
  }

  updateCiudad(ciudad: any): Observable<any> {
 
    return this.rest.post('updCiudad', this.token,ciudad).pipe(
      map((data: any) => data)
    );  
  }

  deleteCiudad(ciudad: any): Observable<any> {

    return this.rest.post('delCiudad', this.token, ciudad).pipe(
      map((data: any) => data)
    );  
  }*/
}
