import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, mergeMap } from 'rxjs/operators';
import { TipospagosServices } from '../service/tipospagos.service';
import * as TipospagosActions from '../actions/tipospagos.actions';
import { getMensajesSuccess } from '../../../state/actions/mensajes.actions';

@Injectable()
export class TipospagosEffects {
    constructor(
        private actions: Actions,
        private tipospagosService: TipospagosServices
    ) {}

    getTipospagos = createEffect(() => this.actions.pipe(
        ofType(TipospagosActions.getTipospagosRequest),
        switchMap(() => this.tipospagosService.getTipospagos()
            .pipe(
                map(tipospagos => TipospagosActions.getTipospagosSuccess({ tipospagos : tipospagos })),
                catchError(error => of(TipospagosActions.tipospagosError({ error: error.message })))
            ))
    ));

    createTipospagos = createEffect(() => this.actions.pipe(
        ofType(TipospagosActions.createTipospagosRequest),
        switchMap(({ tipospagos }) => this.tipospagosService.createTipospagos(tipospagos)
            .pipe(
                mergeMap(resp => [
                    getMensajesSuccess({ mensaje: resp }),                   
                     TipospagosActions.createTipospagosSuccess()
                ]),
                catchError(error => of(TipospagosActions.tipospagosError({ error: error.message })))
            ))
    ));

    updateTipospagos = createEffect(() => this.actions.pipe(
        ofType(TipospagosActions.updateTipospagosRequest),
        switchMap(({ tipospagos }) => this.tipospagosService.updateTipospagos(tipospagos)
            .pipe(
                mergeMap(resp => [
                    getMensajesSuccess({ mensaje: resp }),      
                    TipospagosActions.updateTipospagosSuccess()
                ]),
                catchError(error => of(TipospagosActions.tipospagosError({ error: error.message })))
            ))
    ));
    
    
}
