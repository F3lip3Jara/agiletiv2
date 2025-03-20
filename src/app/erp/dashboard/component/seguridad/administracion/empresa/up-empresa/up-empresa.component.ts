import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { logoEmpresaRequest, updateEmpresaRequest, updateEmpresaSuccess, empresaError } from '../../../state/actions/empresa.actions';
import { Store } from '@ngrx/store';
import { take, map } from 'rxjs/operators';
import { selectLogoEmpresa } from '../../../state/selectors/empresa.selectors';
import { incrementarRequest } from '../../../../state/actions/estado.actions';
import { Subscription } from 'rxjs';
import { ofType } from '@ngrx/effects';
import { MessageService } from 'primeng/api';
import { Actions } from '@ngrx/effects';
import { Environment } from 'src/app/erp/service/environment.service';

@Component({
  selector: 'app-up-empresa',
  templateUrl: './up-empresa.component.html',
  styleUrl: './up-empresa.component.scss'
})
export class UpEmpresaComponent {
 
    up: FormGroup;
    token: string = '';
    parametros: any = [];
    val: boolean = false;
    mensaje: string = '';   
    imageChangedEvent: any = '';
    croppedImage: any = '';
    avatar: any = '';
    avatarval = 0;
    empresa: any = {};
    loading: boolean = true;
    carga: string = "invisible";
    display: boolean = false;
    label: string = '';
    subscription        : Subscription   = new Subscription();

    @ViewChild('inputAvatar', { static: false }) inputAvatar: ElementRef;
    @ViewChild('map') mapElement!: ElementRef;
    @ViewChild('empDir') searchElement!: ElementRef;


    map: google.maps.Map | null = null;
    marker: any = null;
    autocomplete: google.maps.places.Autocomplete | null = null;
  
    constructor(
      private fb: FormBuilder,
      private router: Router,
      private route: ActivatedRoute,
      private store: Store,
      private actions$: Actions,
      private messageService: MessageService,
    
      private ngZone: NgZone,
      private environment: Environment
    ) {

    }
  
    ngOnInit() {
      
      this.up = this.fb.group({
        empDes: ['', Validators.required],
        empDir: ['', Validators.required],
        empGiro: ['', Validators.required],
        empFono: ['', Validators.required],
        empTokenOMS: ['']
      });
  
      this.route.params.subscribe(params => {
          this.empresa = JSON.parse(atob(params['empresa']));
  
            this.up.patchValue({
              empDes: this.empresa.empDes,
              empDir: this.empresa.empDir,
              empGiro: this.empresa.empGiro,
              empFono: this.empresa.empFono,
              empTokenOMS: this.empresa.empTokenOMS
            });
          
            this.label = this.empresa.empDes.substring(0,1);
        
      });
     
      this.store.dispatch(incrementarRequest({ request: 1 }));
      this.store.dispatch(logoEmpresaRequest({ id: this.empresa.empId }));      
      this.subscription.add(this.store.select(selectLogoEmpresa).subscribe((res: any) => {        
       if(res.length > 0){
        this.avatar = res[0].empImg;
        this.subscription.unsubscribe();
       }
      }));
      this.loadGoogleMaps();
    }
    
   
    fileChangeEvent(event: any): void {           
      this.imageChangedEvent = event;
      this.display = true; // Muestra el popup al seleccionar una imagen   
    }
  
    imageCropped(event: ImageCroppedEvent): void {
      this.croppedImage = event.blob;          
    }
    
    imageLoaded(): void {
      // Imagen cargada
    }
    
    cropperReady(): void {
      // El recortador está listo
    }
    
    loadImageFailed(): void {
      this.avatar = '';
      this.inputAvatar.nativeElement.value = '';
      this.croppedImage = '';
    }
    
    resizeImage(file: File): Promise<string | ArrayBuffer | null> {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            const img = new Image();
            img.src = e.target.result;
    
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              // Ajusta el tamaño deseado, por ejemplo, 800x600
              canvas.width  = 150;
              canvas.height = 150;
              // Dibuja la imagen en el lienzo
              ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
              // Convierte el lienzo a base64
              const resizedImage = canvas.toDataURL('image/jpeg');
              resolve(resizedImage);
            };
    
            img.onerror = (error) => {
              reject(error);
            };
          };
    
          reader.readAsDataURL(file);
        });
      
    }

    acceptCrop(): void {
      // Aquí puedes manejar la imagen recortada, por ejemplo, guardarla en el avatar
      this.resizeImage(this.croppedImage).then(resizedImage => {
        this.avatar = resizedImage;
       });
      
      this.display = false; // Cierra el popup
    }
  
    cancelCrop(): void {
      this.display = false; // Cierra el popup sin guardar cambios
    }

    clearAvatar(){
      this.avatar = '';
      this.label = this.up.controls['empDes'].value.substring(0,1);
      this.inputAvatar.nativeElement.value = '';
    }

    public guardar(empDes: any, empDir: any, empGiro: any, empFono: any, empTokenOMS: any) {
      if (this.up.valid) {
        let empresa = {
          empId: this.empresa.empId,
          empDes: empDes,
          empDir: empDir,
          empRut: this.empresa.empRut,
          empGiro: empGiro,
          empFono: empFono,
          empImg: this.avatar,
          empTokenOMS: empTokenOMS
        };
        this.val = true;
        this.store.dispatch(incrementarRequest({ request: 1 }));
        this.store.dispatch(updateEmpresaRequest({empresa: empresa }));

        this.actions$.pipe(
          ofType(updateEmpresaSuccess)
          ).subscribe(() => {    
              setTimeout(() => {
                  this.val = false;
                  this.router.navigate(['/desk/seguridad/administracion/empresa']);
              }, 1000);
          });

          // Suscribirse a la acción de error
          this.actions$.pipe(
              ofType(empresaError)
          ).subscribe((error) => {
              this.val = false;
              this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Error al actualizar la  empresa'
              });
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

      const defaultLocation = { lat: -33.4489, lng: -70.6693 }; // Santiago, Chile
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
                  this.up.patchValue({
                      empDir: this.searchElement.nativeElement.value,
                      empLat: place.geometry.location?.lat().toString() || '',
                      empLng: place.geometry.location?.lng().toString() || ''
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
                          title: this.up.get('empDes')?.value,
                          content: markerView.element
                      });
                  } else {
                      this.marker = new google.maps.Marker({
                          position: position,
                          map: this.map,
                          title: this.up.get('empDes')?.value
                      });
                  }

                  this.map.setCenter(position);
                  this.map.setZoom(15);
              }
          }
      });
  }
   
}
