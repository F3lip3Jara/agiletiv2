
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

  getGymSlot(): Observable<any> {
    this.token = this.userSer.getToken();
    
    // Asumiendo que rest.get() hace GET a /api/gym/slots
    return this.rest.get('gym/slots', this.token, this.parametros).pipe(
      map((data: any) => data) 
    );
  }
}
