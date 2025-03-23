import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, mergeMap } from 'rxjs/operators';
import { TallaServices } from '../service/talla.service';
import { getTallaRequest, insTallaRequest, insTallaSuccess, tallaError, upTallaRequest, upTallaSuccess } from '../actions/talla.actions';
import { getTallaSuccess } from '../actions/talla.actions';
import { getMensajesSuccess } from '../../../state/actions/mensajes.actions';

@Injectable()
export class TallaEffects {
    constructor(
        private actions: Actions,
        private tallaService: TallaServices
    ) {}

    getTalla = createEffect(() => this.actions.pipe(
        ofType(getTallaRequest),
        switchMap(() => this.tallaService.getTalla()
            .pipe(
                map(talla => getTallaSuccess({ talla })),
                catchError(error => of(tallaError({ error: error.message })))
            ))
    ));

    insTalla = createEffect(() => this.actions.pipe(
        ofType(insTallaRequest),
        switchMap(({ talla }) => this.tallaService.createTalla(talla)
            .pipe(
                mergeMap(resp => [
                    getMensajesSuccess({ mensaje: resp }),                   
                    insTallaSuccess()
                ]),
                catchError(error => of(tallaError({ error: error.message })))    
            ))
    ));

    upTalla = createEffect(() => this.actions.pipe(
        ofType(upTallaRequest),
        switchMap(({ talla }) => this.tallaService.updateTalla(talla)
            .pipe(
                mergeMap(resp => [
                    getMensajesSuccess({ mensaje: resp }),                   
                    upTallaSuccess()
                ]),
                catchError(error => of(tallaError({ error: error.message })))    
            ))
    )); 
}
