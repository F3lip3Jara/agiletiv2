import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, exhaustMap } from 'rxjs/operators';
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
                map(comuna => ComunaActions.getComunaSuccess({ comuna: comuna.data , colums: comuna.columns })),
                catchError(error => of(ComunaActions.comunaError({ error: error.message })))
            ))
    ));

    getComunaByCiudad = createEffect(() => this.actions.pipe(
        ofType(ComunaActions.getComunaByCiudadRequest),
        switchMap(({ ciudad  , region , pais}) => this.comunaService.getComunaByCiudad(ciudad, region, pais)
            .pipe(
                map(comuna => ComunaActions.getComunaByCiudadSuccess({ comuna: comuna })),
            ))
    )); 

    aplicarFiltros$ = createEffect(() => this.actions.pipe(
        ofType(ComunaActions.aplicarFiltrosRequest),
        exhaustMap((action) => this.comunaService.aplicarFiltros(action.filtros)
            .pipe(
                map((resp: any) => ComunaActions.aplicarFiltrosSuccess({ comuna: resp.data, colums: resp.columns }))
            )
        )
    ));
}
