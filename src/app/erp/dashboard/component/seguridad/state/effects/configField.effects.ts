import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, mergeMap } from 'rxjs/operators';
import { ConfigFieldServices } from '../service/configField.service';
import { configFieldError, getConfigFieldSuccess, updateConfigFieldRequest, updateConfigFieldSuccess } from '../actions/configField.actions';
import { getConfigFieldRequest } from '../actions/configField.actions';
import { getMensajesSuccess } from '../../../state/actions/mensajes.actions';

@Injectable()
export class ConfigFieldEffects {
    constructor(
        private actions: Actions,
        private configFieldService: ConfigFieldServices
    ) {}

    getConfigField = createEffect(() => this.actions.pipe(
        ofType(getConfigFieldRequest),
        switchMap(() => this.configFieldService.getConfigField()
            .pipe(
                map(configField => getConfigFieldSuccess({ configField })),
                catchError(error => of(configFieldError({ error: error.message })))
            ))
    ));

    updateConfigField = createEffect(() => this.actions.pipe(
        ofType(updateConfigFieldRequest),
        switchMap((action : any) => 
            this.configFieldService.updateConfigFieldFromExcel(action).pipe(
                mergeMap(resp => [
                    getMensajesSuccess({ mensaje: resp }),
                    updateConfigFieldSuccess()
                ]),
                catchError(error => of(configFieldError({ error: error.message })))
            ))
        ));
  
}
