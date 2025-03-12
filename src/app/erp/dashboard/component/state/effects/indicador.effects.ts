import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap } from 'rxjs/operators';
import { getIndicadorRequest , getIndicadorSuccess , indicadorError } from '../actions/indicador.actions';
import { IndicadorSerivices } from '../service/indicador.service';

@Injectable()
export class IndicadorEffects {

  constructor(private actions$: Actions , 
            private indicadorService: IndicadorSerivices
  ) {
    }

    getIndicador$ = createEffect(() => this.actions$.pipe(
        ofType(getIndicadorRequest),
        exhaustMap((action) => this.indicadorService.getIndicador().pipe(
            map(indicador => getIndicadorSuccess({ indicadores: indicador })),
            catchError(error => of(indicadorError({ error })))
        ))
    ));
 
}