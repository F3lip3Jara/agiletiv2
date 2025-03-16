import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, mergeMap } from 'rxjs/operators';
import { ModuloSerivices } from '../service/modulo.service';
import { moduloError, getOpcionesNoAsignadasModuloByIdRequest, getOpcionesNoAsignadasModuloByIdSuccess, getRolesNoAsignadasModuloByIdRequest, getRolesNoAsignadasModuloByIdSuccess, getModuloRequest, getModuloSuccess, createModuloRequest, createModuloSuccess, getModuloRolByIdSuccess, getModuloRolByIdRequest, getOpcionesModuloByIdSuccess, getOpcionesModuloByIdRequest, updateModuloSuccess, updateModuloRequest, deleteModuloRequest, deleteModuloSuccess } from '../actions/modulo.actions';
import { getMensajesSuccess } from '../../../state/actions/mensajes.actions';
@Injectable()
export class ModuloEffects {
    constructor(
        private actions: Actions,
        private moduloService: ModuloSerivices
    ) {}

    getModulo = createEffect(() => this.actions.pipe(
        ofType(getModuloRequest),
        switchMap(() => this.moduloService.getModulo()
            .pipe(
                map(modulo => getModuloSuccess({ modulo })),
                catchError(error => of(moduloError({ error: error.message })))
            ))
    ));

    getOpcionesNoAsignadasModuloById = createEffect(() => this.actions.pipe(
        ofType(getOpcionesNoAsignadasModuloByIdRequest),
        switchMap(({ id }) => this.moduloService.getOpcionesNoAsignadasModuloById(id)
            .pipe(
                map(opciones => getOpcionesNoAsignadasModuloByIdSuccess({ opciones })),
                catchError(error => of(moduloError({ error: error.message })))    
            ))
    ));

    getRolesNoAsignadasModuloById = createEffect(() => this.actions.pipe(
        ofType(getRolesNoAsignadasModuloByIdRequest),
        switchMap(({ id }) => this.moduloService.getRolesNoAsignadasModuloById(id)
            .pipe(  
                map(roles => getRolesNoAsignadasModuloByIdSuccess({ roles })),
                catchError(error => of(moduloError({ error: error.message })))
            ))
    ));

    getModuloRolById = createEffect(() => this.actions.pipe(
        ofType(getModuloRolByIdRequest),
        switchMap(({ id }) => this.moduloService.getModuloRolById(id)
            .pipe(
                map(roles => getModuloRolByIdSuccess({ roles })),
                catchError(error => of(moduloError({ error: error.message })))
            ))
    ));


    getOpcionesModuloById = createEffect(() => this.actions.pipe(
        ofType(getOpcionesModuloByIdRequest),
        switchMap(({ id }) => this.moduloService.getModuloOpcionesById(id)
            .pipe(
                map(opciones => getOpcionesModuloByIdSuccess({ opciones })),
                catchError(error => of(moduloError({ error: error.message })))
            ))
    ));


    createModulo = createEffect(() => this.actions.pipe(
        ofType(createModuloRequest),
        switchMap(({ modulo }) => 
          
            this.moduloService.createModulo(modulo)
            .pipe(
                mergeMap(resp => [
                    getMensajesSuccess({ mensaje: resp }),                   
                    createModuloSuccess()
                  ]),
                  catchError(error => of(moduloError({ error: error.message })))    
            ))
    ));

    updateModulo = createEffect(() => this.actions.pipe(
        ofType(updateModuloRequest),
        switchMap(({ modulo }) => this.moduloService.updateModulo(modulo)
            .pipe(
                mergeMap(resp => [
                    getMensajesSuccess({ mensaje: resp }),                   
                    updateModuloSuccess()
                  ]),
                  catchError(error => of(moduloError({ error: error.message })))   
            ))
    ));
    
    deleteModulo = createEffect(() => this.actions.pipe(
        ofType(deleteModuloRequest),
        switchMap(({ modulo }) => this.moduloService.deleteModulo(modulo)
            .pipe(
                mergeMap(resp => [
                    getMensajesSuccess({ mensaje: resp }),                   
                    deleteModuloSuccess()
                  ]),
                  catchError(error => of(moduloError({ error: error.message })))   
            ))
    ));
}
