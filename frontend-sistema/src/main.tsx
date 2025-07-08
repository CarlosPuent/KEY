// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import AppRoutes from './AppRoutes';

const domain   = import.meta.env.VITE_AUTH0_DOMAIN!;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID!;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE!;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/dashboard`,
        audience,
        scope: [
          'openid',
          'profile',
          'email',
          'offline_access',
          'read:alumnos',
          'write:alumnos',
          'delete:alumnos',
          'read:materias',
          'write:materias',
          'delete:materias',
          'read:docentes',
          'write:docentes',
          'delete:docentes',
          'read:alumno_materias',
          'write:alumno_materias',
          'delete:alumno_materias'
        ].join(' ')
      }}
      useRefreshTokens
      cacheLocation="localstorage"
    >
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Auth0Provider>
  </React.StrictMode>
);
