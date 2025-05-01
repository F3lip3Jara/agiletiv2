import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-tipo',
  templateUrl: './tipo.component.html',
  styleUrls: ['./tipo.component.scss']
})
export class TipoComponent implements OnInit {
  // Propiedades para el diálogo de búsqueda
  showSearchDialog: boolean = false;
  @ViewChild('searchInput') searchInput!: ElementRef;
  dt!: Table;

  ngOnInit() {
    // Inicialización del componente
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