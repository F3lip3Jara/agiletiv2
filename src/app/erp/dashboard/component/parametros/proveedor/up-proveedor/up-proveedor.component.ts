import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
import { updateProveedorRequest, updateProveedorSuccess, validaProveedorRequest, validaProveedorSuccess } from '../../state/actions/proveedor.actions';
import { RutValidatorService } from 'src/app/erp/service/rut-validator.service';
import { rutFormatValidator, rutValidator } from 'src/app/erp/validators/rut.validator';
import { incrementarRequest } from '../../../state/actions/estado.actions';


declare global {
    interface Window {
        google: typeof google;
    }
}

@Component({
  selector: 'app-up-proveedor',
  templateUrl: './up-proveedor.component.html',
  styleUrls: ['./up-proveedor.component.scss']
})
export class UpProveedorComponent implements OnInit {
  up: FormGroup;
  loading = false;
  direccion = '';
  proveedorId: number = 0;
  
  @ViewChild('map') mapElement!: ElementRef;
  @ViewChild('prvDir') searchElement!: ElementRef;
  
  map: google.maps.Map | null = null;
  marker: any = null;
  autocomplete: google.maps.places.Autocomplete | null = null;
  
  paises$: Observable<Pais[]>;
  regiones$: Observable<Region[]>;
  comunas$: Observable<Comuna[]>;
  ciudades$: Observable<Ciudad[]>;
  provedor: any;

