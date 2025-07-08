# Sistema de Gestión Académica

Este proyecto es una aplicación fullstack desarrollada como una prueba técnica para la gestión de alumnos, docentes, materias y boletas. Incluye autenticación con Auth0, un backend robusto en Spring Boot y un frontend moderno en React (Vite).

## Estructura del Proyecto

```
├── fullstackauth        # Backend en Spring Boot
├── frontend-sistema     # Frontend en React + Vite + TypeScript
└── DumpInstituto.sql    # Dump de la base de datos (MySQL)
```

---

## Backend: `fullstackauth`

**Tecnologías usadas:**

* Java 17
* Spring Boot 3.x
* Spring Security (OAuth2 / JWT)
* Spring Data JPA
* MySQL
* Lombok
* MapStruct

**Configuraciones clave:**

* Autenticación con JWT proporcionado por Auth0
* Protección de rutas con anotaciones `@PreAuthorize`
* Control de acceso basado en permisos como `READ:ALUMNOS`, `WRITE:ALUMNOS`, etc.
* Exposición de endpoints RESTful bajo `/api`

## Frontend: `frontend-sistema`

**Tecnologías usadas:**

* React 18
* Vite
* TypeScript
* TailwindCSS
* Auth0 React SDK
* Axios
* React Router DOM

**Características principales:**

* Login mediante Auth0
* Panel de administración de alumnos, docentes, materias y boletas
* Uso de token JWT en todas las peticiones al backend* Protección de rutas según estado de autenticación

## Base de Datos

**Motor:** MySQL 8+

**Archivo Dump:** [`DumpInstituto.sql`](./DumpInstituto.sql)

**Comando para importar:**

```bash
mysql -u root -p < DumpInstituto.sql
```

---

## Despliegue

Este proyecto ha sido probado localmente y puede desplegarse en:

* Hetzner Cloud (servidores VPS)
* Render / Railway (para fines de prueba)

Configura variables de entorno correctamente tanto para el backend como para Auth0 y base de datos.

---
