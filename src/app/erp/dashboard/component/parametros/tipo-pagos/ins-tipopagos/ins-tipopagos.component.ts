import { Component, ElementRef, ViewChild } from '@angular/core';
import { ofType } from '@ngrx/effects';
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../../app.state';
import { incrementarRequest } from '../../../state/actions/estado.actions';
import { createTipospagosRequest, createTipospagosSuccess } from '../../state/actions/tipospagos.actions';
@Component({
  selector: 'app-ins-tipopagos',
  templateUrl: './ins-tipopagos.component.html',
  styleUrl: './ins-tipopagos.component.scss'
})
export class InsTipopagosComponent {
  data$ :   Observable<any[]>;
  usuarios$: any[];
  filterRoles      : string [];
  imageChangedEvent: any    = '';
  croppedImage     : any    =  '';
  avatar           : any    =  '';
  ins              : FormGroup;
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
              private actions$: Actions
            ) {
             }

  ngOnInit() {
    this.ins = this.fb.group({
        tipCod: ['', Validators.required],
        tipDes: ['', Validators.required],
    });     
  }



  public guardar(){
    if(this.ins.valid){
       this.val          = true;    
      this.store.dispatch(incrementarRequest({request:1}));
      this.store.dispatch(createTipospagosRequest({tipospagos: this.ins.value}));
  
    this.actions$.pipe(
      ofType(createTipospagosSuccess)
    ).subscribe(() => {
      setTimeout(() => {
        this.val = false;
  
      }, 1000);
    });
  }
  }


}
