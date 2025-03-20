import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { MotivoServices } from '../service/motivo.service';
import * as MotivoActions from '../actions/motivo.actions';

@Injectable()
export class MotivoEffects {
    constructor(
        private actions: Actions,
        private motivoService: MotivoServices
    ) {}

    getMotivo = createEffect(() => this.actions.pipe(
        ofType(MotivoActions.getMotivoRequest),
        switchMap(() => this.motivoService.getMotivo()
            .pipe(
                map(motivo => MotivoActions.getMotivoSuccess({ motivo })),
                catchError(error => of(MotivoActions.motivoError({ error: error.message })))
            ))
    ));
}
