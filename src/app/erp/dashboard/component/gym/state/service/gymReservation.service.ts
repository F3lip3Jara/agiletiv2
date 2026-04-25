
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RestService } from 'src/app/erp/dashboard/service/rest.service';
import { UsersService } from 'src/app/erp/service/users.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';


@Injectable({
  providedIn: 'root'
})
export class GymReservationServices {  
  token      : string     = '';
  parametros : any        = [];

  constructor(
              private rest    : RestService,
              private userSer : UsersService,
              private store   : Store<AppState>
  ) {  }

  getGymReservation(): Observable<any> {
    this.token = this.userSer.getToken();
    return this.rest.get('gym/reservations', this.token, this.parametros).pipe(
      map((data: any) => data)
    );
  }

  createGymReservation(gym_slot_id: number): Observable<any> {
    this.token = this.userSer.getToken();
    return this.rest.post('gym/reservations', this.token, { gym_slot_id }).pipe(
      map((data: any) => data)
    );
  }

  deleteGymReservation(id: number): Observable<any> {
    this.token = this.userSer.getToken();
    // Suponiendo que rest.delete exista o se use get/post
    // Si restService de tu ERP usa post para delete, se adapta:
    return this.rest.get(`gym/reservations/${id}/cancel`, this.token, []).pipe(
      map((data: any) => data)
    );
  }
}
