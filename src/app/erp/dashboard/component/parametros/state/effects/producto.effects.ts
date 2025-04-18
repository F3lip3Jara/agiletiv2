import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap, switchMap } from 'rxjs/operators';
import { ProductoService } from '../service/producto.services'; // Ajusta la ruta
import {  getProductoSuccess, productoError, getProductosRequest, createProductoRequest, createProductoSuccess, updateProductoSuccess, updateProductoRequest } from '../actions/producto.actions';
import { getMensajesSuccess } from '../../../state/actions/mensajes.actions';

@Injectable()
export class ProductoEffects {

  constructor(private actions$: Actions, private productoService: ProductoService) {}

  loadProductos$ = createEffect(() => this.actions$.pipe(
    ofType(getProductosRequest), // Se escucha la acción getTodosRequest y esto desencadena el flujo
    //exhaustMap evita las peticiones duplicadas
    exhaustMap(() => 
        this.productoService.getProductos() // Se obtienen los TODOS
            .pipe( // se tratan los datos obtenidos
                map((resp: any) => {
                    // Se retorna la acción getTodosSuccess con los TODOS obtenidos
                    return getProductoSuccess({ productos: resp })
                }),
                catchError((err) => {                   
                    return [productoError({ error: 'Error al obtener los TODOS' })]
                })
            )
        )
    ))

    createProducto$ = createEffect(() => this.actions$.pipe(
        ofType(createProductoRequest),
        exhaustMap((action) => this.productoService.createProducto(action.producto)
            .pipe(
                mergeMap(resp => [
                    getMensajesSuccess({ mensaje: resp }),                   
                    createProductoSuccess()
                  ]),
                  catchError(error => of(productoError({ error: error.message })))    
            )
        )
    ))

    updateProducto$ = createEffect(() => this.actions$.pipe(
        ofType(updateProductoRequest),
        exhaustMap((action) => this.productoService.updateProducto(action.producto)
                .pipe(
                mergeMap((resp:any) => [
                    getMensajesSuccess({ mensaje: resp }),                   
                    updateProductoSuccess()
                ]),
                catchError(error => of(productoError({ error: error.message })))    
            )
        )
    ))
}