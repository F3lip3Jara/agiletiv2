import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, mergeMap } from 'rxjs/operators';
import { SubgrupoServices } from '../service/subgrupo.service';
import { createSubgrupoRequest, createSubgrupoSuccess, getSubgrupoRequest, getSubgrupoSuccess, subgrupoError, updateSubgrupoRequest, updateSubgrupoSuccess } from '../actions/subgrupo.actions';
import { getMensajesSuccess } from '../../../state/actions/mensajes.actions';

@Injectable()
export class SubgrupoEffects {
    constructor(
        private actions: Actions,
        private subgrupoService: SubgrupoServices
    ) {}

    getSubgrupo = createEffect(() => this.actions.pipe(
        ofType(getSubgrupoRequest),
        switchMap(() => this.subgrupoService.getSubgrupo()
            .pipe(
                map(subgrupo => getSubgrupoSuccess({ subGrupo: subgrupo })),
                catchError(error => of(subgrupoError({ error: error.message })))
            ))
    ));

    createSubgrupo = createEffect(() => this.actions.pipe(
        ofType(createSubgrupoRequest),
        switchMap(({ subgrupo }) => this.subgrupoService.createSubgrupo(subgrupo)
            .pipe(
                mergeMap(resp => [
                    getMensajesSuccess({ mensaje: resp }),
                    createSubgrupoSuccess()
                ]),
                catchError(error => of(subgrupoError({ error: error.message })))
            ))
    ));

    updateSubgrupo = createEffect(() => this.actions.pipe(
        ofType(updateSubgrupoRequest),
        switchMap(({ subgrupo }) => this.subgrupoService.updateSubgrupo(subgrupo)
            .pipe(
                mergeMap(resp => [getMensajesSuccess({ mensaje: resp }), updateSubgrupoSuccess()]),
                catchError(error => of(subgrupoError({ error: error.message })))    
            ))
    ));

}
