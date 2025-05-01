import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, timer } from 'rxjs';
import { map, catchError, switchMap, mergeMap, delay, takeWhile, repeatWhen, tap } from 'rxjs/operators';
import { RegionServices } from '../service/region.service';
import { checkUploadStatusSuccess, checkUploadStatusRequest, getRegionesPaisRequest, getRegionesPaisSuccess, getRegionRequest, getRegionSuccess, regionError, uploadRegionRequest, uploadRegionSuccess } from '../actions/region.actions';
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
                mergeMap(resp => [                    
                    checkUploadStatusRequest({ jobId: resp })
                ]),
                catchError(error => of(regionError({ error: error.message })))    
            ))
    ));

  
    getRegionesPais = createEffect(() => this.actions.pipe(
        ofType(getRegionesPaisRequest),
        switchMap(({ pais }) => this.regionService.getRegionesPais(pais)
            .pipe(
                map(regiones => getRegionesPaisSuccess({ region: regiones })),
            ))
    ));

    checkUploadStatusRequest = createEffect(() => this.actions.pipe(
        ofType(checkUploadStatusRequest),
        switchMap(({ jobId }) => {
            return timer(3000, 3000).pipe( // Inicia inmediatamente y repite cada 3 segundos
                switchMap(() => this.regionService.checkUploadStatus(jobId)),
                takeWhile((response: any) => {
                    const estado = response.estado;
                    return estado === 'P' || estado === 'E'; // Continúa mientras esté pendiente o en proceso
                }, true), // true para incluir el último valor que no cumple la condición
                map(response => {
                    if (response.estado === 'C') {
                        return getMensajesSuccess({ 
                            mensaje: [{
                                error: '0',
                                mensaje: 'Carga de regiones completada exitosamente',
                                type: 'success'
                            }]
                        });
                    } else if (response.estado === 'F') {
                        return regionError({ 
                            error: response.error || 'Error en la carga de regiones' 
                        });
                    } else {
                        return getMensajesSuccess({ 
                            mensaje: [{
                                error: '0',
                                mensaje: `Progreso: ${response.progreso}/${response.total} regiones`,
                                type: 'info'
                            }]
                        });
                    }
                }),
                catchError(error => of(regionError({ error: error.message })))
            );
        })
    ));
}
