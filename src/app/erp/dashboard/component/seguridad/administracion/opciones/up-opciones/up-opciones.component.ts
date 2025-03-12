import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '../../../../app.state';
import { Store } from '@ngrx/store';
import { incrementarRequest } from '../../../../state/actions/estado.actions';
import { updateOpcionesRequest } from '../../../state/actions/opciones.actions';
@Component({
  selector: 'app-up-opciones',
  templateUrl: './up-opciones.component.html',
  styleUrl: './up-opciones.component.scss'
})
export class UpOpcionesComponent {
  up : FormGroup;
  optId : number = 0;
   
   constructor(fgUser             : FormBuilder,
             private router       : Router,
             private route        : ActivatedRoute,
          
             private store: Store<AppState>,
 ) {
 
       this.up = fgUser.group({
             optDes : ['' , Validators.compose([
             Validators.required
             ])],
             optLink : ['' , Validators.compose([
              Validators.required
              ])]
           
       });
     
 }
  
   ngOnInit(){
    
     this.route.params.subscribe(params => {
       const dato   = params['opcion'];
       let data = JSON.parse(atob(dato));
       this.up.controls['optDes'].setValue(data.optDes);      
       this.up.controls['optLink'].setValue(data.optLink);
       this.optId = data.optId;
     });
   }
 
   public guardar(optDes: string , optLink:string){
     let opcion = {
       optId: this.optId,
       optDes: optDes,
       optLink: optLink
     }
     this.store.dispatch(incrementarRequest({request:1}));
     this.store.dispatch(updateOpcionesRequest({opciones:opcion}));
   }
 
}
