import { useAuth0 } from '@auth0/auth0-react';

export function Landing() {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-white p-8">
      <h1 className="text-4xl font-bold mb-4">Bienvenido al Sistema Académico</h1>
      <p className="text-lg text-gray-700 mb-8 text-center max-w-xl">
        Gestiona tus alumnos, materias, docentes y calificaciones de forma fácil y segura.
      </p>
      <button
        onClick={() =>
          loginWithRedirect({ appState: { returnTo: '/dashboard' } })
        }
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700 transition"
      >
        Iniciar sesión
      </button>
    </div>
  );
}
