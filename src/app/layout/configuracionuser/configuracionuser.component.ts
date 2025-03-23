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
    this.name = userData.usuario;
   
    
    if (userData) {
      console.log(userData);
      
      this.configForm.patchValue({
        nombre: userData.empNom,
        apellido: userData.empApe,
        fechaNacimiento: userData.fechaNacimiento
      });
      this.avatar = userData.img || '';
      this.label = userData.nombre?.substring(0, 2) || '';
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

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.display = true;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.blob;
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
    this.label = this.configForm.get('nombre')?.value?.substring(0, 2) || '';
    if (this.inputAvatar) {
      this.inputAvatar.nativeElement.value = '';
    }
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
          canvas.width = 150;
          canvas.height = 150;
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
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
          'password'        : formData.newPassword,
          'mantenerPassword': this.showPasswordSection ? 1 : 0,
          'name'            : this.name
      } 
     
      this.store.dispatch(incrementarRequest({request:1}));
      this.store.dispatch(upconfiguserRequest({usuario:usuariox}));
     
      this.actions$.pipe(
        ofType(upconfiguserSuccess),
        take(1)
      ).subscribe(() => {
         
      });

    }
  }
}
