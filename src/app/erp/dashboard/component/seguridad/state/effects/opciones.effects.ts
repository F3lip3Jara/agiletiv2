import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, exhaustMap } from 'rxjs/operators';
import { OpcionesService } from '../service/opciones.service';
import { getOpcionesRequest, getOpcionesSuccess, opcionesError, updateOpcionesRequest, insertOpcionesRequest, insertOpcionesSuccess, updateOpcionesSuccess } from '../actions/opciones.actions';
import { rolesError } from '../actions/roles.actions';
import { getMensajesSuccess } from '../../../state/actions/mensajes.actions';

@Injectable()
export class OpcionesEffects {
    constructor(
        private actions: Actions,
        private opcionesService: OpcionesService
    ) {}

    getOpciones = createEffect(() => this.actions.pipe(
        ofType(getOpcionesRequest),
        switchMap(() => this.opcionesService.getOpciones()
            .pipe(
                map(opciones => getOpcionesSuccess({ opciones })),
                catchError(error => of(opcionesError({ error: error.message })))
            ))
    ));

    updateOpciones = createEffect(() => this.actions.pipe(
        ofType(updateOpcionesRequest), 
    exhaustMap(({ opciones }) =>
        this.opcionesService.updateOpciones(opciones)
        .pipe(
            map((resp: any) =>
                 getMensajesSuccess({ mensaje: resp }) ,updateOpcionesSuccess()), 
                 catchError(err => of(opcionesError({ error: 'Error al obtener los roles' }))) // Usar of para emitir una acción
      )
    )
    ));

    insertOpciones = createEffect(() => this.actions.pipe(
        ofType(insertOpcionesRequest),
        switchMap(({ opciones }) => 
            this.opcionesService.insertOpciones(opciones)
            .pipe(
                map((resp:any) =>  getMensajesSuccess({ mensaje: resp }) ,insertOpcionesSuccess()),
                catchError(error => of(opcionesError({ error: error.message })))
            )
        )
    )); 
}
