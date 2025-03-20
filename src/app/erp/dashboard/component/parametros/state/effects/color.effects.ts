import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { ColorServices } from '../service/color.service';
import * as ColorActions from '../actions/color.actions';

@Injectable()
export class ColorEffects {
    constructor(
        private actions: Actions,
        private colorService: ColorServices
    ) {}

    getColor = createEffect(() => this.actions.pipe(
        ofType(ColorActions.getColorRequest),
        switchMap(() => this.colorService.getColor()
            .pipe(
                map(color => ColorActions.getColorSuccess({ color })),
                catchError(error => of(ColorActions.colorError({ error: error.message })))
            ))
    ));
}
