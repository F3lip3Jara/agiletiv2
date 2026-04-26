
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RestService } from 'src/app/erp/dashboard/service/rest.service';
import { UsersService } from 'src/app/erp/service/users.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';


@Injectable({
  providedIn: 'root'
})
export class GymSlotServices {  
  token      : string     = '';
  parametros : any        = [];

  constructor(
              private rest    : RestService,
              private userSer : UsersService,
              private store   : Store<AppState>
  ) {  }

  getGymSlot(branch_id?: number): Observable<any> {
    this.token = this.userSer.getToken();
    let params = this.parametros;
    if (branch_id) {
        params = [...this.parametros, { key: 'branch_id', value: branch_id }];
    }
    return this.rest.get('gym/slots', this.token, params).pipe(
      map((data: any) => data) 
    );
  }
}
