# Dashboard Widgets - Documentación

## Descripción

Este componente crea widgets de dashboard con efectos visuales modernos y una interfaz que se adapta al tema activo de PrimeNG. Los widgets incluyen:

1. **Widget de Reloj** - Reloj analógico con animaciones suaves
2. **Widget del Clima** - Información meteorológica con pronóstico
3. **Widget de Calendario** - Calendario mensual simplificado
4. **Widget de Indicadores Económicos** - Indicadores financieros con estilo minimalista Apple

## Características

### Efectos Visuales
- **Glassmorphism**: Efecto de cristal con blur y transparencias
- **Animaciones suaves**: Transiciones CSS con cubic-bezier
- **Efectos hover**: Elevación y sombras al pasar el mouse
- **Animaciones de flotación**: Efectos sutiles de movimiento
- **Backdrop filter**: Efectos de desenfoque para profundidad

### Colores y Temas
- **Adaptación automática**: Se adapta al tema activo de PrimeNG
- **Variables CSS**: Usa las variables de color del tema actual
- **Consistencia visual**: Mantiene coherencia con el resto de la aplicación
- **Modo claro/oscuro**: Compatible con ambos modos

### Responsive Design
- **Grid layout**: Adaptable a diferentes tamaños de pantalla
- **Mobile-first**: Optimizado para dispositivos móviles
- **Flexible**: Se adapta al contenido disponible

## Uso

### Componente Principal
```html
<app-dashboard-widgets 
  [indicadoresEconomicos]="indicadoresEconomicos"
  [weatherData]="weatherData"
  [weatherError]="weatherError"
  [isRefreshing]="isRefreshing"
  (refreshIndicators)="onRefreshIndicators()">
</app-dashboard-widgets>
```

### Datos de Entrada

#### Indicadores Económicos
```typescript
indicadoresEconomicos = {
  dolares: [
    {
      label: 'Dólar',
      valor: 950.50,
      cambio: 2.5,
      tendencia: 'up', // 'up' o 'down'
      icono: 'pi pi-dollar'
    }
  ]
};
```

#### Datos del Clima
```typescript
weatherData = {
  temperature: 13,
  location: 'Santiago, Chile',
  description: 'Parcialmente nublado',
  icon: '02d', // Código de icono de OpenWeatherMap
  humidity: 65,
  windSpeed: 12
};
```

## Librerías Utilizadas

### Ya Instaladas (No requiere instalación adicional)
- **PrimeNG**: Componentes de UI
- **PrimeIcons**: Iconos
- **Angular Animations**: Animaciones básicas
- **CSS Grid & Flexbox**: Layout moderno

### Efectos Visuales
- **CSS Custom Properties**: Variables de color
- **CSS Gradients**: Efectos de color
- **CSS Transforms**: Animaciones y transformaciones
- **CSS Filters**: Efectos de blur y sombras
- **CSS Animations**: Animaciones keyframe

## Ventajas de No Instalar Librerías Adicionales

### Pros
1. **Tamaño del bundle**: No aumenta el tamaño de la aplicación
2. **Rendimiento**: Sin dependencias externas pesadas
3. **Compatibilidad**: Funciona con la configuración actual
4. **Mantenimiento**: Menos dependencias que mantener
5. **Control total**: Personalización completa de efectos

### Contras
1. **Limitaciones**: Algunos efectos avanzados requieren más código
2. **Compatibilidad**: Algunos efectos CSS pueden no funcionar en navegadores antiguos
3. **Complejidad**: Más código CSS para mantener

## Personalización

### Colores
Los colores se pueden personalizar modificando las variables SCSS:

```scss
$dark-bg: #1a1a1a;
$widget-bg: #2a2a2a;
$accent-gold: #ffd700;
$accent-blue: #4a90e2;
```

### Animaciones
Las animaciones se pueden ajustar modificando los keyframes:

```scss
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(180deg); }
}
```

### Layout
El layout se puede modificar cambiando el grid:

```scss
.dashboard-widgets-container {
  grid-template-areas: 
    "clock weather"
    "calendar calendar"
    "indicators indicators";
}
```

## Compatibilidad

### Navegadores Soportados
- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

### Características CSS Utilizadas
- CSS Grid
- CSS Flexbox
- CSS Custom Properties
- CSS Backdrop Filter
- CSS Animations
- CSS Transforms

## Implementación

El componente ya está integrado en la configuración de la aplicación. Para verlo en acción, abre la configuración de la aplicación y verás los widgets en la pestaña "Hoy".

## Notas de Rendimiento

- Los efectos de blur pueden impactar el rendimiento en dispositivos de gama baja
- Las animaciones están optimizadas con `will-change` y `transform3d`
- Se recomienda usar `transform` en lugar de propiedades que causan reflow 