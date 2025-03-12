import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RestService } from 'src/app/erp/dashboard/service/rest.service';
import { UsersService } from 'src/app/erp/service/users.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { CreateUsuario } from '../interface/usuarios.interface';


@Injectable({
  providedIn: 'root'
})
export class UsuariosService {  
  token      : string     = '';
  parametros : any        = [];

  constructor(
              private rest    : RestService,
              private userSer : UsersService,
              private store   : Store<AppState>
  ) { }

   getUsuarios(): Observable<any> {
    this.token = this.userSer.getToken();

       return this.rest.get('trabUsuarios', this.token, this.parametros).pipe(
        map(
          (data: any) => data // Se devuelve el resultado de la llamada a la API
      ) 
    );
  }

  createUsuario(usuario: any): Observable<any> {
    this.token = this.userSer.getToken();

    return this.rest.post('insUser', this.token, usuario).pipe(
      map(
        (data: any) => data // Se devuelve el resultado de la llamada a la API
      )
    );
  }

  updateUsuario(usuario: any): Observable<any> {
    this.token = this.userSer.getToken();
    let xuser = {'user':btoa(JSON.stringify(usuario))};
    return this.rest.post('upUsuario', this.token, xuser).pipe(
      map(
        (data: any) => data // Se devuelve el resultado de la llamada a la API
      )
    );
  }

  dataUsuario(usuario: any): Observable<any> {
    this.token = this.userSer.getToken();
    let id = usuario.usuario.id;
    this.parametros = [{key : 'userid', value:id}];
    return this.rest.get('getUsuarios', this.token, this.parametros).pipe(
      map(
        (data: any) => data // Se devuelve el resultado de la llamada a la API
      )
    );
  }

  desactivarUsuario(usuario: any): Observable<any> {
    this.token = this.userSer.getToken();
    let user          = {usrid : usuario.id , name:usuario.name };
    let activado      = usuario.activado;
    let xuser         = {'user':btoa(JSON.stringify(user))};
    if(activado == 'ACTIVADO'){
    return this.rest.post('deshabilitar', this.token, xuser).pipe(
      map(
        (data: any) => data // Se devuelve el resultado de la llamada a la API
      )
    );
  }else{
    return this.rest.post('habilitar', this.token, xuser).pipe(
      map(
        (data: any) => data // Se devuelve el resultado de la llamada a la API
      )
    );
  }
}

}