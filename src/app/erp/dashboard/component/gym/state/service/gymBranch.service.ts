
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RestService } from 'src/app/erp/dashboard/service/rest.service';
import { UsersService } from 'src/app/erp/service/users.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';


@Injectable({
  providedIn: 'root'
})
export class GymBranchServices {  
  token      : string     = '';
  parametros : any        = [];

  constructor(
              private rest    : RestService,
              private userSer : UsersService,
              private store   : Store<AppState>
  ) {  }

   getGymBranch(): Observable<any> {
    this.token = this.userSer.getToken();
    
       return this.rest.get('trabGymBranch', this.token, this.parametros).pipe(
        map(
          (data: any) => data
          
      ) 
    );
  }
/*
  createGymBranch(gymBranch: any): Observable<any> {
    let gymBranch = {
      gymBranchDes: gymBranch
    }
    return this.rest.post('insGymBranch', this.token, gymBranch).pipe(
      map((data: any) => data)
    );
  }

  updateGymBranch(gymBranch: any): Observable<any> {
 
    return this.rest.post('updGymBranch', this.token,gymBranch).pipe(
      map((data: any) => data)
    );  
  }

  deleteGymBranch(gymBranch: any): Observable<any> {

    return this.rest.post('delGymBranch', this.token, gymBranch).pipe(
      map((data: any) => data)
    );  
  }*/
}
