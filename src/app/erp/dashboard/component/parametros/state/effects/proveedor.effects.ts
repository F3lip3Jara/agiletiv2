import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, mergeMap } from 'rxjs/operators';
import { ProveedorServices } from '../service/proveedor.service';
import * as ProveedorActions from '../actions/proveedor.actions';
import { getMensajesSuccess } from '../../../state/actions/mensajes.actions';

@Injectable()
export class ProveedorEffects {
    constructor(
        private actions: Actions,
        private proveedorService: ProveedorServices
    ) {}

    getProveedor = createEffect(() => this.actions.pipe(
        ofType(ProveedorActions.getProveedorRequest),
        switchMap(() => this.proveedorService.getProveedor()
            .pipe(
                map(proveedor => ProveedorActions.getProveedorSuccess({ proveedor : proveedor.data, colums: proveedor.columns })),
                catchError(error => of(ProveedorActions.proveedorError({ error: error.message })))
            ))
    ));

    validaProveedor = createEffect(() => this.actions.pipe(
        ofType(ProveedorActions.validaProveedorRequest),
        switchMap(({ proveedor }) => this.proveedorService.validaProveedor(proveedor)
            .pipe(
                map(proveedor => ProveedorActions.validaProveedorSuccess({ proveedor })),
            ))
    ));

    insProveedor = createEffect(() => this.actions.pipe(
        ofType(ProveedorActions.insProveedorRequest),
        switchMap(({ proveedor }) => this.proveedorService.createProveedor(proveedor)
            .pipe(
                mergeMap(resp => [
                    getMensajesSuccess({ mensaje: resp }),                   
                    ProveedorActions.insProveedorSuccess()
                  ]),
                  catchError(error => of(ProveedorActions.proveedorError({ error: error.message })))    
            ))
    ));

    updateProveedor = createEffect(() => this.actions.pipe(
        ofType(ProveedorActions.updateProveedorRequest),
        switchMap(({ proveedor }) => this.proveedorService.updateProveedor(proveedor)
            .pipe(
               mergeMap(resp => [
                getMensajesSuccess({ mensaje: resp }),                   
                ProveedorActions.updateProveedorSuccess()
              ]),
              catchError(error => of(ProveedorActions.proveedorError({ error: error.message })))    
            ))
    ));

    aplicarFiltros = createEffect(() => this.actions.pipe(
        ofType(ProveedorActions.aplicarFiltrosRequest),
        switchMap(({ filtros }) => this.proveedorService.aplicarFiltros(filtros)
            .pipe(
                map(proveedor => ProveedorActions.aplicarFiltrosSuccess({ proveedor : proveedor.data, colums: proveedor.columns })),
                catchError(error => of(ProveedorActions.proveedorError({ error: error.message })))
            ))
    ));
}
