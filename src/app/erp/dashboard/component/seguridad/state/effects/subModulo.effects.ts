import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { SubModuloService } from '../service/subModulo.service';
import * as SubModuloActions from '../actions/subModulo.actions';

@Injectable()
export class SubModuloEffects {
    constructor(
        private actions: Actions,
        private subModuloService: SubModuloService
    ) {}

    getSubModulo = createEffect(() => this.actions.pipe(
        ofType(SubModuloActions.getSubModuloRequest),
        switchMap(() => this.subModuloService.getSubModulo()
            .pipe(
                map(subModulo => SubModuloActions.getSubModuloSuccess({ subModulo })),
                catchError(error => of(SubModuloActions.subModuloError({ error: error.message })))
            ))
    ));
}
