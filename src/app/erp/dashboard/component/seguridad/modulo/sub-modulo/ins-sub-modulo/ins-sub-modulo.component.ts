import { Component } from '@angular/core';
import { ExcelService } from 'src/app/erp/dashboard/service/excel.service';
import { AppState } from '../../../../app.state';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-ins-sub-modulo', 
  templateUrl: './ins-sub-modulo.component.html',
  styleUrl: './ins-sub-modulo.component.scss'
})
export class InsSubModuloComponent {
  modulo:any;

 
  constructor(
    private store: Store<AppState>,
    private router: Router,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.modulo = JSON.parse(atob(params['modulo']));

    });
  }
}
