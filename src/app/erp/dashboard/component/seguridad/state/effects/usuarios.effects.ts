import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap } from 'rxjs/operators';
import { UsuariosService } from '../service/usuarios.services'; // Ajusta la ruta
import {  updateUsuarioRequest ,getUsuariosRequest, usuariosError, getUsuariosSuccess, createUsuarioSuccess, createUsuarioRequest , updateUsuarioSuccess, dataUsuarioRequest, dataUsuarioSuccess, desactivarUsuarioRequest, desactivarUsuarioSuccess } from '../actions/usuarios.actions';
import { getMensajesSuccess } from '../../../state/actions/mensajes.actions';

@Injectable()
export class UserEffects {

  constructor(private actions$: Actions, private usuarioService: UsuariosService) {}

  loadUsuarios$ = createEffect(() => this.actions$.pipe(
    ofType(getUsuariosRequest), // Se escucha la acción getTodosRequest y esto desencadena el flujo
    //exhaustMap evita las peticiones duplicadas
    exhaustMap(() => 
        this.usuarioService.getUsuarios() // Se obtienen los TODOS
            .pipe( // se tratan los datos obtenidos
                map((resp: any) => {
                    // Se retorna la acción getTodosSuccess con los TODOS obtenidos   
                 return getUsuariosSuccess({ usuarios: resp }) 
                }),
                catchError((err) => {                   
                    return [usuariosError({ error: 'Error al obtener los usuarios' })]
                })
            )
    )
))

createUsuario$ = createEffect(() => this.actions$.pipe(
    ofType(createUsuarioRequest), // Se escucha la acción createTodoRequest y esto desencadena el flujo
    //exhaustMap evita las peticiones duplicadas
    exhaustMap((usuario) =>  //Las action son los datos que se envían en la acción
        this.usuarioService.updateUsuario(usuario) // Se envía el todo proveniente de la acción al servicio
        .pipe(
            map((resp: any) => {
                // Se retorna la acción createTodoSuccess con el TODO creado por un payload
                return createUsuarioSuccess({ usuario: resp }) 
            }),
            catchError(() => {
                // Se retorna la acción todosError con un error en caso de que la petición falle
                //this.generalService.openDialogGeneric('Error al crear el TODO', 'fa-solid fa-xmark', 'text-red-500')
                return [usuariosError({ error: 'Error al crear el Usuario' })]
            })
        )
    )
))
    

updateUsuario$ = createEffect(() => this.actions$.pipe(
    ofType(updateUsuarioRequest), // Se escucha la acción createTodoRequest y esto desencadena el flujo
    //exhaustMap evita las peticiones duplicadas
    exhaustMap((usuario) =>  //Las action son los datos que se envían en la acción
        this.usuarioService.updateUsuario(usuario) // Se envía el todo proveniente de la acción al servicio
        .pipe(
            map((resp: any) => {
                // Se retorna la acción createTodoSuccess con el TODO creado por un payload
                return updateUsuarioSuccess() , getMensajesSuccess({ mensaje: resp })
            }),
            catchError(() => {
                // Se retorna la acción todosError con un error en caso de que la petición falle
                //this.generalService.openDialogGeneric('Error al crear el TODO', 'fa-solid fa-xmark', 'text-red-500')
                return [usuariosError({ error: 'Error al crear el Usuario' })]
            })
        )
    )
))

dataUsuario$ = createEffect(() => this.actions$.pipe(
    ofType(dataUsuarioRequest), 
    exhaustMap((usuario) =>
        this.usuarioService.dataUsuario(usuario).pipe(
          map((resp: any) => dataUsuarioSuccess({ avatar: resp })),
          catchError(err => of(usuariosError({ error: 'Error al obtener dato de usuario' }))) // Usar of para emitir una acción
        )
      )    
)) 

desactivarUsuario$ = createEffect(() => this.actions$.pipe(
    ofType(desactivarUsuarioRequest), // Se escucha la acción createTodoRequest y esto desencadena el flujo
    //exhaustMap evita las peticiones duplicadas
    exhaustMap((usuario) =>
        this.usuarioService.desactivarUsuario(usuario.usuario)// Se envía el todo proveniente de la acción al servicio
        .pipe(
            map((resp: any) => {
               
                return desactivarUsuarioSuccess(), getMensajesSuccess({ mensaje: resp })
            }),
            catchError(() => {
                return [usuariosError({ error: 'Error al desactivar el Usuario' })]
            })
        )
    )
))
}