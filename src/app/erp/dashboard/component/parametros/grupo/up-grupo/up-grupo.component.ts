import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { Grupo } from '../../state/interface/grupo.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState } from '../../../app.state';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { updateGrupoRequest, updateGrupoSuccess } from '../../state/actions/grupo.actions';
import { incrementarRequest } from '../../../state/actions/estado.actions';
@Component({
  selector: 'app-up-grupo',
  templateUrl: './up-grupo.component.html',
  styleUrl: './up-grupo.component.scss'
})
export class UpGrupoComponent {
  grupo$ : Observable<Grupo[]>;
  up : FormGroup;
  val : boolean = false;
  faArrowTurnDown = faArrowDown;
  grupo : Grupo;

  constructor(private store: Store<AppState>,
              private router: Router,
              private fb: FormBuilder,
              private actions$: Actions,
              private route: ActivatedRoute,
 
              ) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const param =JSON.parse( atob(params['grupo']));
      this.grupo = param;
    });


    this.up = this.fb.group({
      grpCod: [this.grupo.grpCod, Validators.required],
      grpDes: [this.grupo.grpDes, Validators.required],
      grpId: [this.grupo.grpId, Validators.required]
    });
  }

  public guardar() {
    if (this.up.valid) {
      this.val = true;
      this.store.dispatch(incrementarRequest({request: 1}));
      this.store.dispatch(updateGrupoRequest({grupo: this.up.value}));
      this.actions$.pipe(
        ofType(updateGrupoSuccess)
      ).subscribe(() => {
        this.val = false;
        this.router.navigate(['/desk/parametros/grupo']);
      });
    } 
  }
}
