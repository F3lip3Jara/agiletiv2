import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, mergeMap } from 'rxjs/operators';
import { GrupoServices } from '../service/grupo.service';
import { getMensajesSuccess } from '../../../state/actions/mensajes.actions';
import { createGrupoRequest, createGrupoSuccess, getGrupoRequest, getGrupoSuccess, grupoError, updateGrupoRequest, updateGrupoSuccess } from '../actions/grupo.actions';

@Injectable()
export class GrupoEffects {
    constructor(
        private actions: Actions,
        private grupoService: GrupoServices
    ) {}

    getGrupo = createEffect(() => this.actions.pipe(
        ofType(getGrupoRequest),
        switchMap(() => this.grupoService.getGrupo()
            .pipe(
                map(grupo => getGrupoSuccess({ grupo })),
                catchError(error => of(grupoError({ error: error.message })))
            ))
    ));

    createGrupo = createEffect(() => this.actions.pipe(
        ofType(createGrupoRequest),
        switchMap(({ grupo }) => this.grupoService.createGrupo(grupo)
            .pipe(                
                    mergeMap(resp => [
                        getMensajesSuccess({ mensaje: resp }),
                        createGrupoSuccess()
                    ]),
                    catchError(error => of(grupoError({ error: error.message })))
             
            ))
    ));

    updateGrupo = createEffect(() => this.actions.pipe(
        ofType(updateGrupoRequest),
        switchMap(({ grupo }) => this.grupoService.updateGrupo(grupo)
            .pipe(
                mergeMap(resp => [
                    getMensajesSuccess({ mensaje: resp }),
                    updateGrupoSuccess()
                ]),
                catchError(error => of(grupoError({ error: error.message })))
            ))
    ));
    
}
