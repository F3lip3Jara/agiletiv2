import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, mergeMap } from 'rxjs/operators';
import { EmpresaSerivices } from '../service/empresa.service';
import { createEmpresaSuccess, getEmpresaSuccess, logoEmpresaRequest, logoEmpresaSuccess, updateEmpresaRequest, updateEmpresaSuccess, getOpcionesAsignadasRequest, getOpcionesAsignadasSuccess, getOpcionesNoAsignadasRequest, getOpcionesNoAsignadasSuccess, createOpcionAsignadaRequest, createOpcionAsignadaSuccess } from '../actions/empresa.actions';
import { createEmpresaRequest } from '../actions/empresa.actions';
import { getEmpresaRequest } from '../actions/empresa.actions';
import { empresaError } from '../actions/empresa.actions';
import { getMensajesSuccess } from '../../../state/actions/mensajes.actions';

@Injectable()
export class EmpresaEffects {
    constructor(
        private actions: Actions,
        private empresaService: EmpresaSerivices
    ) {}

    getEmpresa = createEffect(() => this.actions.pipe(
        ofType(getEmpresaRequest),
        switchMap(() => this.empresaService.getEmpresa()
            .pipe(
                map(empresa => getEmpresaSuccess({ empresa })),
                catchError(error => of(empresaError({ error: error.message })))
            ))
    ));

    createEmpresa = createEffect(() => this.actions.pipe(
        ofType(createEmpresaRequest),
        switchMap(({ empresa }) => this.empresaService.createEmpresa(empresa) .pipe(
            mergeMap(resp => [
                getMensajesSuccess({ mensaje: resp }),  
                createEmpresaSuccess()
            ]),
            catchError(error => of(empresaError({ error: error.message })))
            ))
    ));
    
    updateEmpresa = createEffect(() => this.actions.pipe(
        ofType(updateEmpresaRequest),
        switchMap((empresa) => 
                this.empresaService.updateEmpresa(empresa).pipe(
                    mergeMap(resp => [
                        getMensajesSuccess({ mensaje: resp }),
                         updateEmpresaSuccess()
                    ]),
                    catchError(error => of(empresaError({ error: error.message })))
                ))
    ));

    logoEmpresa = createEffect(() => this.actions.pipe(
        ofType(logoEmpresaRequest),
        switchMap(({ id }) => this.empresaService.logoEmpresa(id)
            .pipe(map(resp => logoEmpresaSuccess({ logo: resp })))
    )));

    getOpcionesAsignadas = createEffect(() => this.actions.pipe(
        ofType(getOpcionesAsignadasRequest),
        switchMap(({ id }) => 
            this.empresaService.getOpcionesAsignadas(id)
            .pipe(map(resp => getOpcionesAsignadasSuccess({ opciones: resp })))
        ))  
    );

    getOpcionesNoAsignadas = createEffect(() => this.actions.pipe(
        ofType(getOpcionesNoAsignadasRequest),
        switchMap(({ id }) => this.empresaService.getOpcionesNoAsignadas(id)
            .pipe(map(resp => getOpcionesNoAsignadasSuccess({ opciones: resp })))
        ))
    );

    createOpcionAsignada = createEffect(() => this.actions.pipe(
        ofType(createOpcionAsignadaRequest),
        switchMap((action) => this.empresaService.createOpcionAsignada(action.empId, action.asig).pipe(
            mergeMap(resp => [
                getMensajesSuccess({ mensaje: resp }),
                createOpcionAsignadaSuccess()
            ]),
            catchError(error => of(empresaError({ error: error.message })))
        ))
    ));
}
