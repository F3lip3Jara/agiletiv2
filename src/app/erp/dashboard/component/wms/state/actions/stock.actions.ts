import { createAction, props } from '@ngrx/store';
import { Stock } from '../interface/stock.interface';

export const getStockRequest = createAction(
    '[Stock] Get Stock Request'
);

export const getStockSuccess = createAction(
    '[Stock] Get Stock Success',
    props<{ stock: Stock[] , colums: any[]}>()
);

export const stockError = createAction(
    '[Stock] Stock Error',
    props<{ error: string }>()
);

export const aplicarFiltrosRequest = createAction(
    '[Stock] Aplicar Filtros Request',
    props<{ filtros: any[] }>()
);

export const aplicarFiltrosSuccess = createAction(
    '[Stock] Aplicar Filtros Success',
    props<{ stock: Stock[] ,  colums: any[]}>()
);



