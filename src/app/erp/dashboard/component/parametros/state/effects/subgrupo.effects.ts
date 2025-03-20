import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { SubgrupoServices } from '../service/subgrupo.service';
import { getSubgrupoRequest, getSubgrupoSuccess, subgrupoError } from '../actions/subgrupo.actions';

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
}
