import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.state';
import { getGymBranchRequest } from '../state/actions/gymBranch.actions';
import { selectGymBranch } from '../state/selectors/gymBranch.selectors';
import { RestService } from '../../../service/rest.service';
import { UsersService } from '../../../../service/users.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-admin-config',
    standalone: false,
    templateUrl: './admin-config.component.html',
    styleUrl: './admin-config.component.scss',
    providers: [MessageService],
})
export class AdminConfigComponent implements OnInit {
    branches: any[] = [];
    selectedBranchId: number | null = null;

    configs: any[] = [];
    loading: boolean = false;
    saving: boolean = false;

    dayNames = [
        'Lunes',
        'Martes',
        'Miércoles',
        'Jueves',
        'Viernes',
        'Sábado',
        'Domingo',
    ];

    constructor(
        private store: Store<AppState>,
        private rest: RestService,
        private userService: UsersService,
        private messageService: MessageService,
    ) {}

    ngOnInit(): void {
        this.store.dispatch(getGymBranchRequest());
        this.store.select(selectGymBranch).subscribe((data: any[]) => {
            this.branches = data;
        });
    }

    onBranchSelect() {
        if (!this.selectedBranchId) return;
        this.loadConfigs(this.selectedBranchId);
    }

    loadConfigs(branchId: number) {
        this.loading = true;
        const token = this.userService.getToken();
        this.rest.get(`gym/branches/${branchId}/config`, token, []).subscribe({
            next: (res: any[]) => {
                this.configs = res;
                this.loading = false;
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar los horarios',
                });
                this.loading = false;
            },
        });
    }

    getDayName(dayOfWeek: number) {
        return this.dayNames[dayOfWeek - 1];
    }

    saveConfigs() {
        if (!this.selectedBranchId) return;
        this.saving = true;
        const token = this.userService.getToken();

        this.rest.post('gym/branches/confing', token, this.configs).subscribe({
            next: (res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Guardado',
                    detail: 'Configuración actualizada correctamente',
                });
                this.saving = false;
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al guardar la configuración',
                });
                this.saving = false;
            },
        });
    }
}
