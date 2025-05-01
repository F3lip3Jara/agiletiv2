import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, take, of, distinctUntilChanged, debounceTime, filter } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { Actions, ofType } from '@ngrx/effects';
import { Proveedor } from '../../state/interface/proveedor.interface';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { Environment } from 'src/app/erp/service/environment.service';
import { Pais } from '../../state/interface/pais.interface';
import { Region } from '../../state/interface/region.interface';
import { Comuna } from '../../state/interface/comuna.interface';
import { Ciudad } from '../../state/interface/ciudad.interface';
import { getPaisRequest, getPaisSuccess } from '../../state/actions/pais.actions';
import { getRegionesPaisRequest, getRegionesPaisSuccess } from '../../state/actions/region.actions';
import { getCiudadByRegionRequest, getCiudadByRegionSuccess } from '../../state/actions/ciudad.actions';
import { getComunaByCiudadSuccess } from '../../state/actions/comuna.actions';
import { getComunaByCiudadRequest } from '../../state/actions/comuna.actions';
import { validaProveedorRequest, validaProveedorSuccess, insProveedorRequest, insProveedorSuccess } from '../../state/actions/proveedor.actions';
import { RutValidatorService } from 'src/app/erp/service/rut-validator.service';
import { rutFormatValidator, rutValidator } from 'src/app/erp/validators/rut.validator';
import { incrementarRequest } from '../../../state/actions/estado.actions';
declare global {
    interface Window {
        google: typeof google;
    }
}

@Component({
  selector: 'app-ins-proveedor',
  templateUrl: './ins-proveedor.component.html',
  styleUrls: ['./ins-proveedor.component.scss']
})
export class InsProveedorComponent implements OnInit {
  ins: FormGroup;
  loading = false;
  direccion = '';
  
  @ViewChild('map') mapElement!: ElementRef;
  @ViewChild('prvDir') searchElement!: ElementRef;
  
  map: google.maps.Map | null = null;
  marker: any = null;
  autocomplete: google.maps.places.Autocomplete | null = null;
  // Datos para los dropdowns
  paises$ : Observable<Pais[]>;

  regiones$ : Observable<Region[]>;

  comunas$ : Observable<Comuna[]>;

  ciudades$ : Observable<Ciudad[]>;

  proveedor$ : Observable<Proveedor[]>;

  errorRut: string = '';

