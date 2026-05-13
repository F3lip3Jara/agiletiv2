export interface Empresa {
    empId: number,
    empDes: string,
    empDir: string,
    empRut: string,
    empGiro: string,
    empFono: string,
    empTokenOMS: string,
    empTiempoIdle?: number,
    empTiempoTimeout?: number,
    empTiempoExpiracionToken?: number,
    empZonaHoraria?: string,
}

export const EMPRESA_KEYS = [
    "empId",
    "empDes",
    "empDir",
    "empRut",
    "empGiro",
    "empFono",
    "empTokenOMS",
    "empTiempoIdle",
    "empTiempoTimeout",
    "empTiempoExpiracionToken",
    "empZonaHoraria"
];
