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
import { Clase } from '../../state/interface/clase.interface';
import { createClaseRequest, createClaseSuccess } from '../../state/actions/clase.actions';
@Component({
  selector: 'app-ins-clase',
  templateUrl: './ins-clase.component.html',
  styleUrl: './ins-clase.component.scss'
})
export class InsClaseComponent {
    clase$ : Observable<Clase[]>;
    ins : FormGroup;
    val : boolean = false;
    faArrowTurnDown = faArrowDown;
    clasTip = [
        {label: 'Entrada', value: 'E'},
        {label: 'Salida', value: 'S'},
    ]

    constructor(private store: Store<AppState>,
                private router: Router,
                private fb: FormBuilder,
                private actions$: Actions
              ) {
    }

    ngOnInit() {
      this.ins = this.fb.group({
        clasTip : ['', Validators.required],
        clasTipDes : ['', Validators.required],
      });     
    }

    public guardar( ){
      if(this.ins.valid){
      this.val = true;
      this.store.dispatch(incrementarRequest({request:1}));
      this.store.dispatch(createClaseRequest({clase: this.ins.value}));
       this.actions$.pipe(
        ofType(createClaseSuccess)
      ).subscribe(() => {
        setTimeout(() => {
          this.val = false;
          this.router.navigate(['/desk/parametros/clase']);
        }, 1000);
      });
    }
  }
}
