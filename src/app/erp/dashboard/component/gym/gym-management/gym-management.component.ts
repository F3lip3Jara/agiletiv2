import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';

// Podríamos importar actions de NgRx, pero para la gestión simple usaremos REST directo
import { RestService } from '../../../service/rest.service';
import { UsersService } from '../../../../service/users.service';
import { Router } from '@angular/router';
import { ExcelService } from 'src/app/erp/dashboard/service/excel.service';

@Component({
    selector: 'app-gym-management',
    standalone: false,
    templateUrl: './gym-management.component.html',
    styleUrl: './gym-management.component.scss',
    providers: [MessageService],
})
export class GymManagementComponent implements OnInit {
    gyms: any[] = [];
    branches: any[] = [];
    loading: boolean = false;

    // Table & Modern layout properties
    cols: any[] = [];
    globalFilterFields: string[] = ['name', 'address', 'gym.name'];
    rowsPerPageOptions: number[] = [10, 20];
    actionItems: any[] = [];
    selectedRow: any = null;
    showSearchDialog: boolean = false;

    // Modals for Gym
    showGymDialog = false;
    gymObj: any = { name: '', status: true };

    constructor(
        private rest: RestService,
        private userSer: UsersService,
        private messageService: MessageService,
        private router: Router,
        private excelService: ExcelService
    ) {
        this.actionItems = [
            {
                label: 'Editar',
                icon: 'pi pi-pencil',
                command: () => {
                    if (this.selectedRow) {
                        this.editBranch(this.selectedRow);
                    }
                }
            },
            {
                label: 'Eliminar',
                icon: 'pi pi-trash',
                command: () => {
                    if (this.selectedRow) {
                        this.deleteBranch(this.selectedRow);
                    }
                }
            }
        ];
    }

    ngOnInit(): void {
        this.loadData();
    }

    loadData() {
        this.loading = true;
        const token = this.userSer.getToken();

        // Cargar Gimnasios
        this.rest.get('gym/gyms', token, []).subscribe({
            next: (res: any) => {
                this.gyms = res;
            },
            error: () =>
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar los gimnasios',
                }),
        });

        // Cargar Sedes
        this.rest.get('gym/branches', token, []).subscribe({
            next: (res: any) => {
                this.branches = res;
                this.loading = false;
            },
            error: () => (this.loading = false),
        });
    }

    onGlobalFilter(table: any, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    onSearchValueChange(value: string) {
        // Implementar lógica similar a opciones.component
        const inputElement = document.querySelector('.p-inputtext-sm') as HTMLInputElement;
        if (inputElement) {
            inputElement.value = value;
            const event = new Event('input', { bubbles: true });
            inputElement.dispatchEvent(event);
        }
    }

    onActionClick(item: any) {
        this.selectedRow = item;
    }

    exportCSV() {
        this.excelService.exportAsExcelFile(this.branches, 'sedes');
    }

    // ---- GYMS ----
    openNewGym() {
        this.gymObj = { name: '', status: true };
        this.showGymDialog = true;
    }

    saveGym() {
        const token = this.userSer.getToken();
        const action = this.gymObj.id ? 'put' : 'post';
        const endpoint = this.gymObj.id
            ? `gym/gyms/${this.gymObj.id}`
            : 'gym/gyms';

        this.rest[action](endpoint, token, this.gymObj).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Gimnasio guardado',
                });
                this.showGymDialog = false;
                this.loadData();
            },
            error: (e) =>
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: e.error?.error || 'Error al guardar',
                }),
        });
    }

    deleteGym(gym: any) {
        if (confirm('¿Estás seguro de eliminar este gimnasio?')) {
            this.rest
                .get(`gym/gyms/${gym.id}/delete`, this.userSer.getToken(), [])
                .subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: 'Eliminado',
                        });
                        this.loadData();
                    },
                });
        }
    }

    // ---- BRANCHES ----
    openNewBranch() {
        this.router.navigate(['desk/gym/sedes/ins-sede']);
    }

    editBranch(b: any) {
        const dato = btoa(JSON.stringify(b));  
        this.router.navigate(['desk/gym/sedes/up-sede/' + dato]);
    }

    deleteBranch(b: any) {
        if (confirm('¿Estás seguro de eliminar esta sede?')) {
            const token = this.userSer.getToken();
            // Implement delete branch
            this.rest.post(`gym/branches/${b.id}`, token, {_method: 'DELETE'}).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Sede eliminada' });
                    this.loadData();
                },
                error: () => {
                    // Si el backend no soporta _method: DELETE via post en este caso, se puede hacer get /delete o delete /branches/id
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar' });
                }
            });
        }
    }
}
