import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, mergeMap } from 'rxjs/operators';
import { SubModuloSerivices } from '../service/submodulo.service';
import { 
    createSubModuloRequest, 
    createSubModuloSuccess, 
    deleteSubModuloRequest, 
    deleteSubModuloSuccess, 
    getOpcionesAsignadasSubModuloByIdRequest,
    getOpcionesAsignadasSubModuloByIdSuccess, 
    getSubModuloRequest, 
    getSubModuloSuccess, 
    subModuloError,
    updateSubModuloRequest,
    updateSubModuloSuccess
} from '../actions/submodulo.actions';
import { getOpcionesNoAsignadasSubModuloByIdRequest, getOpcionesNoAsignadasSubModuloByIdSuccess } from '../actions/submodulo.actions';
import { getMensajesSuccess } from '../../../state/actions/mensajes.actions';
import { rolesError } from '../actions/roles.actions';

@Injectable()
export class SubModuloEffects {
    constructor(
        private actions: Actions,
        private subModuloService: SubModuloSerivices
    ) {}

    getSubModulo = createEffect(() => this.actions.pipe(
        ofType(getSubModuloRequest),
        switchMap((action: any) => this.subModuloService.getSubModulo(action.modulo)
            .pipe(
                map(subModulo => getSubModuloSuccess({ subModulo })),
                catchError(error => of( subModuloError({ error: error.message })))
            ))
    ));

    getOpcionesNoAsignadasSubModuloByIdRequest = createEffect(() => this.actions.pipe(
        ofType(getOpcionesNoAsignadasSubModuloByIdRequest),
        switchMap((action: any) => this.subModuloService.getOpcionesNoAsignadasSubModuloById(action.modulo)
            .pipe(
                mergeMap(resp => [
                   getOpcionesNoAsignadasSubModuloByIdSuccess({ opciones: resp })
                  ]),
                  catchError(error => of(rolesError({ error: error.message })))    
            ))  
    ));

    getOpcionesAsignadasSubModuloByIdRequest = createEffect(() => this.actions.pipe(
        ofType(getOpcionesAsignadasSubModuloByIdRequest),
        switchMap((action: any) => this.subModuloService.getOpcionesAsignadasSubModuloById(action.modulo, action.molsId)
            .pipe(
                map(opciones => getOpcionesAsignadasSubModuloByIdSuccess({ opciones })),
                catchError(error => of(subModuloError({ error: error.message })))
            ))
    ));

    createSubModuloRequest = createEffect(() => this.actions.pipe(
        ofType(createSubModuloRequest),
        switchMap((action: any) => this.subModuloService.createSubModulo(action.submodulo)
            .pipe(
                mergeMap(resp => [
                    getMensajesSuccess({ mensaje: resp }),                   
                    createSubModuloSuccess()
                  ]),
                  catchError(error => of(rolesError({ error: error.message })))    
            ))
    ));

    updateSubModulo = createEffect(() => this.actions.pipe(
        ofType(updateSubModuloRequest),
        switchMap((action: any) => this.subModuloService.updateSubModulo(action.submodulo)
            .pipe(
                mergeMap(resp => [
                    getMensajesSuccess({ mensaje: resp }),                   
                    updateSubModuloSuccess()
                ]),
                catchError(error => of(subModuloError({ error: error.message })))    
            ))
    ));

    deleteSubModulo = createEffect(() => this.actions.pipe(
        ofType(deleteSubModuloRequest),
        switchMap((action: any) => this.subModuloService.deleteSubModulo(action.submodulo)
            .pipe(
                mergeMap(resp => [
                    getMensajesSuccess({ mensaje: resp }),                   
                    deleteSubModuloSuccess()
                ]),
                catchError(error => of(subModuloError({ error: error.message })))    
            ))
    ));
}
