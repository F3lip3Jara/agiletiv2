export interface StockCaja {
   stockIblpnId: number;
   empId: number;
   centroId: number;
   almId: number;
   iblpnId: number;
   prdId: number;
   stockIblpnQty: number;
   iblpnStatus: string;
   iblpnOriginalBarcode: string;
   iblpnHdrCustShortText3: string;
   iblpnHdrCustShortText4: string;
   iblpnQty: number;
   cenDes: string;
   almDes: string;
   cod_pareo: string;
   descripcion: string;
   talla: string;
   color: string;
   grupo: string;
   sub_grupo: string;
   url: string;
   created_at: string;
   updated_at: string;
}

export const  STOCK_CAJA_KEYS = [
   "stockIblpnId",
   "empId",
   "centroId",
   "almId",
   "iblpnId",
   "prdId",
   "stockIblpnQty",
   "iblpnStatus",
   "iblpnOriginalBarcode",
   "iblpnHdrCustShortText3",
   "iblpnHdrCustShortText4",
   "iblpnQty",
   "cenDes",
   "almDes",
   "cod_pareo",
   "descripcion",
   "talla",
   "color",
   "grupo",
   "sub_grupo",
   "url",
   "created_at",
   "updated_at"       
    // Agrega más keys según necesites
];
