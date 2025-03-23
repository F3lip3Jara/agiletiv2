import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { Router } from '@angular/router';
import { incrementarRequest } from '../../../state/actions/estado.actions';
import { ofType } from '@ngrx/effects';
import { Actions } from '@ngrx/effects';
import { Talla } from '../../state/interface/talla.interface';
import { insTallaRequest, insTallaSuccess } from '../../state/actions/talla.actions';

@Component({
  selector: 'app-ins-talla',
  templateUrl: './ins-talla.component.html',
  styleUrl: './ins-talla.component.scss'
})
export class InsTallaComponent {
    talla$ : Observable<Talla[]>;
    ins : FormGroup;
    val : boolean = false;
    faArrowTurnDown = faArrowDown;

    constructor(private store: Store<AppState>,
                private router: Router,
                private fb: FormBuilder,
                private actions$: Actions
              ) {
    }

    ngOnInit() {
      this.ins = this.fb.group({
        'tallaCod' : ['', Validators.required],
        'tallaDes' : ['', Validators.required],
      });     
    }

    public guardar(){
      if(this.ins.valid){
        this.store.dispatch(incrementarRequest({request:1})); 
        this.store.dispatch(insTallaRequest({talla: this.ins.value}));
        this.actions$.pipe(
          ofType(insTallaSuccess)
        ).subscribe(() => {
          setTimeout(() => {
            this.router.navigate(['/desk/parametros/talla']);
          }, 1000);
        });
      }
    }
}
