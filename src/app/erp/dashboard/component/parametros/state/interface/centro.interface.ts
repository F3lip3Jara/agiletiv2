export interface Centro {
    centroId: number;
    empId: number;
    cenDes: string;
    cenDir: string;
    cenPlace: string;
    cenCap: number;
    created_at: string;
    updated_at: string;
    cenContacto: string;
    centEmail: string;
    cenHoraApertura: string;
    cenHoraCierre: string;
    cenStockLimitWeb: string;
    cenStockLimiteRepo: string;
    cenEstado: string;
    cenTelefono: string;
    cenLat: string;
    cenLong: string;
    cenDiasLaborales: string[];
    // Agrega más propiedades según necesites
}

export const CENTRO_KEYS = [
        "centroId",
        "empId",
        "cenDes",
        "cenDir",
        "cenPlace",
        "cenCap",
        "created_at",
        "updated_at",
        "cenContacto",
        "centEmail",
        "cenHoraApertura",
        "cenHoraCierre",
        "cenStockLimitWeb",
        "cenStockLimiteRepo",
        "cenEstado",
        "cenTelefono",
        "cenLat",
        "cenLong"
    // Agrega más keys según necesites
];
