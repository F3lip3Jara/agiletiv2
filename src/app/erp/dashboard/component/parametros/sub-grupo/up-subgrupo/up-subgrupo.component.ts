import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { Router, ActivatedRoute } from '@angular/router';
import { incrementarRequest } from '../../../state/actions/estado.actions';
import { getGrupoRequest, getGrupoSuccess } from '../../state/actions/grupo.actions';
import { Grupo } from '../../state/interface/grupo.interface';
import { Subgrupo } from '../../state/interface/subgrupo.interface';
import { updateSubgrupoRequest, updateSubgrupoSuccess } from '../../state/actions/subgrupo.actions';
@Component({
  selector: 'app-up-subgrupo', 
  templateUrl: './up-subgrupo.component.html',
  styleUrl: './up-subgrupo.component.scss'
})
export class UpSubgrupoComponent {

    grupos: Grupo[] = [];
    up: FormGroup;
    subgrupo: Subgrupo;
    val: boolean = false;
  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>, 
    private actions$: Actions,
    private router: Router,
    private route: ActivatedRoute 
  ) {           
    
  }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.store.dispatch(incrementarRequest({request: 1}));
      this.store.dispatch(getGrupoRequest());
      this.actions$.pipe(
        ofType(getGrupoSuccess)
      ).subscribe(({grupo}) => {
        this.grupos = grupo;  
      }); 

      this.subgrupo = JSON.parse(atob(params['subgrupo']));

      this.up = this.fb.group({
        grpId: [this.subgrupo.grpId, Validators.required],
        grpsCod: [this.subgrupo.grpsCod, Validators.required],
        grpsDes: [this.subgrupo.grpsDes, Validators.required],
        grpsId: [this.subgrupo.grpsId, Validators.required] 
      });
    });
  }

  guardar() {
    if(this.up.valid) { 
      this.val = true;
      this.store.dispatch(incrementarRequest({request: 1}));
      this.store.dispatch(updateSubgrupoRequest({subgrupo: this.up.value}));
      this.actions$.pipe(
        ofType(updateSubgrupoSuccess)
      ).subscribe(() => {
        setTimeout(() => {
          this.val = false;
          this.router.navigate(['/desk/parametros/sub_grupo']);
        }, 1000);
      });
    }
  }
}
