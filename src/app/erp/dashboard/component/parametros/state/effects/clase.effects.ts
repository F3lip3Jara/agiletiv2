import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, mergeMap } from 'rxjs/operators';
import { ClaseServices } from '../service/clase.service';
import { createClaseSuccess, updateClaseSuccess } from '../actions/clase.actions';
import { createClaseRequest } from '../actions/clase.actions';
import { claseError, getClaseSuccess, updateClaseRequest } from '../actions/clase.actions';
import { getClaseRequest } from '../actions/clase.actions';
import { getMensajesSuccess } from '../../../state/actions/mensajes.actions';


@Injectable()
export class ClaseEffects {
    constructor(
        private actions: Actions,
        private claseService: ClaseServices
    ) {}

    getClase = createEffect(() => this.actions.pipe(
        ofType(getClaseRequest),
        switchMap(() => this.claseService.getClase()
            .pipe(
                map(clase => getClaseSuccess({ clase })),
                catchError(error => of(claseError({ error: error.message })))
            ))
    ));

    createClase = createEffect(() => this.actions.pipe(
        ofType(createClaseRequest),
        switchMap((action) => this.claseService.createClase(action.clase)
            .pipe(
                mergeMap(resp => [
                    getMensajesSuccess({ mensaje: resp }),
                    createClaseSuccess()
                ]),
                catchError(error => of(claseError({ error: error.message })))
            ))  
    ));
    
    updateClaseRequest = createEffect(() => this.actions.pipe(
        ofType(updateClaseRequest),
        switchMap((action) => this.claseService.updateClase(action.clase)
            .pipe(
                mergeMap(resp => [
                    getMensajesSuccess({ mensaje: resp }),
                    updateClaseSuccess()
                ]),
                catchError(error => of(claseError({ error: error.message })))
            ))
    ));
}
