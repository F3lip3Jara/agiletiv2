import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { ofType } from '@ngrx/effects';
import { Actions } from '@ngrx/effects';
import { Sector } from '../../../../state/interface/sector.interface';
import { AppState } from 'src/app/erp/dashboard/component/app.state';
import { incrementarRequest } from 'src/app/erp/dashboard/component/state/actions/estado.actions';
import { createSectorRequest, createSectorSuccess } from '../../../../state/actions/sector.actions';

@Component({
  selector: 'app-ins-sector',
  templateUrl: './ins-sector.component.html',
  styleUrl: './ins-sector.component.scss'
})
export class InsSectorComponent {
    sector$ : Observable<Sector[]>;
    ins : FormGroup;
    val : boolean = false;
    faArrowTurnDown = faArrowDown;
    almacen: any;
    datos : any;
    constructor(private store: Store<AppState>,
                private router: Router,
                private fb: FormBuilder,
                private actions$: Actions,
                private route: ActivatedRoute
              ) {
    }

    ngOnInit() {
      this.ins = this.fb.group({
            secDes: ['', Validators.required],
            secCod: ['', Validators.required ]
      });
      this.route.params.subscribe(params => {
        let almacen = JSON.parse(atob(params['almacen']));
        this.datos = almacen;
        this.almacen = almacen.almacen;
      });
    }

    public guardar(){
  
      if(this.ins.valid){
        this.val = true;
        let sector = {
          ...this.ins.value,
          centroId: this.almacen.centroId,
          almId: this.almacen.almId
        }
        this.store.dispatch(incrementarRequest({ request: 1 }));
        this.store.dispatch(createSectorRequest({ sector : sector }));
        // Suscribirse a la acción de éxito
        this.actions$.pipe(
            ofType(createSectorSuccess)
        ).subscribe(() => {     
            setTimeout(() => {
                this.val = false;
               this.volver();
            }, 1000);
        });

      }
      
    }

    volver(){
     let almacen = btoa(JSON.stringify(this.datos));
      this.router.navigate(['/desk/parametros/centro/almacen/sector/' + almacen]);
    }
}
