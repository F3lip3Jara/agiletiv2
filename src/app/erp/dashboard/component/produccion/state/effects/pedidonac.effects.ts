import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, mergeMap } from 'rxjs/operators';
import { PedidonacServices } from '../service/pedidonac.service';
import * as PedidonacActions from '../actions/pedidonac.actions';
import { getMensajesSuccess } from '../../../state/actions/mensajes.actions';
import { createPedidonacSuccess, recepcionarPedidoSuccess, updatePedidonacSuccess } from '../actions/pedidonac.actions';

@Injectable()
export class PedidonacEffects {
    constructor(
        private actions: Actions,
        private pedidonacService: PedidonacServices
    ) {}

    getPedidonac = createEffect(() => this.actions.pipe(
        ofType(PedidonacActions.getPedidonacRequest),
        switchMap(() => this.pedidonacService.getPedidonac()
            .pipe(
                map(pedidonac => PedidonacActions.getPedidonacSuccess({ pedidonac : pedidonac.data })),
                catchError(error => of(PedidonacActions.pedidonacError({ error: error.message })))
            ))
    ));

    createPedidonac = createEffect(() => this.actions.pipe(
        ofType(PedidonacActions.createPedidonacRequest),
        switchMap((action) => this.pedidonacService.createPedidonac(action.pedidonac)
            .pipe(
                mergeMap(resp => [
                    getMensajesSuccess({ mensaje: resp }),                   
                    createPedidonacSuccess()
                  ]),
                  catchError(error => of(PedidonacActions.pedidonacError({ error: error.message })))    
            ))
    ));

    updatePedidonac = createEffect(() => this.actions.pipe(
        ofType(PedidonacActions.updatePedidonacRequest),
        switchMap((action) => this.pedidonacService.updatePedidonac(action.pedidonac)
            .pipe(
                mergeMap(resp => [
                    getMensajesSuccess({ mensaje: resp }),
                    updatePedidonacSuccess()
                ]),
                catchError(error => of(PedidonacActions.pedidonacError({ error: error.message })))
            ))
    ));

    getEmpresaPdfRequest = createEffect(() => this.actions.pipe(
        ofType(PedidonacActions.getEmpresaPdfRequest),
        switchMap(() => this.pedidonacService.getEmpresaPdf()
            .pipe(
                map(empresa => PedidonacActions.getEmpresaPdfSuccess({ empresa: empresa })),
            ))
    ));

    getPedidoProductosRequest = createEffect(() => this.actions.pipe(
        ofType(PedidonacActions.getPedidoProductosRequest),
        switchMap((pedido:any) => this.pedidonacService.getPedidoProductos(pedido)
            .pipe(
                map(productos => PedidonacActions.getPedidoProductosSuccess({ productos: productos })), 
                catchError(error => of(PedidonacActions.pedidonacError({ error: error.message })))
            ))
    ));

    recepcionarPedidoRequest = createEffect(() => this.actions.pipe(
        ofType(PedidonacActions.recepcionarPedidoRequest),
        switchMap((pedido:any) => this.pedidonacService.recepcionarPedido(pedido)
            .pipe(
                mergeMap(resp => [
                    getMensajesSuccess({ mensaje: resp }),
                    recepcionarPedidoSuccess()
                ]),
                catchError(error => of(PedidonacActions.pedidonacError({ error: error.message })))
            ))
    ));
}
