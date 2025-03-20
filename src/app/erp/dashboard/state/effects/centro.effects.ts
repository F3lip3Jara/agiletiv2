import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { CentroService } from '../services/centro.service';
import * as CentroActions from '../actions/centro.actions';

@Injectable()
export class CentroEffects {
    constructor(
        private actions$: Actions,
        private centroService: CentroService
    ) { }

    getCentros$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CentroActions.getCentroRequest),
            mergeMap(() =>
                this.centroService.getCentros().pipe(
                    map(centros => CentroActions.getCentroSuccess({ centros })),
                    catchError(error => of(CentroActions.CentroError({ error })))
                )
            )
        )
    );

    createCentro$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CentroActions.createCentroRequest),
            mergeMap(({ centro }) =>
                this.centroService.createCentro(centro).pipe(
                    map(centro => CentroActions.createCentroSuccess({ centro })),
                    catchError(error => of(CentroActions.CentroError({ error })))
                )
            )
        )
    );

    updateCentro$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CentroActions.updateCentroRequest),
            mergeMap(({ centro }) =>
                this.centroService.updateCentro(centro).pipe(
                    map(centro => CentroActions.updateCentroSuccess({ centro })),
                    catchError(error => of(CentroActions.CentroError({ error })))
                )
            )
        )
    );

    deleteCentro$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CentroActions.deleteCentroRequest),
            mergeMap(({ centroId }) =>
                this.centroService.deleteCentro(centroId).pipe(
                    map(() => CentroActions.deleteCentroSuccess({ centroId })),
                    catchError(error => of(CentroActions.CentroError({ error })))
                )
            )
        )
    );
} 