import { Component, OnInit } from '@angular/core';
import { RestService } from '../../../service/rest.service';
import { UsersService } from '../../../../service/users.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-student-profile',
  standalone: false,
  templateUrl: './student-profile.component.html',
  styleUrl: './student-profile.component.scss',
  providers: [MessageService]
})
export class StudentProfileComponent implements OnInit {
  profileData: any = {
    gender: null,
    activity_level: 'baja',
    weight: null,
    height: null,
    medical_conditions: '',
    routine: ''
  };
  
  userData: any = {};
  loading: boolean = true;
  saving: boolean = false;

  constructor(
    private rest: RestService,
    private userService: UsersService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    this.loading = true;
    const token = this.userService.getToken();
    this.rest.get('gym/profile/me', token, []).subscribe({
      next: (res: any) => {
        if (res && res.profile) {
          this.profileData = { ...this.profileData, ...res.profile };
        }
        if (res && res.user) {
          this.userData = res.user;
        }
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el perfil' });
        this.loading = false;
      }
    });
  }

  saveProfile() {
    this.saving = true;
    const token = this.userService.getToken();
    this.rest.post('gym/profile/me', token, Object.assign({}, this.profileData, {_method: 'PUT'})).subscribe({
      next: (res: any) => {
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Perfil actualizado correctamente' });
        this.saving = false;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el perfil' });
        this.saving = false;
      }
    });
  }
}
