Sistema de Gestión Académica
Aplicación fullstack para la gestión de alumnos, docentes, materias y boletas. Incluye autenticación con Auth0, backend en Spring Boot y frontend en React + Vite.

Estructura del Proyecto
bash
Copiar
Editar
├── fullstackauth        # Backend en Spring Boot
├── frontend-sistema     # Frontend en React + Vite
└── DumpInstituto.sql    # Dump de la base de datos (MySQL)
 Backend – fullstackauth
Stack:

Java 17 · Spring Boot 3 · Spring Security (OAuth2 / JWT)

Spring Data JPA · MySQL · Lombok · MapStruct

Características:

Autenticación con JWT (Auth0)

Rutas protegidas con @PreAuthorize

Permisos finos: READ:ALUMNOS, WRITE:ALUMNOS, etc.

API RESTful en /api

Frontend – frontend-sistema
Stack:

React 18 · Vite · TypeScript · TailwindCSS

Axios · React Router · Auth0 React SDK

Características:

Login con Auth0

Panel para alumnos, docentes, materias y boletas

Envío de JWT en cada petición protegida

Base de Datos
Motor: MySQL 8+

Importación:

bash
Copiar
Editar
mysql -u root -p < DumpInstituto.sql
Despliegue
Funciona localmente y en entornos como:

Hetzner Cloud

Railway / Render

Asegúrate de configurar correctamente las variables de entorno para:

Auth0 (dominio, client ID, audiencia)

Base de datos (URL, usuario, contraseña)

Entornos dev y prod

Nota sobre usuarios
Este sistema no crea usuarios en Auth0 automáticamente. Para que un alumno use su cuenta:

Debe existir previamente en Auth0 (correo + contraseña).

Debe tener el rol correspondiente (ej. ROL_ALUMNO) con permisos adecuados.

Su auth0Id debe estar vinculado al alumno en la base de datos.

Una mejora futura sería automatizar este proceso desde el backend usando la Management API de Auth0.
