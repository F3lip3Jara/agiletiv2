# 🚀 Agileti - Sistema Integral de Gestión Empresarial

## 📋 Descripción General

**Agileti** es un sistema integral de gestión empresarial (ERP) moderno y completo que combina tecnologías web, móviles y de integración para ofrecer una solución completa para la gestión de empresas. El sistema está diseñado con una arquitectura modular que incluye frontend Angular, backend Laravel, aplicación móvil Ionic/Capacitor y integración con WooCommerce.

## 🏗️ Arquitectura del Sistema

### Frontend Web (Angular 17)
- **Framework**: Angular 17 con TypeScript
- **UI Components**: PrimeNG 17 + PrimeFlex
- **State Management**: NgRx Store
- **Charts**: Chart.js con integración nativa
- **Maps**: Google Maps API
- **Calendar**: FullCalendar 6
- **PDF Generation**: jsPDF con AutoTable
- **Excel**: XLSX para importación/exportación

### Backend API (Laravel 12)
- **Framework**: Laravel 12 con PHP 8.2+
- **Base de Datos**: MySQL/PostgreSQL/SQLite
- **PDF Generation**: DomPDF
- **Barcode Generation**: Milon Barcode + Picqer
- **Monitoring**: Laravel Telescope
- **MCP Server**: Laravel MCP Server para integración

### Aplicación Móvil (Ionic 8 + Capacitor 6)
- **Framework**: Ionic 8 con Angular 18
- **Capacitor**: 6.2.0 para funcionalidades nativas
- **Barcode Scanner**: Escáner de códigos de barras
- **Camera**: Captura de imágenes
- **Haptics**: Retroalimentación táctil
- **Status Bar**: Control de barra de estado

### Plugin WooCommerce
- **Integración**: Plugin nativo de WordPress
- **Funcionalidades**: Filtros avanzados, checkout directo
- **Carousel**: Mejoras en carrusel de productos

## 🎯 Módulos Principales

### 1. 🏠 Dashboard Principal
- **Widgets Inteligentes**: Reloj digital, clima, calendario, indicadores económicos
- **Gráficos Interactivos**: Chart.js con temas adaptativos (claro/oscuro)
- **Responsive Design**: Adaptable a todos los dispositivos
- **Temas**: Soporte completo para modo claro y oscuro

### 2. 🏭 Sistema WMS (Warehouse Management)
- **Gestión de Almacenes**: Control completo de inventarios
- **Gráficos de Stock**: Visualización de over/under stocks
- **Capacidad Diaria**: Seguimiento de entradas y salidas
- **Actividades Recientes**: Log de movimientos en tiempo real
- **Filtros Avanzados**: Por cantidad, pool, tipo de stock
- **Tablas Interactivas**: Con ordenamiento, paginación y búsqueda
- **Modo Oscuro**: Compatibilidad completa con temas oscuros

### 3. 🔐 Sistema de Seguridad
- **Autenticación**: Sistema robusto de login/logout
- **Autorización**: Control de acceso basado en roles
- **Interceptores**: Middleware de seguridad
- **Validadores**: Validación de datos en frontend y backend

### 4. ⚙️ Gestión de Parámetros
- **Configuración del Sistema**: Parámetros globales configurables
- **Gestión de Usuarios**: Administración de usuarios y permisos
- **Configuración de Empresa**: Datos empresariales y configuración

### 5. 🏭 Módulo de Producción
- **Planificación**: Gestión de órdenes de producción
- **Seguimiento**: Control de procesos productivos
- **Reportes**: Informes de producción y rendimiento

### 6. 📊 Módulo de Ventas
- **Gestión de Clientes**: Base de datos de clientes
- **Órdenes de Venta**: Procesamiento de ventas
- **Facturación**: Generación de facturas y documentos

### 7. 🛒 Integración WooCommerce
- **Sincronización**: Productos, órdenes y clientes
- **Webhooks**: Notificaciones en tiempo real
- **API REST**: Comunicación bidireccional
- **Plugin Personalizado**: Filtros y checkout mejorado

### 8. 📱 Aplicación Móvil PDA
- **Escaneo de Códigos**: Lectura de códigos de barras/QR
- **Captura de Imágenes**: Fotos de productos y documentos
- **Sincronización Offline**: Funcionalidad sin conexión
- **Interfaz Nativa**: Experiencia móvil optimizada

