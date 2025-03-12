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
            this.progreso = estado.loading ? 100 : 0;       
        });
    }

}
