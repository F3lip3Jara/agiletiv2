import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppState } from '../../../../app.state';
import { Store } from '@ngrx/store';
import { Validators } from '@angular/forms';
import { incrementarRequest } from '../../../../state/actions/estado.actions';
import { accionesInsertRequest } from '../../../state/actions/acciones.actions';


@Component({
  selector: 'app-ins-acciones',
  templateUrl: './ins-acciones.component.html',
  styleUrl: './ins-acciones.component.scss'
})
export class InsAccionesComponent {
  ins : FormGroup;
  opcion : any;
  
   
   constructor(fgUser             : FormBuilder,
             private router       : Router,
             private route        : ActivatedRoute,
          
             private store: Store<AppState>,
 ) {
 
       this.ins = fgUser.group({
             accDes : ['' , Validators.compose([
            Validators.required
            ])],
            accUrl : ['' , Validators.compose([
            Validators.required
            ])],
            accetaDes : ['' , Validators.compose([
            
            ])],
            accType : ['success' , Validators.compose([
            Validators.required
            ])],
            accMessage : ['' , Validators.compose([
            Validators.required
            ])]   
       });
     
 }  
   ngOnInit(){    
     this.route.params.subscribe(params => {
      const obj   = params['opcion'];  
      this.opcion =  JSON.parse(atob(obj));       
     });
   }
 
   public guardar(accDes: string, accUrl: string, accetaDes: string, accType: string, accMessage: string){
    this.store.dispatch(incrementarRequest({request:1})); 
    let parametros = {
        accDes: accDes,
        accUrl: accUrl,
        accetaDes: accetaDes,
        accType: accType,
        accMessage: accMessage,
        optId: this.opcion.optId
    }
    this.store.dispatch(accionesInsertRequest({acciones: parametros}));
   }

   volver(){
    let obj = btoa(JSON.stringify(this.opcion));
    this.router.navigate(['desk/seguridad/administracion/opciones/acciones/' + obj]);
   }
 
}