## 🚀 Características Técnicas

### Frontend Web
- **Angular 17**: Framework moderno con standalone components
- **PrimeNG 17**: Componentes UI profesionales
- **PrimeFlex**: Sistema de grid y utilidades CSS
- **NgRx**: Gestión de estado reactiva
- **Chart.js**: Gráficos interactivos y responsivos
- **Google Maps**: Integración de mapas
- **FullCalendar**: Calendario completo con eventos
- **jsPDF**: Generación de PDFs
- **XLSX**: Manejo de archivos Excel

### Backend API
- **Laravel 12**: Framework PHP moderno
- **PHP 8.2+**: Última versión estable
- **Eloquent ORM**: ORM elegante y potente
- **Migrations**: Control de versiones de base de datos
- **Seeders**: Datos de prueba y inicialización
- **API Resources**: Transformación de datos
- **Validation**: Validación robusta de datos
- **Authentication**: Sistema de autenticación completo

### Aplicación Móvil
- **Ionic 8**: Framework híbrido moderno
- **Capacitor 6**: Funcionalidades nativas
- **Angular 18**: Framework base
- **Barcode Scanner**: Escaneo de códigos
- **Camera API**: Captura de imágenes
- **Haptics**: Retroalimentación táctil
- **Status Bar**: Control de interfaz nativa

### Integración WooCommerce
- **Plugin WordPress**: Integración nativa
- **Webhooks**: Comunicación en tiempo real
- **REST API**: API completa de WooCommerce
- **Filtros Avanzados**: Búsqueda y filtrado mejorado
- **Checkout Directo**: Proceso de compra optimizado

## 🎨 Temas y Personalización

### Sistema de Temas
- **Modo Claro**: Tema claro optimizado para uso diurno
- **Modo Oscuro**: Tema oscuro para uso nocturno
- **Temas Personalizados**: Múltiples variantes de color
- **Variables CSS**: Sistema de variables para personalización
- **Adaptación Automática**: Cambio automático según preferencias

### Componentes Adaptativos
- **PrimeNG Components**: Todos los componentes adaptados a temas
- **Gráficos**: Chart.js con colores adaptativos
- **Tablas**: Estilos consistentes en todos los temas
- **Formularios**: Campos y botones adaptativos
- **Navegación**: Menús y breadcrumbs temáticos

## 📱 Responsive Design

### Breakpoints
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: 320px - 767px

### Características
- **Mobile-First**: Diseño optimizado para móviles
- **Grid System**: Sistema de grid flexible
- **Flexbox**: Layout moderno y adaptable
- **CSS Grid**: Sistema de grid avanzado
- **Touch-Friendly**: Interfaz optimizada para touch

## 🔧 Instalación y Configuración

### Requisitos del Sistema

#### Frontend Web
```bash
Node.js >= 18.0.0
npm >= 9.0.0
Angular CLI >= 17.0.0
```

#### Backend API
```bash
PHP >= 8.2
Composer >= 2.0
MySQL >= 8.0 / PostgreSQL >= 13 / SQLite >= 3.35
```

#### Aplicación Móvil
```bash
Node.js >= 18.0.0
npm >= 9.0.0
Ionic CLI >= 8.0.0
Android Studio / Xcode
```

### Instalación Frontend Web

```bash
# Clonar repositorio
git clone https://github.com/agileticl/agileti.git
cd agileti

# Instalar dependencias
npm install

# Configurar variables de entorno
cp src/environments/environment.ts.example src/environments/environment.ts

# Iniciar servidor de desarrollo
npm start

# Construir para producción
npm run build
```

### Instalación Backend API

```bash
# Navegar al directorio backend
cd back-agileti

# Instalar dependencias
composer install

# Configurar archivo .env
cp .env.example .env

# Generar clave de aplicación
php artisan key:generate

# Ejecutar migraciones
php artisan migrate

# Iniciar servidor
php artisan serve
```

### Instalación Aplicación Móvil

```bash
# Navegar al directorio de la app móvil
cd app-pda

# Instalar dependencias
npm install

# Configurar Capacitor
npx cap init

# Agregar plataformas
npx cap add android
npx cap add ios

# Sincronizar
npx cap sync

# Abrir en Android Studio / Xcode
npx cap open android
npx cap open ios
```

### Instalación Plugin WooCommerce

