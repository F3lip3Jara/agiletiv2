import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, mergeMap } from 'rxjs/operators';
import { UbicacionesServices } from '../service/ubicaciones.service';
import { createUbicacionesRequest, createUbicacionesSuccess, getUbicacionesRequest, getUbicacionesSuccess, ubicacionesError } from '../actions/ubicaciones.actions';
import { getMensajesSuccess } from '../../../state/actions/mensajes.actions';


@Injectable()
export class UbicacionesEffects {
    constructor(
        private actions: Actions,
        private ubicacionesService: UbicacionesServices
    ) {}

    getUbicaciones = createEffect(() => this.actions.pipe(
        ofType(getUbicacionesRequest),
        switchMap((action) => this.ubicacionesService.getUbicaciones(action.sectorId)
            .pipe(
                map(ubicaciones => getUbicacionesSuccess({ ubicaciones })),
                catchError(error => of(ubicacionesError({ error: error.message })))
            ))
    ));

    createUbicaciones = createEffect(() => this.actions.pipe(
        ofType(createUbicacionesRequest),
        switchMap((action) => this.ubicacionesService.createUbicaciones(action.datos)
            .pipe(  
                mergeMap(resp => [
                    getMensajesSuccess({ mensaje: resp }),
                    createUbicacionesSuccess()
                ]),
                catchError(error => of(ubicacionesError({ error: error.message })))
            ))
    ));
}
