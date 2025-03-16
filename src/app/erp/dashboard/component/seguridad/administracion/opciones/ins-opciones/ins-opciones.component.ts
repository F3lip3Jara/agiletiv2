import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../app.state';
import { incrementarRequest } from '../../../../state/actions/estado.actions';
import { insertOpcionesRequest, insertOpcionesSuccess, opcionesError } from '../../../state/actions/opciones.actions';
import { ofType } from '@ngrx/effects';
import { MessageService } from 'primeng/api';
import { Actions } from '@ngrx/effects';
@Component({
  selector: 'app-ins-opciones',
  templateUrl: './ins-opciones.component.html',
  styleUrl: './ins-opciones.component.scss'
})
export class InsOpcionesComponent {
  val: boolean = false;
  ins: FormGroup;
  optId : number = 0;
   
   constructor(fgUser             : FormBuilder,
             private router       : Router,
             private route        : ActivatedRoute,
             private actions$     : Actions,
             private messageService: MessageService,
             private store: Store<AppState>,
 ) {
 
       this.ins = fgUser.group({
             optDes : ['' , Validators.compose([
             Validators.required
             ])],
             optLink : ['' , Validators.compose([
              Validators.required
              ])]
           
       });
     
 }
  
   ngOnInit(){
    
   }
 
   public guardar(optDes: string , optLink:string){
     let opcion = {
       optId: this.optId,
       optDes: optDes,
       optLink: optLink
     }
     this.val = true;
     this.store.dispatch(incrementarRequest({request:1}));
     this.store.dispatch(insertOpcionesRequest({opciones:opcion}));
     this.actions$.pipe(    
      ofType(insertOpcionesSuccess)
    ).subscribe(() => { 
      setTimeout(() => {
        this.val = false;
        this.router.navigate(['/desk/seguridad/administracion/opciones']);
      }, 1000);
    });

    this.actions$.pipe(
      ofType(opcionesError)
    ).subscribe((error) => {
      this.val = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al guardar la opción'
      });
    });
  
   }
 


}
