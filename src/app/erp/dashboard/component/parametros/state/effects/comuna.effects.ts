import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { ComunaServices } from '../service/comuna.service';
import * as ComunaActions from '../actions/comuna.actions';

@Injectable()
export class ComunaEffects {
    constructor(
        private actions: Actions,
        private comunaService: ComunaServices
    ) {}

    getComuna = createEffect(() => this.actions.pipe(
        ofType(ComunaActions.getComunaRequest),
        switchMap(() => this.comunaService.getComuna()
            .pipe(
                map(comuna => ComunaActions.getComunaSuccess({ comuna: comuna.data })),
                catchError(error => of(ComunaActions.comunaError({ error: error.message })))
            ))
    ));
}
