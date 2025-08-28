import { Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder } from '@angular/forms';
import { map, Observable, switchMap, filter, debounceTime, take, of } from 'rxjs';
import { Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { ofType } from '@ngrx/effects';
import { Actions } from '@ngrx/effects';
import { Sector } from '../../../../state/interface/sector.interface';
import { AppState } from 'src/app/erp/dashboard/component/app.state';
import { incrementarRequest } from 'src/app/erp/dashboard/component/state/actions/estado.actions';
import { createSectorRequest, createSectorSuccess, getSectorRequest, getSectorSuccess } from '../../../../state/actions/sector.actions';
import { selectSector } from '../../../../state/selectors/sector.selectors';

@Component({
  selector: 'app-ins-sector',
  templateUrl: './ins-sector.component.html',
  styleUrl: './ins-sector.component.scss'
})
export class InsSectorComponent {

    sector$ : Observable<Sector[]>;
    ins : FormGroup;
    val : boolean = false;
    faArrowTurnDown = faArrowDown;
    almacen: any;
    datos : any;
    sectorValido : boolean = false;
    constructor(private store: Store<AppState>,
                private router: Router,
                private fb: FormBuilder,
                private actions$: Actions,
                private route: ActivatedRoute
              ) {
    }

    ngOnInit() {

      this.route.params.subscribe(params => {
        let almacen = JSON.parse(atob(params['almacen']));
        this.datos = almacen;
        this.almacen = almacen.almacen;
        
        // Crear el FormGroup después de tener el almacen
        this.ins = this.fb.group({
          secDes: ['', Validators.required],
          secCod: ['', [Validators.required]]
        });


        this.ins.controls['secCod'].valueChanges.pipe(
          filter(value => value != null && value != undefined && value != ''),
          debounceTime(300),
        ).subscribe(value => {
         // console.log('Valor del control secCod:', value);
          this.validacodigo(value);
        });
        
        // Suscribirse a los cambios del control para debug
        this.ins.get('secCod')?.statusChanges.subscribe(status => {
          console.log('Estado del control secCod:', status);
          console.log('Errores del control secCod:', this.ins.get('secCod')?.errors);
        });
        
        // Forzar validación inicial
        setTimeout(() => {
          this.ins.get('secCod')?.updateValueAndValidity();
        }, 1000);
      });
    }

    public guardar(){
    
  
      // Verificar si el código ya existe
      if (this.sectorValido) {
      //  console.log('CÓDIGO YA EXISTE, no se puede guardar');
        alert('El código ya existe. Por favor, use un código diferente.');
        return;
      }
      
      if(this.ins.valid){
   //     console.log('Formulario es válido, procediendo a guardar...');
        this.val = true;
        let sector = {
          ...this.ins.value,
          centroId: this.almacen.centroId,
          almId: this.almacen.almId
        }
      //  console.log('Sector a guardar:', sector);
        this.store.dispatch(incrementarRequest({ request: 1 }));
        this.store.dispatch(createSectorRequest({ sector : sector }));
        // Suscribirse a la acción de éxito
        this.actions$.pipe(
            ofType(createSectorSuccess)
        ).subscribe(() => {     
            setTimeout(() => {
                this.val = false;
               this.volver();
            }, 1000);
        });
      } else {
    //    console.log('Formulario NO es válido, no se puede guardar');
        // Mostrar mensaje al usuario
        //alert('El formulario no es válido. Verifique los campos requeridos.');
      }
    }

    volver(){
     let almacen = btoa(JSON.stringify(this.datos));
      this.router.navigate(['/desk/parametros/centro/almacen/sector/' + almacen]);
    }
    
    // Método para forzar validación manual
 
  validacodigo(secCod: string) {
  
    // Normalizar el código
    const codigoNormalizado = secCod.trim().toUpperCase();
    
    this.store.select(selectSector).pipe(
      take(1), // Tomar solo la primera emisión
      switchMap((sectores: any) => {
        //console.log('Sectores disponibles:', sectores);
        
        // Verificar si tenemos datos válidos
        if (this.tieneDatosValidos(sectores)) {
          return of(this.validarConDatosExistentes(sectores.data, codigoNormalizado));
        } else {
         // console.log('No hay datos válidos, solicitando al backend...');
          this.store.dispatch(getSectorRequest({ almacen: this.almacen }));
          
          return this.actions$.pipe(
            ofType(getSectorSuccess),
            take(1),
            map((action: any) => this.validarConDatosExistentes(action.sector.data, codigoNormalizado))
          );
        }
      })
    ).subscribe(resultado => {
      this.sectorValido = resultado;
     // console.log('Resultado de validación:', resultado ? 'CÓDIGO EXISTE' : 'CÓDIGO VÁLIDO');
    
    });
  }
  
  private tieneDatosValidos(sectores: any): boolean {
    return sectores && 
           sectores.data && 
           Array.isArray(sectores.data) && 
           sectores.data.length > 0 &&
           sectores.data.some((sector: any) => sector && Object.keys(sector).length > 0);
  }
  
  private validarConDatosExistentes(sectoresData: any[], codigo: string): boolean {
    console.log('Validando con datos existentes:', sectoresData);
    
    // Filtrar sectores con datos reales
    const sectoresConDatos = sectoresData.filter((sector: any) => 
      sector && Object.keys(sector).length > 0
    );
    
   // console.log('Sectores con datos reales:', sectoresConDatos);
    
    // Buscar el código
    const sectorExistente = sectoresConDatos.find((sector: any) => 
      sector && sector.secCod && 
      sector.secCod.toString().toUpperCase() === codigo
    );
    
    //console.log('Sector encontrado:', sectorExistente);
    
    return !!sectorExistente; // Retorna true si existe, false si no
  }
  

}
