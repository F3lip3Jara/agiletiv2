import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { Actions } from '@ngrx/effects';
import { Proveedor } from '../../state/interface/proveedor.interface';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { Environment } from 'src/app/erp/service/environment.service';

declare global {
    interface Window {
        google: typeof google;
    }
}

@Component({
  selector: 'app-ins-proveedor',
  templateUrl: './ins-proveedor.component.html',
  styleUrls: ['./ins-proveedor.component.css']
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
  paises = [
    { label: 'Chile', value: 'CL' }
    // Agregar más países según necesidad
  ];

  regiones = [
    { label: 'Región Metropolitana', value: '13' }
    // Agregar más regiones según necesidad
  ];

  comunas = [
    { label: 'Santiago', value: '1' }
    // Agregar más comunas según necesidad
  ];

  ciudades = [
    { label: 'Santiago', value: '1' }
    // Agregar más ciudades según necesidad
  ];

  proveedor$ : Observable<Proveedor[]>;
  val : boolean = false;
  faArrowTurnDown = faArrowDown;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private store: Store<AppState>,
    private actions$: Actions,
    private environment: Environment
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadGoogleMaps();
  }

  ngAfterViewInit() {
    this.initMap();
    this.initAutocomplete();
  }

  private initForm() {
    this.ins = this.fb.group({
      prvRut: ['', Validators.required],
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
      this.val = true;
      // Aquí iría la lógica para guardar el proveedor
      // usando los valores del formulario this.ins.value
    }
  }

  public onCancel() {
    this.router.navigate(['/desk/parametros/proveedor']);
  }
}
