import { Component, OnInit } from '@angular/core';
import { RestService } from '../../../service/rest.service';
import { UsersService } from '../../../../service/users.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-teacher-students',
  standalone: false,
  templateUrl: './teacher-students.component.html',
  styleUrl: './teacher-students.component.scss',
  providers: [MessageService]
})
export class TeacherStudentsComponent implements OnInit {
  students: any[] = [];
  loading: boolean = false;
  searchQuery: string = '';
  
  showRoutineDialog: boolean = false;
  selectedStudent: any = null;
  routineText: string = '';
  savingRoutine: boolean = false;

  constructor(
    private rest: RestService,
    private userService: UsersService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.searchStudents();
  }

  searchStudents() {
    this.loading = true;
    const token = this.userService.getToken();
    this.rest.get('gym/teacher/students', token, [{key: 'q', value: this.searchQuery}]).subscribe({
      next: (res: any) => {
        this.students = res;
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo buscar alumnos' });
        this.loading = false;
      }
    });
  }

  openRoutineEditor(student: any) {
    this.selectedStudent = student;
    this.routineText = student.gym_profile ? student.gym_profile.routine : '';
    this.showRoutineDialog = true;
  }

  saveRoutine() {
    if (!this.selectedStudent) return;
    
    this.savingRoutine = true;
    const token = this.userService.getToken();
    const payload = {
        routine: this.routineText,
        _method: 'PUT'
    };
    
    this.rest.post(`gym/teacher/students/${this.selectedStudent.id}/routine`, token, payload).subscribe({
      next: (res: any) => {
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Rutina actualizada correctamente' });
        this.savingRoutine = false;
        this.showRoutineDialog = false;
        this.searchStudents(); // refresh
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar la rutina' });
        this.savingRoutine = false;
      }
    });
  }
}
