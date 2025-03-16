import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap, switchMap } from 'rxjs/operators';
import { RolesSerivices } from '../service/roles.services';
import {  createRolesRequest, createRolesSuccess, deleteRolesRequest, deleteRolesSuccess, getRolesRequest, getRolesSuccess, rolesError, updateRolesRequest, updateRolesSuccess } from '../actions/roles.actions';
import { getMensajesSuccess } from '../../../state/actions/mensajes.actions';
import { Store } from '@ngrx/store';

@Injectable()
export class RolesEffects {

  constructor(private actions$: Actions, private rolesServices: RolesSerivices, private store: Store) {
    }

  loadRoles$ = createEffect(() => this.actions$.pipe(
    ofType(getRolesRequest), 
    exhaustMap(() =>
      this.rolesServices.getRoles().pipe(
        map((resp: any) => getRolesSuccess({ roles: resp })),
        catchError(err => of(rolesError({ error: 'Error al obtener los roles' }))) // Usar of para emitir una acción
      )
    )
  ));

  createRoles$ = createEffect(() => this.actions$.pipe(
    ofType(createRolesRequest), 
    exhaustMap(action =>
      this.rolesServices.createRoles(action.rolDes).pipe(
        mergeMap(resp => [
          getMensajesSuccess({ mensaje: resp }),                   
          createRolesSuccess()
        ]),
        catchError(error => of(rolesError({ error: error.message })))    
      )
    )
  )); 

  updateRoles$ = createEffect(() => this.actions$.pipe(
    ofType(updateRolesRequest), 
    exhaustMap(action =>
      this.rolesServices.updateRoles(action.roles).pipe(
        mergeMap(resp => [
          getMensajesSuccess({ mensaje: resp }),                   
          updateRolesSuccess()
        ]),
        catchError(error => of(rolesError({ error: error.message })))    
      )
    )
  )); 

  deleteRoles$ = createEffect(() => this.actions$.pipe(
    ofType(deleteRolesRequest), 
    switchMap(action =>
      this.rolesServices.deleteRoles(action.roles).pipe(
        mergeMap(resp => [
          getMensajesSuccess({ mensaje: resp }),                   
          deleteRolesSuccess()
        ]),
        catchError(error => of(rolesError({ error: error.message })))    
      )
    )
  )); 
 

}