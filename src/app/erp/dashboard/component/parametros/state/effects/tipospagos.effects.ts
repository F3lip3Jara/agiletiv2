import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { TipospagosServices } from '../service/tipospagos.service';
import * as TipospagosActions from '../actions/tipospagos.actions';

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
}
