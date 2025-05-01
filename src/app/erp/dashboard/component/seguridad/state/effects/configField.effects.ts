import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { ConfigFieldServices } from '../service/configField.service';
import * as ConfigFieldActions from '../../actions/configField.actions';

@Injectable()
export class ConfigFieldEffects {
    constructor(
        private actions: Actions,
        private configFieldService: ConfigFieldServices
    ) {}

    getConfigField = createEffect(() => this.actions.pipe(
        ofType(ConfigFieldActions.getConfigFieldRequest),
        switchMap(() => this.configFieldService.getConfigField()
            .pipe(
                map(configField => ConfigFieldActions.getConfigFieldSuccess({ configField })),
                catchError(error => of(ConfigFieldActions.configFieldError({ error: error.message })))
            ))
    ));
}
