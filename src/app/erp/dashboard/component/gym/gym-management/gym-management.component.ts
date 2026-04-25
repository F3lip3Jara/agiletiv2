import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';

// Podríamos importar actions de NgRx, pero para la gestión simple usaremos REST directo
import { RestService } from '../../../service/rest.service';
import { UsersService } from '../../../../service/users.service';

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

    // Modals
    showGymDialog = false;
    showBranchDialog = false;

    // Forms
    gymObj: any = { name: '', status: true };
    branchObj: any = {
        gym_id: null,
        name: '',
        address: '',
        phone: '',
        status: true,
    };

    constructor(
        private rest: RestService,
        private userSer: UsersService,
        private messageService: MessageService,
    ) {}

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
            // Nota: Si usas delete via post o delete method:
            // this.rest.post(`gym/gyms/${gym.id}`, token, {_method: 'DELETE'})
        }
    }

    // ---- BRANCHES ----
    openNewBranch() {
        this.branchObj = {
            gym_id: this.gyms.length > 0 ? this.gyms[0].id : null,
            name: '',
            address: '',
            phone: '',
            status: true,
        };
        this.showBranchDialog = true;
    }

    editBranch(b: any) {
        this.branchObj = { ...b };
        this.showBranchDialog = true;
    }

    saveBranch() {
        const token = this.userSer.getToken();
        const action = this.branchObj.id ? 'put' : 'post';
        const endpoint = this.branchObj.id
            ? `gym/branches/${this.branchObj.id}`
            : 'gym/branches';

        this.rest[action](endpoint, token, this.branchObj).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Sede guardada',
                });
                this.showBranchDialog = false;
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
}
