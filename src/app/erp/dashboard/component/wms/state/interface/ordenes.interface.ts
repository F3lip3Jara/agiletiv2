export interface Ordenes {
    ordId: number;
    empId: number;
    centroId: number;
    almId: number;
    ordNumber: string;
    ordQty: number; 
    ordestatus: string; 
    ordTip: string; 
    ordTipDes: string; 
    ordClase: string; 
    ordClaseDes: string; 
    ordHdrCustShortText1: string;    
    ordHdrCustShortText2: string;       
    ordHdrCustShortText3: string; 
    ordHdrCustShortText4: string; 
    ordHdrCustShortText5: string; 
    ordHdrCustShortText6: string; 
    ordHdrCustShortText7: string;   
    ordHdrCustShortText8: string;   
    ordHdrCustShortText9: string;   
    ordHdrCustShortText10: string;   
    ordHdrCustShortText11: string;   
    ordHdrCustShortText12: string;   
    ordHdrCustShortText13: string;   
    ordHdrCustLongText1: string;   
}

export const ORDENES_KEYS = [
    'ordId',
        'empId',
        'centroId',
        'almId',
        'ordNumber',// Número de onda
        'ordQty',// Cantidad de orden
        'ordestatus', // Estado del pedido P:Pendiente L:Liberado V:Verificado A:Almacenado
        'ordTip', // Tipo Salida / Entrada
        'ordTipDes',//Tipo Salida / Entrada
        'ordClase',//Clase 
        'ordClaseDes',//Clase 
        'ordHdrCustShortText1',//Direccion
        'ordHdrCustShortText2',//Ciudad
        'ordHdrCustShortText3',//Región
        'ordHdrCustShortText4',//Identificación de orden migrado
        'ordHdrCustShortText5',//Estado de la orden
        'ordHdrCustShortText6',//Teléfono
        'ordHdrCustShortText7',//Nombre
        'ordHdrCustShortText8',//Email
        'ordHdrCustShortText9',//Courier
        'ordHdrCustShortText10',//Latitud de la orden
        'ordHdrCustShortText11',// Lomgitud de la orden
        'ordHdrCustShortText12',//Clase de documento
        'ordHdrCustShortText13',//Ruta
        'ordHdrCustLongText1'//Comentarios
    
];
