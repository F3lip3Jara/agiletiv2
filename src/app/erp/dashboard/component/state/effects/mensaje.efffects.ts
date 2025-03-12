import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap } from 'rxjs/operators';
import { getMensajesSuccess, loadMensajeRequest } from '../actions/mensajes.actions';
import { Mensajes } from '../interface/mensajes.interface';

@Injectable()
export class MensajeEffects {

  constructor(private actions$: Actions , 
           
  ) {
    }

    $laodMensaje = createEffect(() => this.actions$.pipe(
        ofType(getMensajesSuccess),
        map((action) => {         
            const mensaje_ : Mensajes = {
                mensaje: action.mensaje[0].mensaje,
                error: action.mensaje[0].error,
                type: action.mensaje[0].type,
                read: false
            }           
            return loadMensajeRequest({ mensajes: mensaje_ })
        })
    ));
 
}