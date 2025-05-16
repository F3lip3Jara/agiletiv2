
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RestService } from 'src/app/erp/dashboard/service/rest.service';
import { UsersService } from 'src/app/erp/service/users.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';


@Injectable({
  providedIn: 'root'
})
export class StockCajaServices {  
  token      : string     = '';
  parametros : any        = [];

  constructor(
              private rest    : RestService,
              private userSer : UsersService,
              private store   : Store<AppState>
  ) {  }

   getStockCaja(): Observable<any> {
    this.token = this.userSer.getToken();
    
       return this.rest.get('trabSdStockIblpn', this.token, this.parametros).pipe(
        map(
          (data: any) => data
          
      ) 
    );
  }
/*
  createStockCaja(stockCaja: any): Observable<any> {
    let stockCaja = {
      stockCajaDes: stockCaja
    }
    return this.rest.post('insStockCaja', this.token, stockCaja).pipe(
      map((data: any) => data)
    );
  }

  updateStockCaja(stockCaja: any): Observable<any> {
 
    return this.rest.post('updStockCaja', this.token,stockCaja).pipe(
      map((data: any) => data)
    );  
  }

  deleteStockCaja(stockCaja: any): Observable<any> {

    return this.rest.post('delStockCaja', this.token, stockCaja).pipe(
      map((data: any) => data)
    );  
  }*/
}
