import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RestService } from 'src/app/erp/dashboard/service/rest.service';
import { UsersService } from 'src/app/erp/service/users.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';

@Injectable({
  providedIn: 'root'
})
export class OrdenesServices {  
  token      : string     = '';
  parametros : any        = [];

  constructor(
              private rest    : RestService,
              private userSer : UsersService,
              private store   : Store<AppState>
  ) { 
    this.token = this.userSer.getToken();
   }

   getOrdenes(): Observable<any> {
    return this.rest.get('trabSdOrden', this.token, this.parametros).pipe(
      map(
        (data: any) => data
      ) 
    );
  }

  getOrdenEntradaDetalle(orden: any): Observable<any> {
    let parametros = [{key: 'ordId', value: orden.ordId}];
    return this.rest.get('verSdOrden', this.token, parametros).pipe(
      map((data: any) => data)
    );
  }

  generarLista(ordenIds: number[]): Observable<any> {
    let parametros = {orden_ids : ordenIds};
    return this.rest.post('pdfOrdenes', this.token, parametros).pipe(
      map((data: any) => data)
    );
  }

  checkListaStatus(jobId: number): Observable<any> {
    let parametros = [{'key' : 'jobId', 'value' : jobId}];
    return this.rest.get('pdfOrdenStatus', this.token, parametros).pipe(
      map((data: any) => data)
    );
  }

  liberarOrdenes(ordenIds: number[]): Observable<any> {
    let parametros = {orden_ids : ordenIds};
    return this.rest.post('liberarOrdenes', this.token, parametros).pipe(
      map((data: any) => data)
    );
  }

  aplicarFiltros(filtros: any[]): Observable<any> {
    let parametros = [{key: 'filter', value: btoa(JSON.stringify(filtros))}];
   

    return this.rest.get('trabSdOrden', this.token, parametros).pipe(
      map((data: any) => data)
    );
  }

/*
  createOrdenes(ordenes: any): Observable<any> {
    let ordenes = {
      ordenesDes: ordenes
    }
    return this.rest.post('insOrdenes', this.token, ordenes).pipe(
      map((data: any) => data)
    );
  }

  updateOrdenes(ordenes: any): Observable<any> {
 
    return this.rest.post('updOrdenes', this.token,ordenes).pipe(
      map((data: any) => data)
    );  
  }

  deleteOrdenes(ordenes: any): Observable<any> {

    return this.rest.post('delOrdenes', this.token, ordenes).pipe(
      map((data: any) => data)
    );  
  }*/
}
