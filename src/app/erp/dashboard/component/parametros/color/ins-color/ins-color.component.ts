import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { distinctUntilChanged, Observable, switchMap, take , debounceTime} from 'rxjs';
import { Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { Router } from '@angular/router';
import { incrementarRequest } from '../../../state/actions/estado.actions';
import { ofType } from '@ngrx/effects';
import { Actions } from '@ngrx/effects';
import { Color } from '../../state/interface/color.interface';
import { createColorSuccess } from '../../state/actions/color.actions';
import { createColorRequest } from '../../state/actions/color.actions';
import { DialogModule } from 'primeng/dialog';
import { ColorPickerModule } from 'primeng/colorpicker';
import { getColorInfoSuccess  , getColorInfoRequest} from '../../../seguridad/state/actions/acciones.actions';

declare global {
    interface Window {
        EyeDropper?: new () => EyeDropper;
    }
    
    interface EyeDropper {
        open: () => Promise<{ sRGBHex: string }>;
    }
}

@Component({
  selector: 'app-ins-color',
  templateUrl: './ins-color.component.html',
  styleUrl: './ins-color.component.scss'
})
export class InsColorComponent implements OnInit {
    color$: Observable<Color[]>;
    ins: FormGroup;
    val: boolean = false;
    faArrowTurnDown = faArrowDown;
    displayColorPicker: boolean = false;
    selectedColorInfo: any | null = null;
    valColor: boolean = false;
    isEyeDropperSupported: boolean = false;

    constructor(
        private store: Store<AppState>,
        private router: Router,
        private fb: FormBuilder,
        private actions$: Actions,
    ) {
        this.isEyeDropperSupported = typeof window !== 'undefined' && 'EyeDropper' in window;
    }

    ngOnInit() {
        this.ins = this.fb.group({
            colCod: ['#FFFFFF', Validators.required],
            colDes: ['', Validators.required], 
        });     

        this.ins.controls['colCod'].valueChanges.pipe(
            debounceTime(1500),
            distinctUntilChanged()
        ).subscribe((value: string) => {
            this.valColor = true;
            this.store.dispatch(getColorInfoRequest({colCod: value}));
            this.actions$.pipe(
                ofType(getColorInfoSuccess),
                take(1)
            ).subscribe((colorInfo: any) => {
                this.selectedColorInfo = colorInfo;
                this.valColor = false;
                this.ins.controls['colDes'].setValue(this.selectedColorInfo.colorInfo.name);
            });
        });
    }

    showColorDialog() {
        this.displayColorPicker = true;
    }

    onColorChange(event: any) {
        const hexColor = event.value;
        this.ins.patchValue({
            colCod: hexColor
        });
    }

    async openEyeDropper() {
        if (!this.isEyeDropperSupported) {
            console.warn('EyeDropper API no está soportada en este navegador');
            return;
        }

        try {
            const eyeDropper = new window.EyeDropper!();
            const result = await eyeDropper.open();
            this.ins.patchValue({
                colCod: result.sRGBHex
            });
        } catch (error) {
            console.error('Error al usar el EyeDropper:', error);
        }
    }

    public guardar() {
        if(this.ins.valid){
            this.val = true;
            this.store.dispatch(incrementarRequest({request:1}));
            this.store.dispatch(createColorRequest({color: this.ins.value}));
            this.actions$.pipe(
                ofType(createColorSuccess),
                take(1)
            ).subscribe(() => {
                setTimeout(() => {
                    this.router.navigate(['/desk/parametros/color']);
                }, 1000);
            });
        }
    }
}
