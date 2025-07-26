import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { LogServices } from '../service/log.service';
import * as LogActions from '../actions/log.actions';

@Injectable()
export class LogEffects {
    constructor(
        private actions: Actions,
        private logService: LogServices
    ) {}

    getLog = createEffect(() => this.actions.pipe(
        ofType(LogActions.getLogRequest),
        switchMap(() => this.logService.getLog()
            .pipe(
                map(log => LogActions.getLogSuccess({ log })),
                catchError(error => of(LogActions.logError({ error: error.message })))
            ))
    ));
}
