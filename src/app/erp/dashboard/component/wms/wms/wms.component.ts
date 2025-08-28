import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CheckboxModule } from 'primeng/checkbox';

// Services and Models
import { WarehouseDashboardService } from './services/warehouse-dashboard.service';
import { WarehouseDashboard, WarehouseItem } from './models/warehouse-dashboard.model';

@Component({
  selector: 'app-wms',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ChartModule,
    TabViewModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    TagModule,
    TooltipModule,
    ScrollPanelModule,
    DividerModule,
    ProgressSpinnerModule,
    CheckboxModule
  ],
  templateUrl: './wms.component.html',
  styleUrl: './wms.component.scss'
})
export class WmsComponent implements OnInit {
  
  dashboardData!: WarehouseDashboard;
  loading = true;
  
  // Chart data
  stockChartData: any;
  stockChartOptions: any;
  capacityChartData: any;
  capacityChartOptions: any;
  
  // Table data
  inboundItems: WarehouseItem[] = [];
  outboundItems: WarehouseItem[] = [];
  
  // Filters
  selectedQuantityFilter = 'All';
  selectedPoolFilter = 'All';
  selectedStockTypeFilter = 'All';
  searchText = '';
  
  // Active tab
  activeTabIndex = 0;

  constructor(private warehouseService: WarehouseDashboardService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.warehouseService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.inboundItems = data.items.inbound;
        this.outboundItems = data.items.outbound;
        this.initializeCharts();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.loading = false;
      }
    });
  }

  initializeCharts() {
    this.initializeStockChart();
    this.initializeCapacityChart();
  }

  initializeStockChart() {
    const stockData = this.dashboardData.overUnderStocks;
    
    this.stockChartData = {
      labels: stockData.items.map(item => item.label),
      datasets: [
        {
          data: stockData.items.map(item => item.count),
          backgroundColor: stockData.items.map(item => item.color),
          borderWidth: 0
        }
      ]
    };

    this.stockChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 20,
            color: this.getChartTextColor()
          }
        }
      },
      cutout: '70%'
    };
  }

  initializeCapacityChart() {
    const capacityData = this.dashboardData.dailyCapacityChange;
    
    this.capacityChartData = {
      labels: capacityData.data.map(item => item.day),
      datasets: [
        {
          label: 'Outbounded',
          data: capacityData.data.map(item => item.outbounded),
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4
        },
        {
          label: 'Inbounded',
          data: capacityData.data.map(item => item.inbounded),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4
        },
        {
          label: 'Total items',
          data: capacityData.data.map(item => item.total),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4
        }
      ]
    };

    this.capacityChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 20,
            color: this.getChartTextColor()
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 900,
          grid: {
            color: this.getChartGridColor()
          },
          ticks: {
            color: this.getChartTextColor()
          }
        },
        x: {
          grid: {
            color: this.getChartGridColor()
          },
          ticks: {
            color: this.getChartTextColor()
          }
        }
      }
    };
  }

  // Método para obtener el color del texto de los gráficos según el tema
  private getChartTextColor(): string {
    const isDark = document.body.classList.contains('p-dark') || 
                   document.documentElement.classList.contains('p-dark') ||
                   document.body.classList.contains('dark') ||
                   document.documentElement.classList.contains('dark');
    
    return isDark ? '#ffffff' : '#1e293b';
  }

  // Método para obtener el color de la cuadrícula de los gráficos según el tema
  private getChartGridColor(): string {
    const isDark = document.body.classList.contains('p-dark') || 
                   document.documentElement.classList.contains('p-dark') ||
                   document.body.classList.contains('dark') ||
                   document.documentElement.classList.contains('dark');
    
    return isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  }

  getStockStatusTag(quantity: number, maxQuantity: number): string {
    if (quantity < maxQuantity * 0.8) return 'under_stock';
    if (quantity > maxQuantity) return 'over_stock';
    return 'in_stock';
  }

  getStockStatusSeverity(status: string): string {
    switch (status) {
      case 'under_stock': return 'danger';
      case 'over_stock': return 'warning';
      case 'in_stock': return 'success';
      default: return 'info';
    }
  }

  getStockStatusLabel(status: string): string {
    switch (status) {
      case 'under_stock': return 'Under Stock';
      case 'over_stock': return 'Over Stock';
      case 'in_stock': return 'In Stock';
      default: return 'Unknown';
    }
  }

  getActivityIcon(type: string): string {
    return type === 'inbound' ? 'pi pi-arrow-right' : 'pi pi-arrow-left';
  }

  getActivityColor(type: string): string {
    return type === 'inbound' ? 'text-green-500' : 'text-red-500';
  }

  clearFilters() {
    this.selectedQuantityFilter = 'All';
    this.selectedPoolFilter = 'All';
    this.selectedStockTypeFilter = 'All';
    this.searchText = '';
  }

  getCurrentItems(): WarehouseItem[] {
    const items = this.activeTabIndex === 0 ? this.inboundItems : this.outboundItems;
    
    return items.filter(item => {
      const matchesSearch = !this.searchText || 
        item.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        item.partNumber.toLowerCase().includes(this.searchText.toLowerCase()) ||
        item.scu.toLowerCase().includes(this.searchText.toLowerCase());
      
      const matchesQuantity = this.selectedQuantityFilter === 'All' || 
        this.getStockStatusLabel(this.getStockStatusTag(item.quantity, item.maxQuantity)) === this.selectedQuantityFilter;
      
      const matchesPool = this.selectedPoolFilter === 'All' || 
        item.location.pool === this.selectedPoolFilter;
      
      const matchesStockType = this.selectedStockTypeFilter === 'All' || 
        item.stockType === this.selectedStockTypeFilter;
      
      return matchesSearch && matchesQuantity && matchesPool && matchesStockType;
    });
  }
}