```bash
# Copiar plugin al directorio de WordPress
cp -r plugin_agileti_woo /wp-content/plugins/

# Activar desde el panel de administración de WordPress
# Ir a Plugins > Installed Plugins > Activar "Agileti - Filtros - CheckOut"
```

## 🌐 Configuración de Entorno

### Variables de Entorno Frontend

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api',
  googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
  weatherApiKey: 'YOUR_WEATHER_API_KEY'
};
```

### Variables de Entorno Backend

```env
# .env
APP_NAME=Agileti
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=agileti
DB_USERNAME=root
DB_PASSWORD=

WOOCOMMERCE_URL=https://tu-tienda.com
WOOCOMMERCE_CONSUMER_KEY=ck_...
WOOCOMMERCE_CONSUMER_SECRET=cs_...
```

## 📊 Base de Datos

### Estructura Principal
- **Users**: Usuarios del sistema
- **Companies**: Empresas y configuraciones
- **Products**: Catálogo de productos
- **Orders**: Órdenes y pedidos
- **Warehouses**: Gestión de almacenes
- **Inventory**: Control de inventarios
- **Customers**: Base de datos de clientes
- **Suppliers**: Proveedores y suministros

### Migraciones
```bash
# Crear nueva migración
php artisan make:migration create_table_name

# Ejecutar migraciones
php artisan migrate

# Revertir migraciones
php artisan migrate:rollback

# Refrescar base de datos
php artisan migrate:fresh --seed
```

## 🧪 Testing

### Frontend Testing
```bash
# Ejecutar tests unitarios
npm test

# Ejecutar tests e2e
npm run e2e

# Linting
npm run lint
```

### Backend Testing
```bash
# Ejecutar tests PHPUnit
php artisan test

# Tests con coverage
php artisan test --coverage

# Tests específicos
php artisan test --filter=UserTest
```

## 🚀 Despliegue

### Frontend (Producción)
```bash
# Construir para producción
npm run build

# Servir archivos estáticos
# Usar nginx, Apache o CDN
```

### Backend (Producción)
```bash
# Optimizar para producción
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Configurar supervisor para queues
# Configurar cron para tareas programadas
```

### Aplicación Móvil
```bash
# Construir APK
ionic capacitor build android --prod

# Construir IPA
ionic capacitor build ios --prod

# Publicar en stores
# Google Play Store / Apple App Store
```

## 🔌 APIs y Webhooks

### Endpoints Principales
- `POST /api/auth/login` - Autenticación
- `GET /api/dashboard/stats` - Estadísticas del dashboard
- `GET /api/warehouse/items` - Items del almacén
- `POST /api/orders/create` - Crear orden
- `GET /api/products` - Lista de productos

### Webhooks WooCommerce
- `POST /webhooks/woocommerce/product/created` - Producto creado
- `POST /webhooks/woocommerce/order/created` - Orden creada
- `POST /webhooks/woocommerce/customer/created` - Cliente creado

## 📈 Monitoreo y Logs

### Laravel Telescope
- **Debugging**: Monitoreo de requests, queries, logs
- **Performance**: Métricas de rendimiento
- **Errors**: Captura de errores y excepciones
- **Queue Monitoring**: Monitoreo de colas de trabajo

### Logs del Sistema
```bash
# Ver logs en tiempo real
tail -f storage/logs/laravel.log

# Logs de aplicación
php artisan tail

