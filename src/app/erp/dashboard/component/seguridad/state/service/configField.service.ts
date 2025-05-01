
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RestService } from 'src/app/erp/dashboard/service/rest.service';
import { UsersService } from 'src/app/erp/service/users.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';


@Injectable({
  providedIn: 'root'
})
export class ConfigFieldServices {  
  token      : string     = '';
  parametros : any        = [];

  constructor(
              private rest    : RestService,
              private userSer : UsersService,
              private store   : Store<AppState>
  ) {  }

   getConfigField(): Observable<any> {
    this.token = this.userSer.getToken();
    
       return this.rest.get('trabConfigField', this.token, this.parametros).pipe(
        map(
          (data: any) => data
          
      ) 
    );
  }
/*
  createConfigField(configField: any): Observable<any> {
    let configField = {
      configFieldDes: configField
    }
    return this.rest.post('insConfigField', this.token, configField).pipe(
      map((data: any) => data)
    );
  }

  updateConfigField(configField: any): Observable<any> {
 
    return this.rest.post('updConfigField', this.token,configField).pipe(
      map((data: any) => data)
    );  
  }

  deleteConfigField(configField: any): Observable<any> {

    return this.rest.post('delConfigField', this.token, configField).pipe(
      map((data: any) => data)
    );  
  }*/
}
