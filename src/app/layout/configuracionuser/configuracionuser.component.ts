import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { UsersService } from '../../erp/service/users.service';
import { RestService } from '../../erp/dashboard/service/rest.service';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, take } from 'rxjs/operators';
import { ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { incrementarRequest } from '../../erp/dashboard/component/state/actions/estado.actions';
import { AppState } from '../../erp/dashboard/component/app.state';
import { upconfiguserRequest, upconfiguserSuccess } from 'src/app/erp/dashboard/component/seguridad/state/actions/usuarios.actions';
import { Actions } from '@ngrx/effects';
@Component({
  selector: 'app-configuracionuser',
  templateUrl: './configuracionuser.component.html',
  styleUrls: ['./configuracionuser.component.scss'],
  providers: [MessageService]
})
export class ConfiguracionuserComponent implements OnInit {
  configForm: FormGroup;
  loading = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  avatar: string = '';
  label: string = '';
  display: boolean = false;
  showPasswordSection: boolean = false;
  passwordsMatch = true;
  name : string = ''; 

  @ViewChild('inputAvatar', { static: false }) inputAvatar!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private rest: RestService,
    private router: Router,
    private messageService: MessageService,
    private store: Store<AppState>,
    private actions$: Actions
  ) {
    this.configForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      currentPassword: [''],
      newPassword: ['', [Validators.minLength(8)]],
      confirmPassword: ['']
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {
    // Cargar datos del usuario actual
    const userData = this.userService.getUser();
    
    if (userData) {
      this.name = userData.usuario;
      
      this.configForm.patchValue({
        nombre: userData.empNom,
        apellido: userData.empApe,
        fechaNacimiento: userData.fechaNacimiento,
      });
      this.avatar = userData.img || '';
      this.label = this.avatar.length <= 0 ? (userData.empNom ? userData.empNom.substring(0,1) : 'U') : '';
    } else {
      // Inicializar con valores por defecto si no hay usuario
      this.label = 'U';
    }

    // Validación de contraseñas
    this.configForm.get('newPassword')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.validatePasswords();
      });

    this.configForm.get('confirmPassword')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.validatePasswords();
      });

    // Actualizar label cuando cambie el nombre
    this.configForm.get('nombre')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((nombre) => {
        if (!this.avatar || this.avatar.length <= 0) {
          this.label = nombre ? nombre.substring(0, 1) : 'U';
        }
      });

    // Actualizar label cuando cambie el apellido (usar primera letra del nombre)
    this.configForm.get('apellido')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        if (!this.avatar || this.avatar.length <= 0) {
          const nombre = this.configForm.get('nombre')?.value;
          this.label = nombre ? nombre.substring(0, 1) : 'U';
        }
      });
  }

  validatePasswords() {
    const newPassword = this.configForm.get('newPassword')?.value;
    const confirmPassword = this.configForm.get('confirmPassword')?.value;
    this.passwordsMatch = !newPassword || newPassword === confirmPassword;
  }

  passwordMatchValidator(g: FormGroup) {
    const newPassword = g.get('newPassword')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  acceptCrop(): void {
    this.resizeImage(this.croppedImage).then(resizedImage => {
      this.avatar = resizedImage as string;
    });
    this.display = false;
  }

  cancelCrop(): void {
    this.display = false;
  }

  clearAvatar(): void {
    this.avatar = '';
    this.label = this.configForm.get('nombre')?.value?.substring(0, 1) || 'U';
    if (this.inputAvatar) {
      this.inputAvatar.nativeElement.value = '';
    }
  }

  fileChangeEvent(event: any): void {  
    //console.log(event);     
    this.imageChangedEvent = event;
    this.display = true; // Muestra el popup al seleccionar una imagen  
  }

  imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.blob;        
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

  onSubmit() {
    if (this.configForm.valid && !this.loading) {
      this.loading = true;
      const formData = this.configForm.value;    
      let usuariox : any = {        
          'empName'         : formData.nombre,
          'empApe'          : formData.apellido,         
          'emploAvatar'     : this.avatar,          
          'password'        : formData.currentPassword,
          'mantenerPassword': this.showPasswordSection ? 1 : 0,
          'name'            : this.name,
          'newPassword'     : formData.newPassword
      } 
     
      console.log(usuariox);
      this.store.dispatch(incrementarRequest({request:1}));
      this.store.dispatch(upconfiguserRequest({usuario:usuariox}));
     
      this.actions$.pipe(
        ofType(upconfiguserSuccess),
        take(1)
      ).subscribe(() => {
         //modifico el usuario en el store para que se actualice en el menu
         const userData = this.userService.getUser();
         console.log(userData);
         userData.empNom = formData.nombre;
         userData.empApe = formData.apellido;
         userData.img = this.avatar;
         this.userService.setUsuario(userData.usuario, userData.rol, userData.menu, userData.img, userData.empresa, userData.imgEmp, userData.empNom, userData.empApe);
         this.userService.disparador.emit(userData);
         this.loading = false;
        });

    }
  }
}
