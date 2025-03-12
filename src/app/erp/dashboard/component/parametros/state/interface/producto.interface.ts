


export interface CreateTodo{
    title: string,
    description?: string,
    statusId: number
}

export interface UpdateTodo{
    title?: string,
    description?: string,
    statusId?: number
}

export interface Producto {
    "id": number,
    "cod_pareo":string,
    "descripcion": string,
    "observaciones": string,
    "cod_rapido": string,
    "cod_barra": string,
    "tipo": string,
    "grupo": string,
    "sub_grupo": string,
    "color": string,
    "moneda": string,
    "costo": number,
    "neto": number,
    "bruto": number,
    "medida": string,
    "peso": string,
    "minimo":string,
    "inventariable": string,
    "id_ext": string,
    "url": string,
    "talla": string,
    "created_at": string,
    "updated_at": string
}

export const PRODUCTOS_KEYS: string[] = [
    "id",
    "cod_pareo",
    "descripcion",
    "observaciones",
    "cod_rapido",
    "cod_barra",
    "tipo",
    "grupo",
    "sub_grupo",
    "color",
    "moneda",
    "costo",
    "neto",
    "bruto",
    "medida",
    "peso",
    "minimo",
    "inventariable",
    "id_ext",
    "url",
    "talla",
    "created_at",
    "updated_at"
  ];
  