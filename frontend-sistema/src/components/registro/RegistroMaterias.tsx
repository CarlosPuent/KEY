import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import api, { setAuthToken } from '../../services/api';
import axios from 'axios';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

interface ApiMateria {
  idMateria?: string;
  nombreMateria: string;
}

interface Materia {
  id: string;
  nombreMateria: string;
}

type MateriaForm = Omit<Materia, 'id'>;

const emptyForm: MateriaForm = {
  nombreMateria: ''
};

export default function RegistroMaterias() {
  const { getAccessTokenSilently } = useAuth0();
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<Materia | null>(null);
  const [form, setForm] = useState<MateriaForm>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // inyecta el token
  const injectToken = async () => {
    const token = await getAccessTokenSilently({
      authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE! }
    });
    setAuthToken(token);
  };

  const fetchMaterias = async () => {
    try {
      await injectToken();
      const res = await api.get<ApiMateria[]>('/materias');
      const list = res.data
        .map(m => ({
          id: m.idMateria ?? '',
          nombreMateria: m.nombreMateria
        }))
        .filter(m => m.id);
      setMaterias(list);
      setError('');
    } catch (err) {
      console.error('fetchMaterias error:', err);
      setError('No se pudieron cargar las materias.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterias();
  }, [getAccessTokenSilently]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await injectToken();
      const payload = { nombreMateria: form.nombreMateria };
      if (editing?.id) {
        await api.put(`/materias/${editing.id}`, payload);
      } else {
        await api.post('/materias', payload);
      }
      await fetchMaterias();
      setEditing(null);
      setForm(emptyForm);
    } catch (unknownError: unknown) {
      if (axios.isAxiosError(unknownError)) {
        const status = unknownError.response?.status;
        const data = unknownError.response?.data;
        console.error('PUT/POST /materias error:', { status, data });
        const backendMsg =
          typeof data?.message === 'string' ? data.message : JSON.stringify(data);
        setError(backendMsg || `Error ${status} al guardar la materia.`);
      } else {
        console.error('handleSubmit unexpected error:', unknownError);
        setError('Error inesperado al guardar la materia.');
      }
    }
  };

  const startEdit = (m: Materia) => {
    setEditing(m);
    setForm({ nombreMateria: m.nombreMateria });
  };

  const requestDelete = (id: string) => setDeleteId(id);
  const cancelDelete = () => setDeleteId(null);

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await injectToken();
      await api.delete(`/materias/${deleteId}`);
      setMaterias(prev => prev.filter(m => m.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error('handleDelete error:', err);
      setError('No se pudo eliminar la materia.');
      setDeleteId(null);
    }
  };

  if (loading) return <p className="text-center py-8">Cargando materias…</p>;
  if (error)   return <p className="text-red-600 text-center py-8">{error}</p>;

  return (
    <section className="space-y-8">
      {/* Formulario */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-700 mb-4">
          {editing ? 'Editar Materia' : 'Agregar Materia'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {editing && (
            <div className="col-span-full text-sm text-gray-500">
              Editando ID: {editing.id}
            </div>
          )}
          <input
            type="text"
            placeholder="Nombre de la materia"
            value={form.nombreMateria}
            onChange={e => setForm(f => ({ ...f, nombreMateria: e.target.value }))}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <div className="col-span-full flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 mt-2">
            <button
              type="submit"
              className="w-full sm:w-auto bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition"
            >
              {editing ? 'Actualizar' : 'Crear'}
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => { setEditing(null); setForm(emptyForm); }}
                className="w-full sm:w-auto bg-gray-200 text-gray-700 px-5 py-2 rounded-md hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Tabla */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Materia','Acciones'].map(th => (
                <th
                  key={th}
                  className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase"
                >
                  {th}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {materias.length > 0 ? materias.map(m => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-700">{m.nombreMateria}</td>
                <td className="px-4 py-3 flex items-center space-x-2">
                  <button
                    onClick={() => startEdit(m)}
                    title="Editar"
                    className="p-1 rounded hover:bg-gray-200 transition"
                  >
                    <FiEdit2 className="text-indigo-600" />
                  </button>
                  <button
                    onClick={() => requestDelete(m.id!)}
                    title="Eliminar"
                    className="p-1 rounded hover:bg-gray-200 transition"
                  >
                    <FiTrash2 className="text-red-600" />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={2} className="px-4 py-6 text-center text-gray-500">
                  No hay materias registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de confirmación */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow max-w-sm w-full space-y-4">
            <p className="text-gray-800">¿Eliminar esta materia?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={cancelDelete}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
