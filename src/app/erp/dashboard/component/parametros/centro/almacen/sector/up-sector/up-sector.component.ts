import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { FormBuilder } from '@angular/forms';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FormGroup } from '@angular/forms';
import { Sector } from '../../../../state/interface/sector.interface';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/erp/dashboard/component/app.state';
import { Store } from '@ngrx/store';
import { incrementarRequest } from 'src/app/erp/dashboard/component/state/actions/estado.actions';
import { updateSectorRequest, updateSectorSuccess } from '../../../../state/actions/sector.actions';

@Component({
  selector: 'app-up-sector',
  templateUrl: './up-sector.component.html',
  styleUrl: './up-sector.component.scss'
})
export class UpSectorComponent {

  sector$ : Observable<Sector[]>;
  up : FormGroup;
  val : boolean = false;
  faArrowTurnDown = faArrowDown;
  almacen: any;
  datos : any;
  sector : any;
  valCod : boolean = false;
  constructor(private store: Store<AppState>,
              private router: Router,
              private fb: FormBuilder,
              private actions$: Actions,
              private route: ActivatedRoute
            ) {
  }

  ngOnInit() {
    this.up = this.fb.group({
          secDes: ['', Validators.required],
          secCod: ['', Validators.required ],
          sectorId: ['', Validators.required ]
    });
    this.route.params.subscribe(params => {
      let almacen = JSON.parse(atob(params['almacen']));
      this.datos = almacen;
      this.almacen = almacen.almacen;
      this.sector = almacen.sector;
      this.up.patchValue({
        secDes: this.sector.name,
        secCod: this.sector.code,
        sectorId: this.sector.id
      });
    });
    
    
  }

  public guardar(){

    if(this.up.valid){
      this.val = true;
      let sector = {
        ...this.up.value,
        centroId: this.almacen.centroId,
        almId: this.almacen.almId
      }
      this.store.dispatch(incrementarRequest({ request: 1 }));
      this.store.dispatch(updateSectorRequest({ sector : sector }));
      // Suscribirse a la acción de éxito
      this.actions$.pipe(
          ofType(updateSectorSuccess)
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

