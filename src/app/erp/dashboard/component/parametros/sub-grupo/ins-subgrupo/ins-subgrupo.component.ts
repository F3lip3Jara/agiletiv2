import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subgrupo } from '../../state/interface/subgrupo.interface';
import { Grupo } from '../../state/interface/grupo.interface';
import { getGrupoRequest, getGrupoSuccess } from '../../state/actions/grupo.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';  
import { Actions, ofType } from '@ngrx/effects';
import { incrementarRequest } from '../../../state/actions/estado.actions';
import { createSubgrupoSuccess } from '../../state/actions/subgrupo.actions';
import { createSubgrupoRequest } from '../../state/actions/subgrupo.actions';
import { Router } from '@angular/router';
@Component({
  selector: 'app-ins-subgrupo',
  templateUrl: './ins-subgrupo.component.html',
  styleUrl: './ins-subgrupo.component.scss'
})
export class InsSubgrupoComponent {
    ins : FormGroup;
    subGrupo : Subgrupo;
    grupos : Grupo[];
    val : boolean = false;
    constructor(private fb: FormBuilder,
                private store: Store<AppState>,
                private actions$: Actions,
                private router: Router
    ) {
        this.ins = this.fb.group({
          "grpsCod":['', Validators.required],
          "grpsDes":['', Validators.required],
          "grpId":['', Validators.required],         
        });       
    }

    ngOnInit() {
      this.store.dispatch(incrementarRequest({request: 1}));
        this.store.dispatch(getGrupoRequest());
        this.actions$.pipe(
            ofType(getGrupoSuccess)
        ).subscribe(({grupo}) => {
            this.grupos = grupo;
        });
    }

    guardar() {
      if(this.ins.valid){
        this.val = true;
        this.store.dispatch(incrementarRequest({request:1}));
        this.store.dispatch(createSubgrupoRequest({subgrupo: this.ins.value}));
         this.actions$.pipe(
          ofType(createSubgrupoSuccess)
        ).subscribe(() => {
          setTimeout(() => {
            this.val = false;
            this.router.navigate(['/desk/parametros/sub_grupo']);
          }, 1000);
        });
      }
    }
}
