import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { accionesError, accionesInsertRequest, accionesInsertSuccess, accionesUpdateRequest, accionesUpdateSuccess, getAccionesRequest, getAccionesSuccess } from '../actions/acciones.actions';
import { AccionesSerivices } from '../service/acciones.service';
import { getMensajesSuccess } from '../../../state/actions/mensajes.actions';

@Injectable()
export class AccionesEffects {
    constructor(
        private actions: Actions,
        private accionesService: AccionesSerivices
    ) {}

    getAcciones = createEffect(() => this.actions.pipe(
        ofType(getAccionesRequest),
        switchMap((action) => 
            this.accionesService.getAcciones(action.optId).pipe(
                map(acciones =>  getAccionesSuccess({acciones})),
                catchError(error => of(accionesError({ error: error.message })))
            ))
    ));

    insAcciones = createEffect(() => this.actions.pipe(
        ofType(accionesInsertRequest),
        switchMap((action) => 
            this.accionesService.createAcciones(action.acciones).pipe(
                map(resp =>                      
                    getMensajesSuccess({ mensaje: resp }) , accionesInsertSuccess() ),
                catchError(error => of(accionesError({ error: error.message })))
            ))
    ));

    upAcciones = createEffect(() => this.actions.pipe(
        ofType(accionesUpdateRequest),
        switchMap((action) => 
            this.accionesService.updateAcciones(action.acciones).pipe(
                map(resp =>   getMensajesSuccess({ mensaje: resp }) , accionesUpdateSuccess() ),
                catchError(error => of(accionesError({ error: error.message })))
            ))
    ));
}
