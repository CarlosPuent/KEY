import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { FiMenu, FiHome, FiBook, FiUser, FiLogOut } from 'react-icons/fi';

const ROLES_NAMESPACE = 'https://fullstackauth.com/roles';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const { user, logout } = useAuth0();
  const navigate = useNavigate();
  const roles: string[] = (user?.[ROLES_NAMESPACE] as string[]) || [];

  const items = [
    { to: '/dashboard',      label: 'Dashboard',      icon: <FiHome />, roles: ['alumno','profesor','registroAcademico'] },
    { to: '/alumno/boleta',  label: 'Mi Boleta',      icon: <FiBook />, roles: ['alumno'] },
    { to: '/alumno/perfil',  label: 'Mi Perfil',      icon: <FiUser />, roles: ['alumno'] },
    { to: '/profesor/notas', label: 'Calificaciones', icon: <FiBook />, roles: ['profesor'] },
    { to: '/registro',       label: 'Registro Acad.', icon: <FiUser />, roles: ['registroAcademico'] },
  ];

  return (
    <aside
      className={`
        ${isOpen ? 'w-56' : 'w-16'}
        bg-gray-800 text-gray-100
        flex flex-col justify-between
        h-screen
        transition-width duration-300
        shadow-lg
      `}
    >
      {/* Top: Logo + Toggle */}
      <div className="flex items-center justify-between px-4 py-3">
        {isOpen && <span className="text-xl font-bold">Mi Instituto</span>}
        <button
          onClick={() => setIsOpen(o => !o)}
          aria-label="Toggle sidebar"
          className="p-1 rounded hover:bg-gray-700 focus:outline-none focus:ring"
        >
          <FiMenu size={24} />
        </button>
      </div>

      {/* Navegación con espacio superior */}
      <nav className="flex-1 px-2 space-y-1 mt-6">
        {items.map(item =>
          roles.some(r => item.roles.includes(r)) && (
            <NavLink
              key={item.to}
              to={item.to}
              title={!isOpen ? item.label : undefined}
              className={({ isActive }) => `
                flex items-center
                py-2 px-3
                rounded-md
                transition
                ${isActive
                  ? 'bg-white text-gray-800'
                  : 'hover:bg-gray-700'}
              `}
            >
              <span className="w-6 h-6 flex items-center justify-center">
                {item.icon}
              </span>
              {isOpen && <span className="ml-3">{item.label}</span>}
            </NavLink>
          )
        )}
      </nav>

      {/* Logout */}
      <div className="px-2 pb-4">
        <button
          onClick={() => {
            logout({ logoutParams: { returnTo: window.location.origin } });
            navigate('/');
          }}
          className="w-full flex items-center py-2 px-3 bg-red-600 hover:bg-red-700 rounded-md transition focus:outline-none focus:ring"
          title={!isOpen ? 'Cerrar sesión' : undefined}
        >
          <FiLogOut size={20} />
          {isOpen && <span className="ml-3">Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
}
