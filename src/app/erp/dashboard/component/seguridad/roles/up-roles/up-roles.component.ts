import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { FormGroup } from '@angular/forms';
import { updateRolesRequest } from '../../state/actions/roles.actions';
import { incrementarRequest } from '../../../state/actions/estado.actions';

@Component({
  selector: 'app-up-roles',
  templateUrl: './up-roles.component.html',
  styleUrl: './up-roles.component.scss'
})
export class UpRolesComponent {
 up : FormGroup;
 idRol : number = 0;
  
  constructor(fgUser             : FormBuilder,
            private router       : Router,
            private route        : ActivatedRoute,
         
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
      let roles = JSON.parse(atob(dato));
      this.up.controls['rolDes'].setValue(roles.rolDes);      
      this.idRol = roles.rolId;
      
    });
  }

  public guardar(rolDes: string){
    let roles = {
      idRol: this.idRol,
      rolDes: rolDes
    }
    this.store.dispatch(incrementarRequest({request:1}));
    this.store.dispatch(updateRolesRequest({roles:roles}));
  }


}
