import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { CentroServices } from '../service/centro.service';
import { centroError, getCentroSuccess } from '../actions/centro.actions';
import { getCentroRequest } from '../actions/centro.actions';

@Injectable()
export class CentroEffects {
    constructor(
        private actions: Actions,
        private centroService: CentroServices
    ) {}

    getCentro = createEffect(() => this.actions.pipe(
        ofType(getCentroRequest),
        switchMap(() => this.centroService.getCentro()
            .pipe(
                map(centro => getCentroSuccess({ centro })),
                catchError(error => of(centroError({ error: error.message })))
            ))
    ));
}
