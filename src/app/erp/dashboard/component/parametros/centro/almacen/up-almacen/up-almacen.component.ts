import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../app.state';
import { Actions, ofType } from '@ngrx/effects';
import { MessageService } from 'primeng/api';
import { incrementarRequest } from '../../../../state/actions/estado.actions';
import { updateAlmacenRequest, updateAlmacenSuccess } from '../../../state/actions/almacen.actions';

@Component({
  selector: 'app-up-almacen',
  templateUrl: './up-almacen.component.html',
  styleUrl: './up-almacen.component.scss'
})
export class UpAlmacenComponent {
  up: FormGroup;
  val: boolean = false;
  almacen: any;
  centro:any;
  constructor(
    private fb: FormBuilder,
    private router: Router, 
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private actions$: Actions,
    private messageService: MessageService
  ) {

  }     
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      const obj = JSON.parse(atob(params['almacen']));
      this.almacen = obj.almacen;
      this.centro = obj.centro;
    });

    this.up = this.fb.group({
      almDes: [this.almacen.almDes, Validators.required],
      centroId: [this.almacen.centroId, ],
      almTip: [this.almacen.almTip, ],
      almCap: [this.almacen.almCap, ],
      almId: [this.almacen.almId, ] 
    });
  }


  public guardar() {
    if(this.up.valid){
      this.val = true;
      this.store.dispatch(incrementarRequest({ request: 1 }));
      this.store.dispatch(updateAlmacenRequest({ almacen: this.up.value }));  
      this.actions$.pipe(
        ofType(updateAlmacenSuccess)
      ).subscribe(() => {
        setTimeout(() => {
          this.val = false;
          this.router.navigate(['/desk/parametros/centro/almacen/' + btoa(JSON.stringify(this.centro))]);
        }, 1000);
      });
    }
  } 

  volver() {
    this.router.navigate(['/desk/parametros/centro/almacen/' + btoa(JSON.stringify(this.centro))]);
  }
}
