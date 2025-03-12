import { Component } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Usuario, USUARIO_KEYS } from '../state/interface/usuarios.interface';
import { AppState } from '../../app.state';
import { Store } from '@ngrx/store';
import { desactivarUsuarioRequest, getUsuariosRequest } from '../state/actions/usuarios.actions';
import { selectUsuarioById, selectUsuarios } from '../state/selectors/usuarios.selectors';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { incrementarRequest } from '../../state/actions/estado.actions';
@Component({
  standalone:false,
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent {

  usuarios          : Observable<Usuario[]>  = new Observable;
  loading           : boolean;
  globalFilterFields: string[]               = [];
  data: Usuario[]                            = []; 
  selectedProducts: Usuario[]                = [];
  submitted: boolean                         = false;
  cols: any[]                                = [];
  statuses: any[]                            = [];
  rowsPerPageOptions                         = [ 10, 20];
  subscription: Subscription                 = new Subscription();
  

  constructor(private store: Store<AppState>,
              private router: Router
  ) { 
  }
  

  ngOnInit(): void {
    
   this.store.dispatch(getUsuariosRequest());
   this.store.dispatch(incrementarRequest({request: 1}));
    // llama a la acción para obtener los todos
     this.store.select(selectUsuarios).subscribe((data : any)=>{
       this.data    = data.usuarios;
       this.loading = data.loading;
     });
     this.globalFilterFields = USUARIO_KEYS;
    }

openNew() {  
  this.router.navigate(['desk/seguridad/usuarios/insusuarios']);
}

edit(id: number) {  
  let usuario$ = this.store.select(selectUsuarioById, { id });  
  this.subscription.add(
    usuario$.subscribe(usuario => {
      if (usuario && id > 0) {
        const dato = btoa(JSON.stringify(usuario));
        this.router.navigate(['desk/seguridad/usuarios/upusuarios/' + dato]);
      }
    })
  );
}


  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  desactivarUsuario(usuario : any) {
     this.store.dispatch(desactivarUsuarioRequest({usuario: usuario}));
     this.store.dispatch(getUsuariosRequest());
     this.store.dispatch(incrementarRequest({request: 2}));
  }
}
