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

@Component({
  selector: 'app-ins-motivo',
  templateUrl: './ins-motivo.component.html',
  styleUrl: './ins-motivo.component.scss'
})
export class InsMotivoComponent {
    motivo$ : Observable<Motivo[]>;
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
            id: ['', Validators.required],
      });     
    }

    public guardar( id: string ){
      this.val = true;
      this.store.dispatch(incrementarRequest({request:1}));
      this.store.dispatch(createMotivoRequest({{ id: id }}));
    
      this.actions$.pipe(
        ofType(createMotivoSuccess)
      ).subscribe(() => {
        setTimeout(() => {
          this.val = false;
          this.router.navigate(['/desk/seguridad/motivo']);
        }, 1000);
      });

      this.actions$.pipe(
        ofType(MotivoError)
      ).subscribe((error) => {
        this.val = false;
      });
    }
}