  val : boolean = false;
  faArrowTurnDown = faArrowDown;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private store: Store<AppState>,
    private actions$: Actions,
    private environment: Environment,
    private rutValidatorService: RutValidatorService
  ) {}

  ngOnInit() {
    this.initForm();

    this.store.dispatch(incrementarRequest({request:1}));
    this.store.dispatch(getPaisRequest());
    this.loadGoogleMaps();


    this.actions$.pipe(
      ofType(getPaisSuccess),
      take(1)
    ).subscribe((paises: any) => {
      this.paises$ = of(paises.pais);
    });
    
    this.ins.get('paiId')?.valueChanges.subscribe(value => {
    
      this.store.dispatch(getRegionesPaisRequest({ pais: value }));
      this.actions$.pipe(
        ofType(getRegionesPaisSuccess),
        take(1)
      ).subscribe((regiones: any) => {
        this.clearUbicacion('pais');
        this.comunas$ = of([]);
        this.ciudades$ = of([]);
        this.regiones$ = of(regiones.region);
      });
        
    });

    this.ins.get('regId')?.valueChanges.subscribe(value => {
        this.store.dispatch(getCiudadByRegionRequest({ region: value  , pais: this.ins.get('paiId')?.value }));
        this.actions$.pipe(
          ofType(getCiudadByRegionSuccess),
          take(1)
        ).subscribe((ciudades: any) => {
          this.clearUbicacion('region');
          this.ciudades$ = of(ciudades.ciudad);
          this.comunas$ = of([]);
        }); 
    });

    this.ins.get('ciuId')?.valueChanges.subscribe(value => {
        this.store.dispatch(getComunaByCiudadRequest({ ciudad: value  , region: this.ins.get('regId')?.value , pais: this.ins.get('paiId')?.value }));  
        this.actions$.pipe(
          ofType(getComunaByCiudadSuccess),
          take(1)
        ).subscribe((comunas: any) => {
          this.clearUbicacion('ciudad');
          this.comunas$ = of(comunas.comuna);
        });
    });


    this.ins.controls['prvRut'].valueChanges.pipe(
      filter(text => text.length >=9),
      debounceTime(200),
      distinctUntilChanged()).subscribe(field => {
         this.store.dispatch(validaProveedorRequest({ proveedor: field }));
         this.actions$.pipe(
          ofType(validaProveedorSuccess),
          take(1)
        ).subscribe((data: any) => {
          console.log(data.proveedor[0].error);
            if(data.proveedor[0].error==='0'){
              this.errorRut = '';
              this.ins.controls['prvRut'].setErrors(null);
            }else{
              this.errorRut = data.proveedor[0].mensaje;
              this.ins.controls['prvRut'].setErrors({ 'rut': true });
            }
        });
      });
  }

  ngAfterViewInit() {
    this.loadGoogleMaps();
  }

  private initForm() {
    this.ins = this.fb.group({
      prvRut: ['', [Validators.required, rutFormatValidator(), rutValidator()]],
      prvNom: ['', Validators.required],
      prvNom2: [''],
      prvGiro: ['', Validators.required],
      prvDir: [''],
      prvNum: [''],
      prvTel: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      prvMail: ['', [Validators.required, Validators.email]],
      prvCli: [false],
      prvPrv: [false],
      paiId: ['', Validators.required],
      regId: ['', Validators.required],
      comId: ['', Validators.required],
      ciuId: ['', Validators.required],
      prvPlace: [''],
      prvLat: [''],
      prvLong: ['']
    });

    // Agregar formateo automático del RUT
    this.ins.get('prvRut')?.valueChanges.pipe(
      filter(text => text && text.length > 0),
      distinctUntilChanged()
    ).subscribe(value => {
      const formattedRut = this.rutValidatorService.formatRut(value);
      if (formattedRut !== value) {
        this.ins.get('prvRut')?.setValue(formattedRut, { emitEvent: false });
      }
    });
  }

  private loadGoogleMaps() {
    // Verificar si el script ya está cargado
    if (typeof google !== 'undefined' && google.maps) {
        this.initMap();
        this.initAutocomplete();
        return;
    }

    const script = document.createElement('script');
    script.src = this.environment.keygoogle;
    script.async = true;
    script.defer = true;
    script.onload = () => {
        this.initMap();
        this.initAutocomplete();
    };
    document.body.appendChild(script);
  }

  private initMap() {
    if (!this.mapElement?.nativeElement) {
        setTimeout(() => this.initMap(), 100);
        return;
    }

    const defaultLocation = { lat: -33.4489, lng: -70.6693 }; // Santiago, Chile
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
        mapId: "8f12f5c66213fef5", // ID de mapa para marcadores avanzados
        center: defaultLocation,
        zoom: 12,
        styles: [
            {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
            }
        ]
    });
  }

  private initAutocomplete() {
    if (!this.searchElement?.nativeElement) {
        setTimeout(() => this.initAutocomplete(), 100);
        return;
    }

    this.autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, {
        fields: ['address_components', 'geometry', 'name'],
        types: ['address'],
        componentRestrictions: { country: 'CL' }
    });

    this.autocomplete.addListener('place_changed', () => {
        const place = this.autocomplete?.getPlace();
        if (place && place.geometry) {
            this.ngZone.run(() => {
                this.ins.patchValue({
                    prvDir: this.searchElement.nativeElement.value,
                    prvPlace: place.name || '',
                    prvLat: place.geometry.location?.lat().toString() || '',
                    prvLong: place.geometry.location?.lng().toString() || ''
                });
            });

            if (this.map && place.geometry.location) {
                const position = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                };

                if (this.marker) {
                    if ('setMap' in this.marker) {
                        this.marker.setMap(null);
                    } else {
                        this.marker.map = null;
                    }
                }

                // Intentar usar AdvancedMarkerElement si está disponible
                if (google.maps.marker && 'AdvancedMarkerElement' in google.maps.marker) {
                    const markerView = new google.maps.marker.PinElement({
                        background: '#4285F4',
                        borderColor: '#FBBC04',
                        glyphColor: '#FFFFFF'
                    });

                    this.marker = new google.maps.marker.AdvancedMarkerElement({
                        map: this.map,
                        position: position,
                        title: this.ins.get('prvNom')?.value,
                        content: markerView.element
                    });
                } else {
                    // Fallback al marcador tradicional si AdvancedMarkerElement no está disponible
                    this.marker = new google.maps.Marker({
                        position: position,
                        map: this.map,
                        title: this.ins.get('prvNom')?.value
                    });
                }

                this.map.setCenter(position);
                this.map.setZoom(15);
            }
        }
    });
  }

  public guardar() {
    if (this.ins.valid) {
      this.loading = true;
      this.store.dispatch(insProveedorRequest({ proveedor: this.ins.value }));
      this.actions$.pipe(
        ofType(insProveedorSuccess),
        take(1)
      ).subscribe((data: any) => {
        setTimeout(() => {
          this.loading = false;
          this.router.navigate(['/desk/parametros/proveedor']);
        }, 1000);
      });
    }
  }

  public onCancel() {
    this.router.navigate(['/desk/parametros/proveedor']);
  }

  public clearUbicacion(tipo: string) {
      switch (tipo) {
        case 'pais':
          this.ins.patchValue({
            ciuId: '',
            regId: '',
            comId: ''
          });
          break;
        case 'region':
          this.ins.patchValue({
            ciuId: '',
            comId: ''
          });
          break;
        case 'ciudad':
          this.ins.patchValue({
            comId: ''
          });
          break;
      }
  }
}
