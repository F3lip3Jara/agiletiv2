import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { WarehouseDashboard } from '../models/warehouse-dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class WarehouseDashboardService {

  constructor() { }

  getDashboardData(): Observable<WarehouseDashboard> {
    // Datos estáticos del dashboard
    const dashboardData: WarehouseDashboard = {
      warehouse: {
        id: "350100",
        name: "51 M-WH / Main Warehouse 1",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        location: "Ankara - Yenimahalle",
        type: "Consectetur Adipisicing",
        owner: "SDT Uzay ve Savunma Teknolojileri",
        existencePeriod: {
          start: "2021-06-18",
          end: "2021-06-21"
        }
      },
      overUnderStocks: {
        total: 321,
        percentage: 68,
        items: [
          {
            type: "under_stock",
            label: "Under stock",
            count: 23,
            color: "#ef4444"
          },
          {
            type: "over_stock",
            label: "Over stock",
            count: 123,
            color: "#3b82f6"
          },
          {
            type: "in_stock",
            label: "In stock",
            count: 175,
            color: "#6b7280"
          }
        ]
      },
      dailyCapacityChange: {
        data: [
          {
            day: "Mon",
            outbounded: 450,
            inbounded: 280,
            total: 730
          },
          {
            day: "Tue",
            outbounded: 380,
            inbounded: 320,
            total: 700
          },
          {
            day: "Wed",
            outbounded: 520,
            inbounded: 290,
            total: 810
          },
          {
            day: "Thu",
            outbounded: 500,
            inbounded: 300,
            total: 800
          },
          {
            day: "Fri",
            outbounded: 480,
            inbounded: 350,
            total: 830
          },
          {
            day: "Sat",
            outbounded: 420,
            inbounded: 310,
            total: 730
          },
          {
            day: "Sun",
            outbounded: 390,
            inbounded: 280,
            total: 670
          }
        ]
      },
      recentActivities: {
        date: "2021-11-09",
        day: "Sunday",
        activities: [
          {
            itemName: "Item Name",
            itemId: "020720210001S",
            action: "inbounded",
            quantity: 98,
            type: "inbound"
          },
          {
            itemName: "Item Name",
            itemId: "020720210001S",
            action: "outbounded",
            quantity: 23,
            type: "outbound"
          },
          {
            itemName: "Item Name",
            itemId: "020720210001P",
            action: "inbounded",
            quantity: 45,
            type: "inbound"
          },
          {
            itemName: "Item Name",
            itemId: "020720210001O",
            action: "outbounded",
            quantity: 67,
            type: "outbound"
          },
          {
            itemName: "Item Name",
            itemId: "020720210001R",
            action: "inbounded",
            quantity: 12,
            type: "inbound"
          }
        ]
      },
      items: {
        inbound: [
          {
            partNumber: "12345",
            name: "Item Name",
            quantity: 24,
            maxQuantity: 130,
            stockStatus: "under_stock",
            location: {
              pool: "1244",
              shelf: "32444"
            },
            stockType: "lorem",
            measures: {
              weight: "30 kg",
              length: "23 m"
            },
            scu: "020720210001S"
          },
          {
            partNumber: "12345",
            name: "Item Name",
            quantity: 123,
            maxQuantity: 200,
            stockStatus: "in_stock",
            location: {
              pool: "1244",
              shelf: "32444"
            },
            stockType: "lorem",
            measures: {
              weight: "30 kg",
              length: "23 m"
            },
            scu: "020720210001P"
          },
          {
            partNumber: "12345",
            name: "Item Name",
            quantity: 5,
            maxQuantity: 50,
            stockStatus: "under_stock",
            location: {
              pool: "1244",
              shelf: "32444"
            },
            stockType: "lorem",
            measures: {
              weight: "30 kg",
              length: "23 m"
            },
            scu: "020720210001P"
          }
        ],
        outbound: [
          {
            partNumber: "12345",
            name: "Item Name",
            quantity: 345,
            maxQuantity: 300,
            stockStatus: "over_stock",
            location: {
              pool: "1244",
              shelf: "32444"
            },
            stockType: "lorem",
            measures: {
              weight: "30 kg",
              length: "23 m"
            },
            scu: "020720210001O"
          },
          {
            partNumber: "12346",
            name: "Item Name 2",
            quantity: 89,
            maxQuantity: 100,
            stockStatus: "in_stock",
            location: {
              pool: "1245",
              shelf: "32445"
            },
            stockType: "ipsum",
            measures: {
              weight: "25 kg",
              length: "15 m"
            },
            scu: "020720210002O"
          }
        ]
      },
      filters: {
        quantity: ["All", "Under Stock", "Over Stock", "In Stock"],
        pool: ["All", "1244", "1245", "1246"],
        stockType: ["All", "lorem", "ipsum", "dolor"]
      }
    };

    return of(dashboardData);
  }
} 