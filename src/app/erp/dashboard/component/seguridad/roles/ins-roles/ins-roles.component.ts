import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { Validators } from '@angular/forms';
import { Roles } from '../../state/interface/roles.interface';
import { FormGroup } from '@angular/forms';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { Router } from '@angular/router';
import { createRolesRequest } from '../../state/actions/roles.actions';
import { incrementarRequest } from '../../../state/actions/estado.actions';

@Component({
  selector: 'app-ins-roles',
  templateUrl: './ins-roles.component.html',
  styleUrl: './ins-roles.component.scss'
})
export class InsRolesComponent {
  roles$ :   Observable<Roles[]>;
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
                private fb: FormBuilder
              ) {
               }

    ngOnInit() {
      this.ins = this.fb.group({
            rolDes: ['', Validators.required],
           
      });     
    }

 
  
    public guardar( rolDes: string ){
      this.val          = true;
      this.store.dispatch(incrementarRequest({request:1}));
      this.store.dispatch(createRolesRequest({rolDes:rolDes}));
    }
  
 
}
