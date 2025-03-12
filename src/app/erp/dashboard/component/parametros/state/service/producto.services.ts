import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Producto} from '../interface/producto.interface';
import { RestService } from 'src/app/erp/dashboard/service/rest.service';
import { UsersService } from 'src/app/erp/service/users.service';

import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';


@Injectable({
  providedIn: 'root'
})
export class ProductoService {  
  token      : string     = '';
  parametros : any        = [];

  constructor(
              private rest    : RestService,
              private userSer : UsersService,
              private store: Store<AppState>
  ) { 
      this.token = this.userSer.getToken();

   }

   getProductos(): Observable<any> {
     return this.rest.get('trabProducto', this.token, this.parametros).pipe(
        map((data: any) => data.data) // Asegúrate de importar 'map' de 'rxjs/operators'
    );
  }

  createTodo(producto: Producto): Observable<Object> {
    this.parametros = producto;
    return this.rest.post('insProducto', this.token, this.parametros).pipe(
      map((data: any) => data.data) // Asegúrate de importar 'map' de 'rxjs/operators'
  );
  }

 /* deleteTodo(id: string): Observable<Object> {
    //return this.http.delete(`${this.API}/delete/${id}`)
  }

  updateTodo(id: string, todo: UpdateTodo): Observable<Object> {

    //return this.http.put(`${this.API}/update/${id}`, todo)
  }

  updateStatus(nuevoEstado: number, id: string): Observable<Object> {
    //return this.http.put(`${this.API}/update-status/${id}`, { statusId: nuevoEstado })
  }*/

}