import { createAction, props } from "@ngrx/store";
import { Producto } from "../interface/producto.interface";


// Acción para iniciar la obtención de todos los elementos de Productos
export const getProductosRequest = createAction(
    "[Productos] Get Productos Request"  // Identificador del tipo de acción
);

// Acción para indicar la obtención exitosa de todos los elementos de Productos
export const getProductoSuccess = createAction(
    "[Productos] Get Productos Success",  // Identificador del tipo de acción
    props<{ productos: Producto[], colums: any[] }>()    // Carga útil que contiene el array de todos obtenidos
)

// Acción para manejar errores que ocurran durante la obtención de elementos todo
export const productoError = createAction(
    "[Productos] Get Productos Error",    // Identificador del tipo de acción
    props<{ error: string }>()    // Carga útil que contiene el mensaje de error
)

export const createProductoRequest = createAction(
    "[Productos] Create Producto Request",  // Identificador del tipo de acción
    props<{ producto: Producto }>()   // Carga útil que contiene los datos necesarios para crear un nuevo todo
)

// Acción para indicar la creación exitosa de un nuevo elemento todo
export const createProductoSuccess = createAction(
    "[Productos] Create Producto Success"        // Carga útil que contiene el todo creado
)

export const updateProductoRequest = createAction(
    "[Productos] Update Producto Request",  // Identificador del tipo de acción
    props<{ producto: Producto }>()   // Carga útil que contiene los datos necesarios para crear un nuevo todo
)

export const updateProductoSuccess = createAction(
    "[Productos] Update Producto Success"        // Carga útil que contiene el todo creado
)

export const aplicarFiltrosRequest = createAction(
    "[Productos] Aplicar filtros",
    props<{ filtros: any[] }>()
);

 export const aplicarFiltrosSuccess = createAction(
    "[Productos] Aplicar filtros exitosa",
    props<{ productos: Producto[], colums: any[] }>()
);




