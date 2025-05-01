import { Component, Input, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ChipsModule } from 'primeng/chips';
import { AccordionModule } from 'primeng/accordion';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { DividerModule } from 'primeng/divider';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';

interface ColumnDefinition {
  campo: string;
  label: string;
  data_type: string;
}

interface FilterValue {
  column: string;
  values: string[];
}

interface DateRange {
  from: Date | null;
  to: Date | null;
}

@Component({
  selector: 'app-filter-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SidebarModule,
    ButtonModule,
    InputTextModule,
    ChipsModule,
    AccordionModule,
    CalendarModule,
    InputNumberModule,
    DividerModule,
    ScrollPanelModule,
    BadgeModule,
    TooltipModule,
    RippleModule
  ],
  templateUrl: './filter-sidebar.component.html',
  styleUrl: './filter-sidebar.component.scss'
})
export class FilterSidebarComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() columns: ColumnDefinition[] = [];
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() filterApplied = new EventEmitter<FilterValue[]>();

  // Datos de ejemplo para desarrollo
  mockColumns: ColumnDefinition[] = [
    { campo: "ordNumber", label: "Número de Orden", data_type: "varchar" },
    { campo: "cenDes", label: "Centro", data_type: "varchar" },
    { campo: "ordQty", label: "Cantidad", data_type: "int" },
    { campo: "created_at", label: "Fecha Creación", data_type: "timestamp" },
    { campo: "ordestatus", label: "Estado", data_type: "varchar" }
  ];

  filterValues: { [key: string]: any[] } = {};
  dateRanges: { [key: string]: DateRange } = {};
  activeFilters: number = 0;
  expandedFilters: boolean = true;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Ctrl + A
    if (event.ctrlKey && event.key.toLowerCase() === 'a') {
      event.preventDefault(); // Prevenir el comportamiento por defecto
      this.toggleVisibility();
    }
  }

  toggleVisibility() {
    this.visible = !this.visible;
    this.visibleChange.emit(this.visible);
  }

  ngOnInit() {
    if (!this.columns || this.columns.length === 0) {
      this.columns = this.mockColumns;
    }
    
    this.columns.forEach(col => {
      this.filterValues[col.campo] = [];
      if (this.getInputType(col.data_type) === 'datetime') {
        this.dateRanges[col.campo] = { from: null, to: null };
      }
    });
  }

  getInputType(dataType: string): string {
    switch (dataType) {
      case 'int':
      case 'bigint':
        return 'number';
      case 'timestamp':
      case 'time':
        return 'datetime';
      default:
        return 'text';
    }
  }

  onFilterChange(campo: string, values: any[]) {
    this.filterValues[campo] = values;
    this.updateActiveFiltersCount();
  }

  onDateRangeChange(campo: string, range: DateRange) {
    this.dateRanges[campo] = range;
    if (range.from || range.to) {
      this.filterValues[campo] = [
        range.from ? range.from.toISOString() : '',
        range.to ? range.to.toISOString() : ''
      ].filter(date => date !== '');
    } else {
      this.filterValues[campo] = [];
    }
    this.updateActiveFiltersCount();
  }

  updateActiveFiltersCount() {
    this.activeFilters = Object.values(this.filterValues)
      .filter(values => values && values.length > 0).length;
  }

  applyFilter() {
    const filters: FilterValue[] = [];
    
    Object.entries(this.filterValues).forEach(([column, values]) => {
      if (values && values.length > 0) {
        filters.push({
          column,
          values: values.map(v => v.toString())
        });
      }
    });

    this.filterApplied.emit(filters);
    this.visibleChange.emit(false);
  }

  clearFilter() {
    Object.keys(this.filterValues).forEach(key => {
      this.filterValues[key] = [];
      if (this.dateRanges[key]) {
        this.dateRanges[key] = { from: null, to: null };
      }
    });
    this.activeFilters = 0;
    this.filterApplied.emit([]);
  }

  clearSingleFilter(campo: string) {
    this.filterValues[campo] = [];
    if (this.dateRanges[campo]) {
      this.dateRanges[campo] = { from: null, to: null };
    }
    this.updateActiveFiltersCount();
  }

  onSidebarHide() {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
