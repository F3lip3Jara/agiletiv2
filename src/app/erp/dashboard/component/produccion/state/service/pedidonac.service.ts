import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { RestService } from 'src/app/erp/dashboard/service/rest.service';
import { UsersService } from 'src/app/erp/service/users.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { PedidonacDet } from '../interface/pedidonac.interface';


@Injectable({
  providedIn: 'root'
})
export class PedidonacServices {  
  token      : string     = '';
  parametros : any        = [];

  constructor(
              private rest    : RestService,
              private userSer : UsersService,
              private store   : Store<AppState>
  ) {  

    this.token = this.userSer.getToken();
  }

   getPedidonac(): Observable<any> {   
       return this.rest.get('trabOrdenProduccion', this.token, this.parametros).pipe(
        map(
          (data: any) => data
          
      ) 
    );
  }

  createPedidonac(pedidonac: any): Observable<any> {
   
    return this.rest.post('insOrdProduccion', this.token, pedidonac).pipe(
      map((data: any) => data)
    );
  }

  updatePedidonac(pedidonac: any): Observable<any> { 
    return this.rest.post('updOrdProduccion', this.token, pedidonac).pipe(
      map((data: any) => data)
    );  
  }

  deletePedidonac(pedidonac: any): Observable<any> {

    return this.rest.post('delPedidonac', this.token, pedidonac).pipe(
      map((data: any) => data)
    );  
  }

  getEmpresaPdf(): Observable<any> {
    return this.rest.get('empresafilPdf', this.token, this.parametros).pipe(
      map((data: any) => data)
    );
  }

  getPedidoProductos(pedido: any): Observable<any> {
    let parametros = [{key: 'orpId', value: pedido.pedido.id}];
    return this.rest.get('OrdPDet', this.token, parametros).pipe(
      map((data: any) => data)
    );
  }

  recepcionarPedido(pedido: any): Observable<any> {

      return this.rest.post('insSdOrden', this.token, pedido).pipe(
        map((data: any) => data)
      );
   
  }
}
