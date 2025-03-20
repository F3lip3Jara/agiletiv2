import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { getCiudadRequest, getCiudadSuccess, ciudadError } from '../actions/ciudad.actions';
import { CiudadSerivices } from '../service/ciudad.service';

@Injectable()
export class CiudadEffects {
    constructor(
        private actions: Actions,
        private ciudadService: CiudadSerivices
    ) {}

    getCiudad = createEffect(() => this.actions.pipe(
        ofType(getCiudadRequest),
        switchMap(() => this.ciudadService.getCiudad()
            .pipe(
                map(ciudad => getCiudadSuccess({ ciudad: ciudad.data })),
                catchError(error => of(ciudadError({ error: error.message })))
            ))
    ));
}
