import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, mergeMap } from 'rxjs/operators';
import { SectorServices } from '../service/sector.service';
import { createSectorRequest, createSectorSuccess, updateSectorRequest, updateSectorSuccess } from '../actions/sector.actions';
import { getSectorSuccess, sectorError } from '../actions/sector.actions';
import { getSectorRequest } from '../actions/sector.actions';
import { getMensajesSuccess } from '../../../state/actions/mensajes.actions';

@Injectable()
export class SectorEffects {
    constructor(
        private actions: Actions,
        private sectorService: SectorServices
    ) {}

    getSector = createEffect(() => this.actions.pipe(
        ofType(getSectorRequest),
        switchMap(({almacen}) => this.sectorService.getSector(almacen)
            .pipe(
                map(sector => getSectorSuccess({ sector })),
                catchError(error => of(sectorError({ error: error.message })))
            ))
    ));

    createSector = createEffect(() => this.actions.pipe(
        ofType(createSectorRequest),
        switchMap(({ sector }) => this.sectorService.createSector(sector)
            .pipe(
                mergeMap(resp => [
                    getMensajesSuccess({ mensaje: resp }),
                    createSectorSuccess()
                ]),
                catchError(error => of(sectorError({ error: error.message })))
            ))
    ));


    updateSector = createEffect(() => this.actions.pipe(
        ofType(updateSectorRequest),
        switchMap(({ sector }) => this.sectorService.updateSector(sector)
            .pipe(
                mergeMap(resp => [
                    getMensajesSuccess({ mensaje: resp }),
                    updateSectorSuccess()
                ]),
                catchError(error => of(sectorError({ error: error.message })))
            ))
    ));
}
