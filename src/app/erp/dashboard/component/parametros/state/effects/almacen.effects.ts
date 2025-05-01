import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, mergeMap } from 'rxjs/operators';
import { AlmacenServices } from '../service/almacen.service';
import * as AlmacenActions from '../actions/almacen.actions';
import { getMensajesSuccess } from '../../../state/actions/mensajes.actions';

@Injectable()
export class AlmacenEffects {
    constructor(
        private actions: Actions,
        private almacenService: AlmacenServices
    ) {}

    getAlmacen = createEffect(() => this.actions.pipe(
        ofType(AlmacenActions.getAlmacenRequest),
        switchMap((action) => this.almacenService.getAlmacen(action.centro)
            .pipe(
                map(almacen => AlmacenActions.getAlmacenSuccess({ almacen })),
                catchError(error => of(AlmacenActions.almacenError({ error: error.message })))
            ))
    ));

    createAlmacen = createEffect(() => this.actions.pipe(
        ofType(AlmacenActions.createAlmacenRequest),
        switchMap((action) => this.almacenService.createAlmacen(action.almacen)
            .pipe(
                mergeMap(resp => [
                    getMensajesSuccess({ mensaje: resp }),                   
                    AlmacenActions.createAlmacenSuccess()
                  ]),
                  catchError(error => of(AlmacenActions.almacenError({ error: error.message })))    
            ))
    ));

    updateAlmacen = createEffect(() => this.actions.pipe(
        ofType(AlmacenActions.updateAlmacenRequest),
        switchMap((action) => this.almacenService.updateAlmacen(action.almacen)
            .pipe(
                mergeMap(resp => [getMensajesSuccess({ mensaje: resp }), AlmacenActions.updateAlmacenSuccess()])
            ))
    ));
}
