# Importación de Ubicaciones por Excel

## Formato Requerido

El archivo Excel debe contener las siguientes columnas en el orden especificado:

| Columna | Descripción | Tipo | Obligatorio | Ejemplo |
|---------|-------------|------|-------------|---------|
| Sector | Nombre del sector | Texto | Sí | "Sector A" |
| Ubicación | Código de la ubicación | Texto | Sí | "U001" |
| Activo | Estado de la ubicación | Número | Sí | 1 (activo) / 0 (inactivo) |
| cm3 | Volumen en centímetros cúbicos | Número | No | 1000 |
| Alto | Altura en centímetros | Número | No | 10 |
| Ancho | Ancho en centímetros | Número | No | 10 |
| Largo | Largo en centímetros | Número | No | 10 |

## Ejemplo de Datos

```
Sector    | Ubicación | Activo | cm3   | Alto | Ancho | Largo
----------|-----------|--------|-------|------|-------|-------
Sector A  | U001      | 1      | 1000  | 10   | 10    | 10
Sector A  | U002      | 1      | 2000  | 20   | 10    | 10
Sector B  | U003      | 0      | 1500  | 15   | 10    | 10
Sector B  | U004      | 1      | 3000  | 30   | 10    | 10
```

## Reglas de Validación

1. **Sector**: Debe existir en el sistema
2. **Ubicación**: Código único dentro del sector
3. **Activo**: Solo valores 0 o 1
4. **Dimensiones**: Valores numéricos positivos (opcionales)
5. **Volumen**: Valor numérico positivo (opcional)

## Proceso de Importación

1. Hacer clic en "Importar Ubicaciones"
2. Seleccionar archivo Excel (.xlsx o .xls)
3. El sistema validará el formato
4. Se mostrarán errores si los hay
5. Las ubicaciones válidas se agregarán al sector correspondiente

## Notas Importantes

- El archivo debe estar en formato Excel (.xlsx o .xls)
- Tamaño máximo: 1MB
- Las ubicaciones se crearán automáticamente bajo el sector especificado
- Si una ubicación ya existe, se actualizará con los nuevos datos
- Los sectores que no existan serán ignorados 