
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RestService } from 'src/app/erp/dashboard/service/rest.service';
import { UsersService } from 'src/app/erp/service/users.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';


@Injectable({
  providedIn: 'root'
})
export class GymServices {  
  token      : string     = '';
  parametros : any        = [];

  constructor(
              private rest    : RestService,
              private userSer : UsersService,
              private store   : Store<AppState>
  ) {  }

   getGym(): Observable<any> {
    this.token = this.userSer.getToken();
    
       return this.rest.get('trabGym', this.token, this.parametros).pipe(
        map(
          (data: any) => data
          
      ) 
    );
  }
/*
  createGym(gym: any): Observable<any> {
    let gym = {
      gymDes: gym
    }
    return this.rest.post('insGym', this.token, gym).pipe(
      map((data: any) => data)
    );
  }

  updateGym(gym: any): Observable<any> {
 
    return this.rest.post('updGym', this.token,gym).pipe(
      map((data: any) => data)
    );  
  }

  deleteGym(gym: any): Observable<any> {

    return this.rest.post('delGym', this.token, gym).pipe(
      map((data: any) => data)
    );  
  }*/
}
