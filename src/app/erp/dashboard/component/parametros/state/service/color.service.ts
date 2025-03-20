
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RestService } from 'src/app/erp/dashboard/service/rest.service';
import { UsersService } from 'src/app/erp/service/users.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';


@Injectable({
  providedIn: 'root'
})
export class ColorServices {  
  token      : string     = '';
  parametros : any        = [];

  constructor(
              private rest    : RestService,
              private userSer : UsersService,
              private store   : Store<AppState>
  ) {  }

   getColor(): Observable<any> {
    this.token = this.userSer.getToken();
    
       return this.rest.get('trabColor', this.token, this.parametros).pipe(
        map(
          (data: any) => data
          
      ) 
    );
  }
/*
  createColor(color: any): Observable<any> {
    let color = {
      colorDes: color
    }
    return this.rest.post('insColor', this.token, color).pipe(
      map((data: any) => data)
    );
  }

  updateColor(color: any): Observable<any> {
 
    return this.rest.post('updColor', this.token,color).pipe(
      map((data: any) => data)
    );  
  }

  deleteColor(color: any): Observable<any> {

    return this.rest.post('delColor', this.token, color).pipe(
      map((data: any) => data)
    );  
  }*/
}
