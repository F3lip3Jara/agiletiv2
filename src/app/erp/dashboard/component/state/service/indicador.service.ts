import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RestService } from 'src/app/erp/dashboard/service/rest.service';
import { UsersService } from 'src/app/erp/service/users.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.state';


@Injectable({
  providedIn: 'root'
})
export class IndicadorSerivices {  
  token      : string     = '';
  parametros : any        = [];

  constructor(
              private rest    : RestService,
              private userSer : UsersService,
              private store   : Store<AppState>
  ) {  }

   getIndicador(): Observable<any> {
     this.token = this.userSer.getToken();
    
       return  this.rest.get('indicadores', this.token, this.parametros).pipe(
        map(
          (data: any) => data
        )       
    );
  }

}