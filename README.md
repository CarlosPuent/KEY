# Sistema de Gestión Académica

Este proyecto es una aplicación fullstack desarrollada como una prueba técnica para la gestión de alumnos, docentes, materias y boletas. Incluye autenticación con Auth0, un backend robusto en Spring Boot y un frontend moderno en React (Vite).

## Estructura del Proyecto

\`\`\`
├── fullstackauth        # Backend en Spring Boot
├── frontend-sistema     # Frontend en React + Vite + TypeScript
└── DumpInstituto.sql    # Dump de la base de datos (MySQL)
\`\`\`

---

## Backend: \`fullstackauth\`

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
* Protección de rutas con anotaciones \`@PreAuthorize\`
* Control de acceso basado en permisos como \`READ:ALUMNOS\`, \`WRITE:ALUMNOS\`, etc.
* Exposición de endpoints RESTful bajo \`/api\`

## Frontend: \`frontend-sistema\`

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
* Uso de token JWT en todas las peticiones al backend
* Protección de rutas según estado de autenticación

##  Base de Datos

**Motor:** MySQL 8+

**Importación:**

\`\`\`bash
mysql -u root -p < DumpInstituto.sql
\`\`\`

---

## Despliegue

Funciona localmente y en entornos como:

- Hetzner Cloud  
- Railway / Render

Asegúrate de configurar correctamente las variables de entorno para:

- Auth0 (dominio, client ID, audiencia)  
- Base de datos (URL, usuario, contraseña)  
- Entornos \`dev\` y \`prod\`

---

## 📝 Nota sobre usuarios

Este sistema **no crea usuarios en Auth0 automáticamente**. Para que un alumno use su cuenta:

1. Debe existir previamente en Auth0 (correo + contraseña).
2. Debe tener el rol correspondiente (ej. \`ROL_ALUMNO\`) con permisos adecuados.
3. Su \`auth0Id\` debe estar vinculado al alumno en la base de datos (\`auth0|...\`).

Una futura mejora podría ser crear usuarios desde backend usando la [Auth0 Management API](https://auth0.com/docs/api/management/v2).
