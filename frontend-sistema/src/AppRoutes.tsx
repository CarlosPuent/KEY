// src/AppRoutes.tsx
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Landing } from './pages/Landing';       // <-- tu landing público
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import RequireRole from './components/RequireRole';
import AlumnoProfile from './pages/AlumnoProfile';
import Boleta from './pages/Boleta';
import ProfesorNotas from './pages/ProfesorNotas';
import RegistroAc from './pages/RegistroAc';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Página pública de bienvenida / login */}
      <Route path="/" element={<Landing />} />

      {/* Rutas protegidas */}
      <Route element={<ProtectedRoute><Layout/></ProtectedRoute>}>
        <Route path="dashboard" element={<Dashboard />} />

        {/* Alumno */}
        <Route element={<RequireRole role="alumno"><Outlet/></RequireRole>}>
          <Route path="alumno/perfil" element={<AlumnoProfile />} />
          <Route path="alumno/boleta"  element={<Boleta />} />
        </Route>

        {/* Profesor */}
        <Route element={<RequireRole role="profesor"><Outlet/></RequireRole>}>
          <Route path="profesor/notas" element={<ProfesorNotas />} />
        </Route>

        {/* Registro académico */}
        <Route element={<RequireRole role="registroAcademico"><Outlet/></RequireRole>}>
          <Route path="registro/*" element={<RegistroAc />} />
        </Route>

        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
