import { Component, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../../app.state';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { incrementarRequest } from '../../../state/actions/estado.actions';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { updateTipospagosRequest, updateTipospagosSuccess } from '../../state/actions/tipospagos.actions';
@Component({
  selector: 'app-up-tipospagos',
  templateUrl: './up-tipospagos.component.html',
  styleUrl: './up-tipospagos.component.scss'
})
export class UpTipospagosComponent {
  data$ :   Observable<any[]>;
  usuarios$: any[];
  filterRoles      : string [];
  imageChangedEvent: any    = '';
  croppedImage     : any    =  '';
  avatar           : any    =  '';
  up              : FormGroup;
  validNombre      : boolean      = false;
  faArrowTurnDown = faArrowDown;
  val              : boolean      = false;
  display: boolean = false; 
  label: string    = '';
  @ViewChild('inputAvatar' , {static: false}) inputAvatar: ElementRef;
  // Controla la visibilidad del popup

  constructor(private store: Store<AppState>,
              private router: Router,
              private fb: FormBuilder,
              private actions$: Actions,
              private route: ActivatedRoute
            ) {
             }

  ngOnInit() {

    this.route.params.subscribe(params => {
       let tipopago = JSON.parse(atob(params['tipopago']));
       this.up = this.fb.group({
        tipPagId: [tipopago.tipPagId, Validators.required],
        tipCod: [tipopago.tipCod, Validators.required],
        tipDes: [tipopago.tipDes, Validators.required],
       });
    });
     
  }



  public guardar(){
    if(this.up.valid){
       this.val          = true;    
       this.store.dispatch(incrementarRequest({request:1}));    
       this.store.dispatch(updateTipospagosRequest({tipospagos: this.up.value}));
    this.actions$.pipe(
      ofType(updateTipospagosSuccess)
    ).subscribe(() => {
      setTimeout(() => {
        this.val = false;
        this.router.navigate(['/desk/parametros/tipo_pago']);
      }, 1000);
    });
  }
  }

}