  errorRut: string = '';
  val: boolean = false;
  faArrowTurnDown = faArrowDown;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    private store: Store<AppState>,
    private actions$: Actions,
    private environment: Environment,
    private rutValidatorService: RutValidatorService,
  ) {
    // Inicializar el formulario con valores por defecto
    this.up = this.fb.group({
      prvId: [''],     
      prvNom: ['', Validators.required],
      prvNom2: [''],
      prvGiro: ['', Validators.required],
      prvDir: [''],
      prvNum: [''],
      prvTel: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      prvMail: ['', [Validators.required, Validators.email]],
      prvCli: [false],
      prvPrv: [false],
      paiId: [null, Validators.required],
      regId: [null, Validators.required],
      comId: [null, Validators.required],
      ciuId: [null, Validators.required],
      prvPlace: [''],
      prvLat: [''],
      prvLong: [''],
      prvAct: [true]
    });
  }

  ngOnInit() {
    this.store.dispatch(incrementarRequest({request:4}));
    // Obtener el ID encriptado de la URL
    this.route.params.subscribe(params => {
        let proveedor = JSON.parse(atob(params['proveedor']));
        this.provedor = proveedor;
        this.loadGoogleMaps();
        
        // Inicializar datos de ubicación
        this.store.dispatch(getPaisRequest());
        this.actions$.pipe(
          ofType(getPaisSuccess),
          take(1)
        ).subscribe((paises: any) => {
          this.paises$ = of(paises.pais);
          this.updateFormValues();
        });
    });

    // Suscribirse a cambios en el país
    this.up.get('paiId')?.valueChanges.pipe(
      filter(value => !!value)
    ).subscribe(value => {
      this.store.dispatch(getRegionesPaisRequest({ pais: value }));
    });

    // Manejar respuesta de regiones
    this.actions$.pipe(
      ofType(getRegionesPaisSuccess)
    ).subscribe((regiones: any) => {
      this.regiones$ = of(regiones.region);
      this.regiones$.subscribe(regiones => {
        const region = regiones.find(r => r.regId === this.provedor.region_id);
        if (region) {
          this.up.get('regId')?.setValue(region);
          this.up.get('regId')?.markAsTouched();
          this.up.get('regId')?.updateValueAndValidity();
        }
      });
    });

    // Suscribirse a cambios en la región
    this.up.get('regId')?.valueChanges.pipe(
      filter(value => !!value)
    ).subscribe(value => {
      this.store.dispatch(getCiudadByRegionRequest({ 
        region: value, 
        pais: this.up.get('paiId')?.value 
      }));
    });

    // Manejar respuesta de ciudades
    this.actions$.pipe(
      ofType(getCiudadByRegionSuccess)
    ).subscribe((ciudades: any) => {
      this.ciudades$ = of(ciudades.ciudad);
      this.ciudades$.subscribe(ciudades => {
        const ciudad = ciudades.find(c => c.ciuId === this.provedor.ciudad_id);
        if (ciudad) {
          this.up.get('ciuId')?.setValue(ciudad);
          this.up.get('ciuId')?.markAsTouched();
          this.up.get('ciuId')?.updateValueAndValidity();
        }
      });
    });

    // Suscribirse a cambios en la ciudad
    this.up.get('ciuId')?.valueChanges.pipe(
      filter(value => !!value)
    ).subscribe(value => {
      this.store.dispatch(getComunaByCiudadRequest({ 
        ciudad: value, 
        region: this.up.get('regId')?.value, 
        pais: this.up.get('paiId')?.value 
      }));
    });

    // Manejar respuesta de comunas
    this.actions$.pipe(
      ofType(getComunaByCiudadSuccess)
    ).subscribe((comunas: any) => {
      this.comunas$ = of(comunas.comuna);
      this.comunas$.subscribe(comunas => {
        const comuna = comunas.find(c => c.comId === this.provedor.comuna_id);
        if (comuna) {
          this.up.get('comId')?.setValue(comuna);
          this.up.get('comId')?.markAsTouched();
          this.up.get('comId')?.updateValueAndValidity();
        }
      });
    });

    
  }

  private updateFormValues() {
    let prvCli: boolean = this.provedor.es_cliente === 'S';
    let prvPrv: boolean = this.provedor.es_proveedor === 'S';
    let prvAct: boolean = this.provedor.activado === 'S';

    // Primero actualizamos los campos básicos
    this.up.patchValue({
      prvId: this.provedor.id,
      prvNom: this.provedor.nombre,
      prvNom2: this.provedor.nombre_fantasia,
      prvGiro: this.provedor.giro,
      prvDir: this.provedor.direccion,
      prvNum: this.provedor.numero,
      prvTel: this.provedor.telefono,
      prvMail: this.provedor.mail,
      prvCli: prvCli,
      prvPrv: prvPrv,
      prvPlace: this.provedor.place,
      prvLat: this.provedor.lat,
      prvLong: this.provedor.lng,
      prvAct: prvAct
    });

    // Marcar todos los campos requeridos como touched
    Object.keys(this.up.controls).forEach(key => {
      const control = this.up.get(key);
      if (control && control.validator) {
        control.markAsTouched();
        control.updateValueAndValidity();
      }
    });

 

    // Establecer los valores de ubicación
    if (this.provedor.pais_id) {
      this.paises$.subscribe(paises => {
        const pais = paises.find(p => p.paiId === this.provedor.pais_id);
        if (pais) {
          this.up.get('paiId')?.setValue(pais);
          this.up.get('paiId')?.markAsTouched();
          this.up.get('paiId')?.updateValueAndValidity();
        }
      });
    }
  }

  private loadGoogleMaps() {
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

    // Si tenemos latitud y longitud, usarlas
    let defaultLocation;
    if (this.provedor.lat && this.provedor.lng) {
        defaultLocation = { 
            lat: parseFloat(this.provedor.lat), 
            lng: parseFloat(this.provedor.lng) 
        };
    } else {
        defaultLocation = { lat: -33.4489, lng: -70.6693 }; // Santiago, Chile
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, {
        mapId: "8f12f5c66213fef5",
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

    // Agregar marcador si tenemos ubicación
    if (defaultLocation.lat !== -33.4489 || defaultLocation.lng !== -70.6693) {
        if (this.marker) {
            if ('setMap' in this.marker) {
                this.marker.setMap(null);
            } else {
                this.marker.map = null;
            }
        }

        if (google.maps.marker && 'AdvancedMarkerElement' in google.maps.marker) {
            const markerView = new google.maps.marker.PinElement({
                background: '#4285F4',
                borderColor: '#FBBC04',
                glyphColor: '#FFFFFF'
            });

            this.marker = new google.maps.marker.AdvancedMarkerElement({
                map: this.map,
                position: defaultLocation,
                title: this.up.get('prvNom')?.value,
                content: markerView.element
            });
        } else {
            this.marker = new google.maps.Marker({
                position: defaultLocation,
                map: this.map,
                title: this.up.get('prvNom')?.value
            });
        }
    }
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

    // Si tenemos una dirección, establecerla
    if (this.provedor.direccion) {
        this.searchElement.nativeElement.value = this.provedor.direccion;
    }

    this.autocomplete.addListener('place_changed', () => {
        const place = this.autocomplete?.getPlace();
        if (place && place.geometry) {
            this.ngZone.run(() => {
                this.up.patchValue({
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

                if (google.maps.marker && 'AdvancedMarkerElement' in google.maps.marker) {
                    const markerView = new google.maps.marker.PinElement({
                        background: '#4285F4',
                        borderColor: '#FBBC04',
                        glyphColor: '#FFFFFF'
                    });

                    this.marker = new google.maps.marker.AdvancedMarkerElement({
                        map: this.map,
                        position: position,
                        title: this.up.get('prvNom')?.value,
                        content: markerView.element
                    });
                } else {
                    this.marker = new google.maps.Marker({
                        position: position,
                        map: this.map,
                        title: this.up.get('prvNom')?.value
                    });
                }

                this.map.setCenter(position);
                this.map.setZoom(15);
            }
        }
    });
  }

  public guardar() {
    if (this.up.valid) {
      this.loading = true;
      this.store.dispatch(incrementarRequest({request:1}));
      this.store.dispatch(updateProveedorRequest({ proveedor: this.up.value }));
      this.actions$.pipe(
        ofType(updateProveedorSuccess),
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
        this.up.patchValue({
          ciuId: '',
          regId: '',
          comId: ''
        });
        break;
      case 'region':
        this.up.patchValue({
          ciuId: '',
          comId: ''
        });
        break;
      case 'ciudad':
        this.up.patchValue({
          comId: ''
        });
        break;
    }
  }
}