# Logs de queue
php artisan queue:work --verbose
```

## 🔒 Seguridad

### Autenticación
- **JWT Tokens**: Autenticación stateless
- **Refresh Tokens**: Renovación automática
- **Rate Limiting**: Limitación de requests
- **CORS**: Configuración de cross-origin

### Autorización
- **Roles y Permisos**: Sistema granular de permisos
- **Middleware**: Filtros de acceso
- **Policies**: Políticas de autorización
- **Gates**: Puertas de acceso condicionales

## 📱 Características Móviles

### Funcionalidades Nativas
- **Barcode Scanner**: Escaneo de códigos de barras/QR
- **Camera**: Captura de imágenes
- **Haptics**: Retroalimentación táctil
- **Status Bar**: Control de barra de estado
- **Keyboard**: Manejo de teclado virtual
- **App**: Control de ciclo de vida de la app

### Capacidades Offline
- **Cache Local**: Almacenamiento local de datos
- **Sync Offline**: Sincronización cuando hay conexión
- **Queue Local**: Cola de tareas offline
- **Data Persistence**: Persistencia de datos locales

## 🎨 Personalización y Temas

### Sistema de Temas
- **Temas Predefinidos**: Lara, Bootstrap4, MD, Arya
- **Variantes de Color**: Blue, Purple, Teal, Indigo
- **Modo Oscuro**: Soporte completo para tema oscuro
- **Variables CSS**: Sistema de variables personalizables

### Componentes Personalizables
- **Dashboard Widgets**: Widgets configurables
- **Gráficos**: Colores y estilos adaptativos
- **Tablas**: Estilos y comportamientos personalizables
- **Formularios**: Validaciones y estilos personalizados

## 🔄 Integración y Sincronización

### WooCommerce
- **Productos**: Sincronización bidireccional
- **Órdenes**: Procesamiento automático
- **Clientes**: Base de datos unificada
- **Inventario**: Control centralizado

### APIs Externas
- **Google Maps**: Integración de mapas
- **Weather API**: Datos meteorológicos
- **Economic Indicators**: Indicadores económicos
- **Payment Gateways**: Pasarelas de pago

## 📊 Reportes y Analytics

### Dashboard Analytics
- **Métricas en Tiempo Real**: KPIs actualizados
- **Gráficos Interactivos**: Visualizaciones dinámicas
- **Filtros Avanzados**: Análisis segmentado
- **Exportación**: PDF, Excel, CSV

### Reportes del Sistema
- **Ventas**: Reportes de ventas y rendimiento
- **Inventario**: Estado de stocks y movimientos
- **Producción**: Eficiencia y planificación
- **Financiero**: Estados financieros y análisis

## 🚀 Performance y Optimización

### Frontend
- **Lazy Loading**: Carga diferida de módulos
- **Code Splitting**: División de código
- **Tree Shaking**: Eliminación de código no usado
- **Service Workers**: Cache y offline

### Backend
- **Query Optimization**: Optimización de consultas
- **Cache System**: Sistema de cache múltiple
- **Queue System**: Procesamiento asíncrono
- **Database Indexing**: Índices optimizados

## 🛠️ Herramientas de Desarrollo

### Scripts de Automatización
- **PowerShell Scripts**: Automatización en Windows
- **Component Generation**: Generación automática de componentes
- **Feature Creation**: Creación de módulos completos
- **Build Automation**: Automatización de builds

### Herramientas de Calidad
- **ESLint**: Linting de código
- **Prettier**: Formateo de código
- **PHP CS Fixer**: Estándares de código PHP
- **PHPUnit**: Testing unitario

## 📚 Documentación Adicional

### Archivos de Documentación
- `CHANGELOG.md` - Historial de cambios
- `LICENSE.md` - Licencia del proyecto
- `DARK_MODE_README.md` - Guía de modo oscuro
- `README_DASHBOARD_WIDGETS.md` - Documentación de widgets

### Recursos de Desarrollo
- **Angular Documentation**: https://angular.io/docs
- **Laravel Documentation**: https://laravel.com/docs
- **Ionic Documentation**: https://ionicframework.com/docs
- **PrimeNG Documentation**: https://primeng.org/

## 🤝 Contribución

### Cómo Contribuir
1. **Fork** del proyecto
2. **Crear** rama para feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Pull Request** con descripción detallada

### Estándares de Código
- **TypeScript**: Para frontend Angular
- **PHP PSR-12**: Para backend Laravel
- **ESLint**: Para JavaScript/TypeScript
- **PHP CS Fixer**: Para PHP

## 📄 Licencia

Este proyecto está licenciado bajo la **Licencia MIT**. Ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## 📞 Contacto y Soporte

### Información de Contacto
- **Email**: felipe.andres.j@agileticl.com
- **Website**: https://agileticl.com/
- **Soporte**: Soporte técnico disponible

### Comunidad
- **Issues**: Reportar bugs y solicitar features
- **Discussions**: Discusiones sobre el proyecto
- **Wiki**: Documentación colaborativa
- **Releases**: Notas de lanzamiento

---

## 🎉 ¡Gracias por usar Agileti!

**Agileti** es un sistema moderno y completo que combina las mejores tecnologías para ofrecer una solución empresarial robusta y escalable. Esperamos que esta herramienta impulse el crecimiento y la eficiencia de tu empresa.

**⭐ Si te gusta el proyecto, no olvides darle una estrella en GitHub!**