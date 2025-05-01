import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { Actions } from '@ngrx/effects';
import { MessageService } from 'primeng/api';
import { AppState } from '../../../../app.state';
import { createAlmacenRequest, createAlmacenSuccess } from '../../../state/actions/almacen.actions';
import { incrementarRequest } from '../../../../state/actions/estado.actions';
import { ofType } from '@ngrx/effects';
@Component({
  selector: 'app-ins-almacen',
  templateUrl: './ins-almacen.component.html',
  styleUrl: './ins-almacen.component.scss'
})
export class InsAlmacenComponent {
  ins: FormGroup;
  centro: any;
  val: boolean = false;

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
          const obj = params['centro'];
          this.centro = JSON.parse(atob(obj));

      });

      
        this.ins = this.fb.group({
        almDes: ['', Validators.required],
        centroId: [this.centro.centroId, ],
        almTip: ['', ],
        almCap: ['', ]
    });
  }

  public guardar() {
    if(this.ins.valid){
        this.val = true;
        this.store.dispatch(incrementarRequest({ request: 1 }));
        this.store.dispatch(createAlmacenRequest({ almacen : this.ins.value }));
        // Suscribirse a la acción de éxito
        this.actions$.pipe(
            ofType(createAlmacenSuccess)
        ).subscribe(() => {     
            setTimeout(() => {
                this.val = false;
                this.router.navigate(['/desk/parametros/centro/almacen/' + btoa(JSON.stringify(this.centro))]);
            }, 1000);
        });

    }
  } 
  volver() {
      let obj = btoa(JSON.stringify(this.centro));
      this.router.navigate(['desk/parametros/centro/almacen/' + obj]);
  }

}
