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
import { Grupo } from '../../state/interface/grupo.interface';
import { createGrupoRequest, createGrupoSuccess, grupoError } from '../../state/actions/grupo.actions';
@Component({
  selector: 'app-ins-grupo',
  templateUrl: './ins-grupo.component.html',
  styleUrl: './ins-grupo.component.scss'
})
export class InsGrupoComponent {
    grupo$ : Observable<Grupo[]>;
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
           "grpCod":['', Validators.required],
           "grpDes":['', Validators.required],
      });     
    }

    public guardar(  ){
      if(this.ins.valid){
        this.val = true;
        this.store.dispatch(incrementarRequest({request:1}));
        this.store.dispatch(createGrupoRequest({grupo: this.ins.value}));
        this.actions$.pipe(
        ofType(createGrupoSuccess)
      ).subscribe(() => {
        setTimeout(() => {
          this.val = false;
          this.router.navigate(['/desk/parametros/grupo']);
        }, 1000);
      });

      this.actions$.pipe(
        ofType(grupoError)
      ).subscribe((error) => {
        this.val = false; 
      });
    }
  }
}
