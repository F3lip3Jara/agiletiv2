import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, mergeMap } from 'rxjs/operators';
import { ColorServices } from '../service/color.service';
import * as ColorActions from '../actions/color.actions';
import { getColorInfoSuccess, getColorInfoRequest } from '../../../seguridad/state/actions/acciones.actions';
import { colorError, createColorRequest, createColorSuccess, getColorSuccess, updateColorRequest, updateColorSuccess } from '../actions/color.actions';
import { getColorRequest } from '../actions/color.actions';
import { getMensajesSuccess } from '../../../state/actions/mensajes.actions';

@Injectable()
export class ColorEffects {
    constructor(
        private actions: Actions,
        private colorService: ColorServices
    ) {}

    getColor = createEffect(() => this.actions.pipe(
        ofType(getColorRequest),
        switchMap(() => this.colorService.getColor()
            .pipe(
                map(color => getColorSuccess({ color })),   
                catchError(error => of(colorError({ error: error.message })))
            ))
    ));

    getColorInfo = createEffect(() => this.actions.pipe(
        ofType(getColorInfoRequest),
        switchMap(({ colCod }) => this.colorService.getColorInfo(colCod)
            .pipe(
                map(colorInfo => getColorInfoSuccess({ colorInfo })),
                catchError(error => of(colorError({ error: error.message })))
            ))
    ));

    createColor = createEffect(() => this.actions.pipe(
        ofType(createColorRequest),
        switchMap(({ color }) => this.colorService.createColor(color)
            .pipe(
                mergeMap(resp => [
                    getMensajesSuccess({ mensaje: resp }),
                    createColorSuccess()
                ]),
                catchError(error => of(colorError({ error: error.message })))
            ))
      ));

    updateColor = createEffect(() => this.actions.pipe(
        ofType(updateColorRequest),
        switchMap(({ color }) => this.colorService.updateColor(color)
            .pipe(
                mergeMap(resp => [
                    getMensajesSuccess({ mensaje: resp }),
                    updateColorSuccess()
                ]),
                catchError(error => of(colorError({ error: error.message })))
            ))
    ));
}
