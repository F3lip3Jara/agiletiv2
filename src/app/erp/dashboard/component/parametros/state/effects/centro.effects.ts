import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, mergeMap } from 'rxjs/operators';
import { CentroServices } from '../service/centro.service';
import { centroError, createCentroRequest, createCentroSuccess, getCentroSuccess, updateCentroRequest, updateCentroSuccess } from '../actions/centro.actions';
import { getCentroRequest } from '../actions/centro.actions';
import { getMensajesSuccess } from '../../../state/actions/mensajes.actions';
import { opcionesError } from '../../../seguridad/state/actions/opciones.actions';

@Injectable()
export class CentroEffects {
    constructor(
        private actions: Actions,
        private centroService: CentroServices
    ) {}

    getCentro = createEffect(() => this.actions.pipe(
        ofType(getCentroRequest),
        switchMap(() => this.centroService.getCentro()
            .pipe(
                map(centro => getCentroSuccess({ centro })),
                catchError(error => of(centroError({ error: error.message })))
            ))
    ));

    createCentro = createEffect(() => this.actions.pipe(
        ofType(createCentroRequest),
        switchMap(({ centro }) => this.centroService.createCentro(centro)
            .pipe(
                mergeMap(resp => [
                    getMensajesSuccess({ mensaje: resp }),                   
                    createCentroSuccess()
                ]),
                catchError(error => of(centroError({ error: error.message })))    
            ))
    ));

    updateCentro = createEffect(() => this.actions.pipe(
        ofType(updateCentroRequest),
        switchMap(({ centro }) => this.centroService.updateCentro(centro)
            .pipe(
                mergeMap(resp => [
                    getMensajesSuccess({ mensaje: resp }),
                    updateCentroSuccess()
                ]),
                catchError(error => of(centroError({ error: error.message })))
            ))
    ));
}
