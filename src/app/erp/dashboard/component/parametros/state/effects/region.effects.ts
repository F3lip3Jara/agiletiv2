import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { RegionServices } from '../service/region.service';

import { getRegionRequest, getRegionSuccess, regionError, uploadRegionRequest, uploadRegionSuccess } from '../actions/region.actions';
import { getMensajesSuccess } from '../../../state/actions/mensajes.actions';

@Injectable()
export class RegionEffects {
    constructor(
        private actions: Actions,
        private regionService: RegionServices
    ) {}

    getRegion = createEffect(() => this.actions.pipe(
        ofType(getRegionRequest),
        switchMap(() => this.regionService.getRegion()
            .pipe(
                map(region => getRegionSuccess({ region : region.data })),
                catchError(error => of(regionError({ error: error.message })))
            ))
    ));

    uploadRegion = createEffect(() => this.actions.pipe(
        ofType(uploadRegionRequest),
        switchMap(({ pais }) => this.regionService.uploadRegion(pais)
            .pipe(
                map(region => uploadRegionSuccess() , getMensajesSuccess({mensaje:[
                    {
                        "error": "0",
                        "mensaje": "Actualización de región de manera correcta",
                        "type": "success"
                    }
                ]})), 
                catchError(error => of(regionError({ error: error.message })))
            ))

    ));
}
