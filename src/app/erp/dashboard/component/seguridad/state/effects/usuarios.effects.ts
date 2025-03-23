import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap } from 'rxjs/operators';
import { UsuariosService } from '../service/usuarios.services'; // Ajusta la ruta
import {  updateUsuarioRequest ,getUsuariosRequest, usuariosError, getUsuariosSuccess, createUsuarioSuccess, createUsuarioRequest , updateUsuarioSuccess, dataUsuarioRequest, dataUsuarioSuccess, desactivarUsuarioRequest, desactivarUsuarioSuccess, reiniciarUsuarioRequest, reiniciarUsuarioSuccess, upconfiguserRequest, upconfiguserSuccess } from '../actions/usuarios.actions';
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
        this.usuarioService.createUsuario(usuario) // Se envía el todo proveniente de la acción al servicio
        .pipe(
          mergeMap(resp => [
                        getMensajesSuccess({ mensaje: resp }),
                        createUsuarioSuccess()
                    ]),
                    catchError(error => of(usuariosError({ error: error.message })))    
        )
    )
))
    

updateUsuario$ = createEffect(() => this.actions$.pipe(
    ofType(updateUsuarioRequest), // Se escucha la acción createTodoRequest y esto desencadena el flujo
    //exhaustMap evita las peticiones duplicadas
    exhaustMap((usuario) =>  //Las action son los datos que se envían en la acción
        this.usuarioService.updateUsuario(usuario) // Se envía el todo proveniente de la acción al servicio
        .pipe(
          mergeMap(resp => [
                        getMensajesSuccess({ mensaje: resp }),
                         updateUsuarioSuccess()
                    ]),
                    catchError(error => of(usuariosError({ error: error.message })))    
        )
    )
))

desactivarUsuario$ = createEffect(() => this.actions$.pipe(
    ofType(desactivarUsuarioRequest), // Se escucha la acción createTodoRequest y esto desencadena el flujo
    //exhaustMap evita las peticiones duplicadas
    exhaustMap((usuario) =>
        this.usuarioService.desactivarUsuario(usuario.usuario)// Se envía el todo proveniente de la acción al servicio
        .pipe(
            mergeMap(resp => [
                        getMensajesSuccess({ mensaje: resp }),
                         desactivarUsuarioSuccess()
                    ]),
                    catchError(error => of(usuariosError({ error: error.message })))
        )
    )
))

reiniciarUsuario$ = createEffect(() => this.actions$.pipe(
    ofType(reiniciarUsuarioRequest), // Se escucha la acción createTodoRequest y esto desencadena el flujo
    //exhaustMap evita las peticiones duplicadas
    exhaustMap((usuario) =>
        this.usuarioService.reiniciarUsuario(usuario.usuario)// Se envía el todo proveniente de la acción al servicio
        .pipe(
         mergeMap(resp => [
                        getMensajesSuccess({ mensaje: resp }),
                         reiniciarUsuarioSuccess()
                    ]),
                    catchError(error => of(usuariosError({ error: error.message })))
        )
    )
))

dataUsuario$ = createEffect(() => this.actions$.pipe(
    ofType(dataUsuarioRequest), // Se escucha la acción createTodoRequest y esto desencadena el flujo
    //exhaustMap evita las peticiones duplicadas
    exhaustMap((usuario) =>
        this.usuarioService.dataUsuario(usuario.usuario)// Se envía el todo proveniente de la acción al servicio
        .pipe(
            map((resp: any) => dataUsuarioSuccess({ avatar: resp })),
            catchError(error => of(usuariosError({ error: error.message })))
        )
    )
))

upconfiguser$ = createEffect(() => this.actions$.pipe(
    ofType(upconfiguserRequest), // Se escucha la acción createTodoRequest y esto desencadena el flujo
    //exhaustMap evita las peticiones duplicadas
    exhaustMap((usuario) =>
        this.usuarioService.upconfiguser(usuario.usuario)// Se envía el todo proveniente de la acción al servicio
        .pipe(
            mergeMap(resp => [
                        getMensajesSuccess({ mensaje: resp }),
                         upconfiguserSuccess()
                    ]),
        )
    )
))
}