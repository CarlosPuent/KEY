import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import api, { setAuthToken } from '../services/api'; // Asegúrate que la ruta sea correcta
import axios from 'axios';

interface ApiAlumno {
  id?: string;
  idAlumno?: string;
  nombres: string;
  apellidos: string;
  fechaIngreso: string;
  direccion: string;
  telefono: string;
}

interface Alumno {
  id: string;
  nombres: string;
  apellidos: string;
  fechaIngreso: string;
  direccion: string;
  telefono: string;
}

export default function AlumnoProfile() {
  const { getAccessTokenSilently, isAuthenticated, isLoading: authLoading } = useAuth0();
  const [alumno, setAlumno] = useState<Alumno | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');

  const injectToken = async () => {
    const token = await getAccessTokenSilently({
      authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE! }
    });
    setAuthToken(token);
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    (async () => {
      setError('');
      try {
        await injectToken();
        const res = await api.get<ApiAlumno>('/alumnos/me');
        const data = res.data;
        const id = data.id ?? data.idAlumno ?? '';
        setAlumno({
          id,
          nombres: data.nombres,
          apellidos: data.apellidos,
          fechaIngreso: data.fechaIngreso,
          direccion: data.direccion,
          telefono: data.telefono
        });
        setDireccion(data.direccion);
        setTelefono(data.telefono);
      } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
          const msg = e.response?.data?.message as string;
          setError(msg || `Error ${e.response?.status} al cargar datos.`);
        } else {
          setError('Error inesperado al cargar los datos.');
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [getAccessTokenSilently, isAuthenticated]);

  const handleSave = async () => {
    if (!alumno) return;
    setError('');
    try {
      await injectToken();
      await api.put(`/alumnos/${alumno.id}`, {
        ...alumno,
        direccion,
        telefono
      });
      setAlumno({ ...alumno, direccion, telefono });
      setEditMode(false);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const msg = (e.response?.data?.message as string) ||
                    `Error ${e.response?.status} al guardar los cambios.`;
        setError(msg);
      } else {
        setError('Error inesperado al guardar los cambios.');
      }
    }
  };

  if (authLoading || loading) {
    return <p className="text-center py-8">Cargando datos…</p>;
  }
  if (error) {
    return <p className="text-red-600 text-center py-8">{error}</p>;
  }
  if (!alumno) {
    return <p className="text-center py-8">Alumno no encontrado.</p>;
  }

  return (
    <section className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Mi Perfil</h2>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Nombre</p>
            <p className="font-medium text-gray-800">
              {alumno.nombres} {alumno.apellidos}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Fecha de Ingreso</p>
            <p className="font-medium text-gray-800">{alumno.fechaIngreso}</p>
          </div>
        </div>

        {editMode ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Dirección</label>
                <input
                  type="text"
                  value={direccion}
                  onChange={e => setDireccion(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2
                             focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                <input
                  type="text"
                  value={telefono}
                  onChange={e => setTelefono(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2
                             focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
              <button
                onClick={handleSave}
                className="w-full sm:w-auto bg-green-600 text-white px-5 py-2 rounded-md
                           hover:bg-green-700 transition"
              >
                Guardar
              </button>
              <button
                onClick={() => { setEditMode(false); setError(''); }}
                className="w-full sm:w-auto bg-gray-200 text-gray-700 px-5 py-2 rounded-md
                           hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Dirección</p>
              <p className="font-medium text-gray-800">{alumno.direccion}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Teléfono</p>
              <p className="font-medium text-gray-800">{alumno.telefono}</p>
            </div>
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Editar
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
