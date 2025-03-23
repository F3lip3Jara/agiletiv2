import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, take } from 'rxjs';
import { Clase } from '../../state/interface/clase.interface';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { AppState } from '../../../app.state';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { incrementarRequest } from '../../../state/actions/estado.actions';
import { getClaseRequest, updateClaseRequest, updateClaseSuccess } from '../../state/actions/clase.actions';
@Component({
  selector: 'app-up-clase',
  templateUrl: './up-clase.component.html',
  styleUrl: './up-clase.component.scss'
})
export class UpClaseComponent {
  clase$ : Observable<Clase[]>;
  up : FormGroup;
  val : boolean = false;
  faArrowTurnDown = faArrowDown;
  clasTip = [
    {label: 'Entrada', value: 'E'},
    {label: 'Salida', value: 'S'},
  ]

  constructor(private store: Store<AppState>,
    private router: Router,
    private fb: FormBuilder,  
    private actions$: Actions,
    private route: ActivatedRoute,
  ) {
    this.up = this.fb.group({
      clasTipDes: ['', Validators.required],
      clasTip: ['', Validators.required],
      clasTipId: [0, Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const dato = atob(params['clase']); 
      const clase = JSON.parse(dato);
        this.up.setValue({
          clasTipDes: clase.clasTipDes,
          clasTip: clase.clasTip,
          clasTipId: clase.clasTipId,
        });
    });
  }

  guardar(){
    if(this.up.valid){
      this.val = true;
      this.store.dispatch(incrementarRequest({request: 1}));
      this.store.dispatch(updateClaseRequest({clase: this.up.value}));
      this.actions$.pipe(
        ofType(updateClaseSuccess),
        take(1)
      ).subscribe(() => {
        setTimeout(() => {
          this.router.navigate(['/desk/parametros/clase']); 
        }, 1000);
      });
    }
  }

  cancelar(){
    this.router.navigate(['/desk/parametros/clase']);
  }
}