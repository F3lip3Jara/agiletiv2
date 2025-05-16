
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RestService } from 'src/app/erp/dashboard/service/rest.service';
import { UsersService } from 'src/app/erp/service/users.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';


@Injectable({
  providedIn: 'root'
})
export class StockServices {  
  token      : string     = '';
  parametros : any        = [];

  constructor(
              private rest    : RestService,
              private userSer : UsersService,
              private store   : Store<AppState>
  ) {
    this.token = this.userSer.getToken();
    }

   getStock(): Observable<any> {
       return this.rest.get('trabSdStock', this.token, this.parametros).pipe(
        map(
          (data: any) => data
          
      ) 
    );
  }
/*
  createStock(stock: any): Observable<any> {
    let stock = {
      stockDes: stock
    }
    return this.rest.post('insStock', this.token, stock).pipe(
      map((data: any) => data)
    );
  }

  updateStock(stock: any): Observable<any> {
 
    return this.rest.post('updStock', this.token,stock).pipe(
      map((data: any) => data)
    );  
  }

  deleteStock(stock: any): Observable<any> {

    return this.rest.post('delStock', this.token, stock).pipe(
      map((data: any) => data)
    );  
  }*/
}
