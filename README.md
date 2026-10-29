# AutoAndes Frontend

Aplicación SPA para operaciones del taller AutoAndes. Construida con Angular 22, componentes standalone y rutas con carga diferida.

## Requisitos y ejecución

- Node.js 20.19+ (probado con Node 24).
- Backend AutoAndes activo en `http://localhost:8080` y Oracle configurado en el backend.

En PowerShell, desde esta carpeta:

```powershell
npm.cmd install
ng.cmd serve
```

La aplicación se abre en `http://localhost:4200`. La URL de la API está en `src/environments/environment.ts`.

## Pruebas y compilación

```powershell
ng.cmd test --no-watch
ng.cmd build
```

## Funcionalidad

- Inicio de sesión JWT; token y vencimiento se mantienen en `sessionStorage` y la sesión se cierra al vencer.
- Interceptor de autenticación limitado a la API; un `401` cierra la sesión (salvo en login), mientras que un `403` mantiene la sesión.
- Guards de autenticación, invitado y permiso; menú y acciones visibles según permisos.
- CRUD de Servicios y Vehículos, con clientes cargados desde el backend y errores de validación mostrados en los campos.
- Registro de órdenes con líneas dinámicas, cantidad de 1 a 5, servicio no repetido y cálculo visual de subtotales/total. El servidor vuelve a calcular importes con el catálogo.
- Consulta de órdenes con filtros, detalle, anulación con motivo y reporte de ingresos por servicio.

Para las credenciales iniciales y los datos de Oracle, consulta el README del backend.
