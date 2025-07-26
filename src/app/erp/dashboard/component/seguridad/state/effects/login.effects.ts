import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { LoginServices } from '../service/login.service';
import { getLogRequest, getLogSuccess, logError } from '../actions/log.actions';

@Injectable()
export class LoginEffects {
    constructor(
        private actions: Actions,
        private loginService: LoginServices
    ) {}

    getLogin = createEffect(() => this.actions.pipe(
        ofType(getLogRequest),
        switchMap(() => this.loginService.getLogin()
            .pipe(
                map((resp: any) => getLogSuccess({ log: resp })),
                catchError(err => of(logError({ error: 'Error al obtener el log' }))) // Usar of para emitir una acción
            ))
    ));
}
