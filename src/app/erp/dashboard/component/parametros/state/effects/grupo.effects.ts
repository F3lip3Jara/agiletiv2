import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { GrupoServices } from '../service/grupo.service';
import * as GrupoActions from '../actions/grupo.actions';

@Injectable()
export class GrupoEffects {
    constructor(
        private actions: Actions,
        private grupoService: GrupoServices
    ) {}

    getGrupo = createEffect(() => this.actions.pipe(
        ofType(GrupoActions.getGrupoRequest),
        switchMap(() => this.grupoService.getGrupo()
            .pipe(
                map(grupo => GrupoActions.getGrupoSuccess({ grupo })),
                catchError(error => of(GrupoActions.grupoError({ error: error.message })))
            ))
    ));
}
