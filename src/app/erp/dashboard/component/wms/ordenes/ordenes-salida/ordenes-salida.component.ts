import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-ordenes-salida',
  templateUrl: './ordenes-salida.component.html',
  styleUrls: ['./ordenes-salida.component.scss']
})
export class OrdenesSalidaComponent implements OnInit {
  // Propiedades para el diálogo de búsqueda
  showSearchDialog: boolean = false;
  @ViewChild('searchInput') searchInput!: ElementRef;
  dt!: Table;
  data: any[] = [];

  ngOnInit() {
    // Inicialización del componente
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  // Función para manejar cambios en el valor de búsqueda
  onSearchValueChange(value: string) {
    if (this.searchInput && this.searchInput.nativeElement) {
      const inputElement = this.searchInput.nativeElement as HTMLInputElement;
      inputElement.value = value;
      // Disparar el evento input para activar el filtro
      const event = new Event('input', { bubbles: true });
      inputElement.dispatchEvent(event);
    }
  }
}
