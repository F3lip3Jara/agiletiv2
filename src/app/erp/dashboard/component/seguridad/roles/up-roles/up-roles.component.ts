import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { FormGroup } from '@angular/forms';
import { rolesError, updateRolesRequest, updateRolesSuccess } from '../../state/actions/roles.actions';
import { incrementarRequest } from '../../../state/actions/estado.actions';
import { ofType } from '@ngrx/effects';
import { Actions } from '@ngrx/effects';
@Component({
  selector: 'app-up-roles',
  templateUrl: './up-roles.component.html',
  styleUrl: './up-roles.component.scss'
})
export class UpRolesComponent {
 up : FormGroup;
 idRol : number = 0;
 val: boolean = false;
  constructor(fgUser             : FormBuilder,
            private router       : Router,
            private route        : ActivatedRoute,
            private actions$: Actions,
            private store: Store<AppState>,
) {

      this.up = fgUser.group({
            rolDes : ['' , Validators.compose([
            Validators.required
            ])]
          
      });
    
}
 
  ngOnInit(){
   
    this.route.params.subscribe(params => {
      const dato   = params['roles'];
      let roles    = JSON.parse(atob(dato));
      this.up.controls['rolDes'].setValue(roles.rolDes);      
      this.idRol = roles.rolId;      
    });
  }

  public guardar(rolDes: string){
    let roles = {
      idRol: this.idRol,
      rolDes: rolDes
    }
    this.val = true;  
    this.store.dispatch(incrementarRequest({request:1}));
    this.store.dispatch(updateRolesRequest({roles:roles}));
   
    this.actions$.pipe(
      ofType(updateRolesSuccess)
    ).subscribe(() => {
      setTimeout(() => {
        this.val = false;
        this.router.navigate(['/desk/seguridad/roles']);
      }, 1000);
    });

    this.actions$.pipe(
      ofType(rolesError)
    ).subscribe((error) => {
      this.val = false;
    });
  } 

}
