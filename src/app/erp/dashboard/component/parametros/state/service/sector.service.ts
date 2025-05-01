
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RestService } from 'src/app/erp/dashboard/service/rest.service';
import { UsersService } from 'src/app/erp/service/users.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';


@Injectable({
  providedIn: 'root'
})
export class SectorServices {  
  token      : string     = '';
  parametros : any        = [];

  constructor(
              private rest    : RestService,
              private userSer : UsersService,
              private store   : Store<AppState>
  ) { 

      this.token = this.userSer.getToken();
   }

   getSector(almacen: any): Observable<any> {    
 
    let parametros = [{column: "almId", values: [almacen.almId]}];

      this.parametros = [{ key: 'filter', value: btoa(JSON.stringify(parametros)) }];

      return this.rest.get('trabSector', this.token, this.parametros).pipe(
        map((data: any) => data)
      );
  }

  createSector(sector: any): Observable<any> {   
    return this.rest.post('insSector', this.token, sector).pipe(
      map((data: any) => data)
    );
  }

  updateSector(sector: any): Observable<any> {
 
    return this.rest.post('updSector', this.token,sector).pipe(
      map((data: any) => data)
    );  
  }
/*
  deleteSector(sector: any): Observable<any> {

    return this.rest.post('delSector', this.token, sector).pipe(
      map((data: any) => data)
    );  
  }*/
}
