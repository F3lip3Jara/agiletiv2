export interface Comuna {
    comId: number;
    comDes: string;
    comCod: string;
    empId: number;
    paiId: number;
    regId: number;
    ciuId: number;
    ciuDes: string;
    created_at: string;
    updated_at: string;
    paiCod: string;
    paiDes: string;
    regCod: string;
    regDes: string;
    // Agrega más propiedades según necesites
}

export const COMUNA_KEYS = [
    'comId',
    'comDes',
    'comCod',
    'empId',
    'paiId',
    'regId',
    'ciuId',
    'ciuDes',
    'created_at',
    'updated_at',
    'paiCod',
    'paiDes',
    'regCod',
    'regDes',
];