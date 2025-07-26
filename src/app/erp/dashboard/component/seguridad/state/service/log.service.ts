
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RestService } from 'src/app/erp/dashboard/service/rest.service';
import { UsersService } from 'src/app/erp/service/users.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';


@Injectable({
  providedIn: 'root'
})
export class LogServices {  
  token      : string     = '';
  parametros : any        = [];

  constructor(
              private rest    : RestService,
              private userSer : UsersService,
              private store   : Store<AppState>
  ) {  }

   getLog(): Observable<any> {
    this.token = this.userSer.getToken();
    
       return this.rest.get('trabLogSys', this.token, this.parametros).pipe(
        map(
          (data: any) => data
          
      ) 
    );
  }
/*
  createLog(log: any): Observable<any> {
    let log = {
      logDes: log
    }
    return this.rest.post('insLog', this.token, log).pipe(
      map((data: any) => data)
    );
  }

  updateLog(log: any): Observable<any> {
 
    return this.rest.post('updLog', this.token,log).pipe(
      map((data: any) => data)
    );  
  }

  deleteLog(log: any): Observable<any> {

    return this.rest.post('delLog', this.token, log).pipe(
      map((data: any) => data)
    );  
  }*/
}
