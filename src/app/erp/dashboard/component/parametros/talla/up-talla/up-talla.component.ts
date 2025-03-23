import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Actions } from '@ngrx/effects';  
import { ofType } from '@ngrx/effects';
import { Talla } from '../../state/interface/talla.interface';
import { upTallaRequest, upTallaSuccess } from '../../state/actions/talla.actions';
import { incrementarRequest } from '../../../state/actions/estado.actions';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-up-talla',
  templateUrl: './up-talla.component.html',
  styleUrl: './up-talla.component.scss'
})
export class UpTallaComponent {
  talla:Talla;
  up:FormGroup;
  val:boolean = false;
  faArrowTurnDown = faArrowDown;
  constructor(private store: Store<AppState>,
              private router: Router,
              private fb: FormBuilder,
              private actions$: Actions,
              private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
       this.talla = JSON.parse(atob(params['talla']));
    });


    this.up = this.fb.group({
      tallaCod: [this.talla.tallaCod, Validators.required],
      tallaDes: [this.talla.tallaDes, Validators.required],
      tallaId: [this.talla.tallaId, Validators.required],
    });
  }

  guardar(){
    if(this.up.valid){
      this.val = true;
      this.store.dispatch(incrementarRequest({request:1}));
      this.store.dispatch(upTallaRequest({talla: this.up.value}));
      this.actions$.pipe(
        ofType(upTallaSuccess)
      ).subscribe(() => {
        setTimeout(() => {
          this.router.navigate(['/desk/parametros/talla']);
        }, 1000);
      });
    }
  }

}
