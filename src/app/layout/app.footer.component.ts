import { Component } from '@angular/core';
import { LayoutService } from "./service/app.layout.service";
import { selectEstado } from '../erp/dashboard/component/state/selectors/estado.selectors';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-footer',
    templateUrl: './app.footer.component.html',
    styleUrls: ['./app.footer.component.scss']
})
export class AppFooterComponent {

    progreso: number = 0;
    
    constructor(public layoutService: LayoutService, private store: Store) { }

    ngOnInit(): void {
        this.store.select(selectEstado).subscribe((estado : any) => {
            let progreso = 0;
            const loading = estado.loading;
            const total = estado.total;
            const current = estado.current;
            progreso = Math.round((current / total) * 100);
            this.progreso = progreso;
        });
    }

}
