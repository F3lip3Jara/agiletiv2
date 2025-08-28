export interface Warehouse {
  id: string;
  name: string;
  description: string;
  location: string;
  type: string;
  owner: string;
  existencePeriod: {
    start: string;
    end: string;
  };
}

export interface StockItem {
  type: string;
  label: string;
  count: number;
  color: string;
}

export interface OverUnderStocks {
  total: number;
  percentage: number;
  items: StockItem[];
}

export interface DailyCapacityData {
  day: string;
  outbounded: number;
  inbounded: number;
  total: number;
}

export interface DailyCapacityChange {
  data: DailyCapacityData[];
}

export interface Activity {
  itemName: string;
  itemId: string;
  action: string;
  quantity: number;
  type: string;
}

export interface RecentActivities {
  date: string;
  day: string;
  activities: Activity[];
}

export interface ItemLocation {
  pool: string;
  shelf: string;
}

export interface ItemMeasures {
  weight: string;
  length: string;
}

export interface WarehouseItem {
  partNumber: string;
  name: string;
  quantity: number;
  maxQuantity: number;
  stockStatus: string;
  location: ItemLocation;
  stockType: string;
  measures: ItemMeasures;
  scu: string;
}

export interface Items {
  inbound: WarehouseItem[];
  outbound: WarehouseItem[];
}

export interface Filters {
  quantity: string[];
  pool: string[];
  stockType: string[];
}

export interface WarehouseDashboard {
  warehouse: Warehouse;
  overUnderStocks: OverUnderStocks;
  dailyCapacityChange: DailyCapacityChange;
  recentActivities: RecentActivities;
  items: Items;
  filters: Filters;
} 