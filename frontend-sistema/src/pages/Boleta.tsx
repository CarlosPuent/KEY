import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import api, { setAuthToken } from '../services/api'; // Ajusta la ruta si es necesario
import axios from 'axios';

interface BoletaResponse {
  id: string;
  materiaNombre: string;
  notaFinal: number;
}

export default function Boleta() {
  const {
    getAccessTokenSilently,
    isAuthenticated,
    isLoading: authLoading
  } = useAuth0();

  const [items, setItems] = useState<BoletaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBoleta = async () => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE! }
      });
      setAuthToken(token);
      const res = await api.get<BoletaResponse[]>('/alumno-materias/me/boleta');
      setItems(res.data);
      setError('');
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const msg = typeof e.response?.data?.message === 'string'
          ? e.response.data.message
          : `Error ${e.response?.status} al cargar la boleta.`;
        setError(msg);
      } else {
        setError('Error inesperado al cargar la boleta.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBoleta();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  if (authLoading || loading) {
    return <p className="text-center py-8">Cargando boleta…</p>;
  }
  if (error) {
    return <p className="text-red-600 text-center py-8">{error}</p>;
  }
  if (items.length === 0) {
    return <p className="text-center py-8">No hay calificaciones disponibles.</p>;
  }

  const promedio = (
    items.reduce((sum, i) => sum + i.notaFinal, 0) / items.length
  ).toFixed(2);

  return (
    <section className="max-w-3xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8">
      <h2 className="text-2xl font-semibold text-gray-800 text-center">
        Boleta de Notas
      </h2>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-600">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-white uppercase">
                Materia
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-white uppercase">
                Nota Final
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-700">
                  {item.materiaNombre}
                </td>
                <td className="px-4 py-2 text-sm font-medium text-gray-800">
                  {item.notaFinal.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-right text-lg font-semibold text-gray-800">
        Promedio: <span className="text-indigo-600">{promedio}</span>
      </p>
    </section>
  );
}
