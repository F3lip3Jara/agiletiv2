import { Component, EventEmitter, Input, Output, HostListener, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-search-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    ProgressSpinnerModule
  ],
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.scss']
})
export class SearchDialogComponent implements AfterViewInit {
  @Input() visible: boolean = false;
  @Input() data: any[] = [];
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() searchValueChange = new EventEmitter<string>();
  @ViewChild('searInput') searchInput!: ElementRef;  
  searchQuery: string = '';
  searchSuggestions: string[] = [];
  isLoading: boolean = false;
  searchTimeout: any;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Ctrl + Q para abrir el diálogo de búsqueda
    if (event.ctrlKey && event.key === 'q') {
      event.preventDefault();
      this.visible = true;
      this.visibleChange.emit(true);
      this.focusInput();
    }
    // Ctrl + A para aplicar la búsqueda
    if (event.ctrlKey && event.key === 'a') {
      event.preventDefault();
      this.applySearch();
    }
  }

  ngAfterViewInit() {
    // Observar cambios en la visibilidad del diálogo
    this.visibleChange.subscribe((isVisible) => {
      if (isVisible) {
        setTimeout(() => this.focusInput(), 100);
      }
    });
  }

  focusInput() {
    if (this.searchInput?.nativeElement) {
      this.searchInput.nativeElement.focus();
    }
  }

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.searchQuery = '';
    this.searchSuggestions = [];
    this.isLoading = false;
  }

  updateSuggestions() {
    // Cancelar la búsqueda anterior si existe
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    if (this.searchQuery.trim()) {
      this.isLoading = true;

      // Crear un nuevo timeout para la búsqueda
      this.searchTimeout = setTimeout(() => {
        // Filtrar sugerencias basadas en los datos
        this.searchSuggestions = this.data
          .map(item => Object.values(item))
          .flat()
          .filter(value => 
            value && 
            value.toString().toLowerCase().includes(this.searchQuery.toLowerCase())
          )
          .slice(0, 5) // Limitar a 5 sugerencias
          .map(value => value.toString());

        this.isLoading = false;
      }, 300); // Esperar 300ms antes de realizar la búsqueda
    } else {
      this.searchSuggestions = [];
      this.isLoading = false;
    }
  }

  applySearch() {
    if (this.searchQuery.trim()) {
      this.searchValueChange.emit(this.searchQuery);
      this.closeDialog();
    }
  }

  selectSuggestion(suggestion: string) {
    this.searchQuery = suggestion;
    this.applySearch();
  }
} 