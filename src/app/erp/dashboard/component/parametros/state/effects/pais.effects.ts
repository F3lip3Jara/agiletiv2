import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { PaisServices } from '../service/pais.service';
import * as PaisActions from '../actions/pais.actions';

@Injectable()
export class PaisEffects {
    constructor(
        private actions: Actions,
        private paisService: PaisServices
    ) {}

    getPais = createEffect(() => this.actions.pipe(
        ofType(PaisActions.getPaisRequest),
        switchMap(() => this.paisService.getPais()
            .pipe(
                map(pais => PaisActions.getPaisSuccess({ pais : pais.data })),
                catchError(error => of(PaisActions.paisError({ error: error.message })))
            ))
    ));
}
