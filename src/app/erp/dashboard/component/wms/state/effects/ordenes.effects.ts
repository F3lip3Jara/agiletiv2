import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, pipe, timer } from 'rxjs';
import { map, catchError, switchMap, takeUntil, repeat, takeWhile, mergeMap } from 'rxjs/operators';
import { OrdenesServices } from '../service/ordenes.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { 
  generarListaRequest, 
  generarListaSuccess, 
  getOrdenEntradaDetalleRequest, 
  getOrdenEntradaDetalleSuccess, 
  getOrdenesRequest, 
  getOrdenesSuccess, 
  ordenesError,
  checkListaStatusRequest,
  checkListaStatusSuccess,
  listaCompletadaSuccess,
  liberarOrdenesRequest,
  liberarOrdenesSuccess
} from '../actions/ordenes.actions';
import { getMensajesSuccess } from '../../../state/actions/mensajes.actions';
import { Action } from '@ngrx/store';

@Injectable()
export class OrdenesEffects {
    constructor(
        private actions: Actions,
        private ordenesService: OrdenesServices,
        private store: Store<AppState>
    ) {}

    getOrdenes = createEffect(() => this.actions.pipe(
        ofType(getOrdenesRequest),
        switchMap(() => this.ordenesService.getOrdenes()
            .pipe(
                map(ordenes => getOrdenesSuccess({ ordenes : ordenes.data })),
                catchError(error => of(ordenesError({ error: error.message })))
            ))
    ));

    getOrdenEntradaDetalle = createEffect(() => this.actions.pipe(
        ofType(getOrdenEntradaDetalleRequest),
        switchMap(({ orden }) => this.ordenesService.getOrdenEntradaDetalle(orden)
            .pipe(
                map(orden => getOrdenEntradaDetalleSuccess({ ordenDetalle: orden })),
                catchError(error => of(ordenesError({ error: error.message })))
            ))
    ));

    generarLista = createEffect(() => this.actions.pipe(
        ofType(generarListaRequest),
        switchMap(({ ordenIds }) => this.ordenesService.generarLista(ordenIds)
            .pipe(
                map(response => {
                    if (response) {
                        return checkListaStatusRequest({ jobId: response.request_id });
                    }
                    return generarListaSuccess();
                }),
                catchError(error => of(ordenesError({ error: error.message })))
            ))
    ));

    checkListaStatus = createEffect(() => this.actions.pipe(
        ofType(checkListaStatusRequest),
        switchMap(({ jobId }) => 
            timer(0, 3000).pipe(
                switchMap(() => this.ordenesService.checkListaStatus(jobId)),
                map(response => {
                    if (response.status === 'completed') {
                        // Emitir mensaje de éxito

                        this.store.dispatch(getMensajesSuccess({ 
                            mensaje:[ {
                                mensaje: 'Lista completada. Haga clic para descargar  ordenes : ' + response.orden_ids + ' . <a href="'+response.file_url+'" target="_blank">Descargar</a>',
                                error: 0,
                                type: 'success'
                            }]
                        }));                        
                        // Retornar acción de completado
                        return listaCompletadaSuccess({ url: response.file_url });
                    }
                    return checkListaStatusSuccess({ status: response.status });
                }),
                takeWhile(action => 
                    action.type === '[Ordenes] Check Lista Status Success', 
                    true
                ),
                catchError(error => of(ordenesError({ error: error.message })))
            )
        )
    ));

    liberarOrdenes = createEffect(() => this.actions.pipe(
        ofType(liberarOrdenesRequest),
        switchMap(({ ordenIds }) => this.ordenesService.liberarOrdenes(ordenIds)
            .pipe(
                switchMap((resp) => of(liberarOrdenesSuccess(),getMensajesSuccess({mensaje:resp}) )),
                catchError(error => of(ordenesError({ error: error.message })))
            ))
    ));
}
