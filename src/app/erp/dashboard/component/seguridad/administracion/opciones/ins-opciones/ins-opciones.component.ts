import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../app.state';
import { incrementarRequest } from '../../../../state/actions/estado.actions';
import { insertOpcionesRequest } from '../../../state/actions/opciones.actions';
@Component({
  selector: 'app-ins-opciones',
  templateUrl: './ins-opciones.component.html',
  styleUrl: './ins-opciones.component.scss'
})
export class InsOpcionesComponent {

  ins: FormGroup;
  optId : number = 0;
   
   constructor(fgUser             : FormBuilder,
             private router       : Router,
             private route        : ActivatedRoute,
          
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
     this.store.dispatch(incrementarRequest({request:1}));
     this.store.dispatch(insertOpcionesRequest({opciones:opcion}));
   }
 


}
