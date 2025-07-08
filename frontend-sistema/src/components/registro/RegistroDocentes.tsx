import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import api, { setAuthToken } from '../../services/api';
import axios from 'axios';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

interface ApiDocente {
  id?: string;
  idDocente?: string;
  nombres: string;
  apellidos: string;
  fechaIngreso: string;
}

interface Docente {
  id: string;
  nombres: string;
  apellidos: string;
  fechaIngreso: string;
}

type DocenteForm = Omit<Docente, 'id'>;

const emptyForm: DocenteForm = {
  nombres: '',
  apellidos: '',
  fechaIngreso: ''
};

export default function RegistroDocentes() {
  const { getAccessTokenSilently } = useAuth0();
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<Docente | null>(null);
  const [form, setForm] = useState<DocenteForm>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Helper para inyectar el Bearer token en axios
  const injectToken = async () => {
    const token = await getAccessTokenSilently({
      authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE! }
    });
    setAuthToken(token);
  };

  const fetchDocentes = async () => {
    try {
      await injectToken();
      const res = await api.get<ApiDocente[]>('/docentes');
      const list = res.data
        .map(d => ({
          id: d.id ?? d.idDocente ?? '',
          nombres: d.nombres,
          apellidos: d.apellidos,
          fechaIngreso: d.fechaIngreso
        }))
        .filter(d => d.id);
      setDocentes(list);
      setError('');
    } catch (err) {
      console.error('fetchDocentes error:', err);
      setError('No se pudieron cargar los docentes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocentes();
  }, [getAccessTokenSilently]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await injectToken();
      const payload = {
        nombres: form.nombres,
        apellidos: form.apellidos,
        fechaIngreso: form.fechaIngreso
      };
      if (editing?.id) {
        await api.put(`/docentes/${editing.id}`, payload);
      } else {
        await api.post('/docentes', payload);
      }
      await fetchDocentes();
      setEditing(null);
      setForm(emptyForm);
    } catch (unknownError: unknown) {
      if (axios.isAxiosError(unknownError)) {
        const status = unknownError.response?.status;
        const data = unknownError.response?.data;
        console.error('PUT/POST /docentes error:', { status, data });
        const backendMsg =
          typeof data?.message === 'string' ? data.message : JSON.stringify(data);
        setError(backendMsg || `Error ${status} al guardar el docente.`);
      } else {
        console.error('handleSubmit unexpected error:', unknownError);
        setError('Error inesperado al guardar el docente.');
      }
    }
  };

  const startEdit = (d: Docente) => {
    setEditing(d);
    setForm({
      nombres: d.nombres,
      apellidos: d.apellidos,
      fechaIngreso: d.fechaIngreso
    });
  };

  const requestDelete = (id: string) => setDeleteId(id);
  const cancelDelete = () => setDeleteId(null);

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await injectToken();
      await api.delete(`/docentes/${deleteId}`);
      setDocentes(prev => prev.filter(d => d.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error('handleDelete error:', err);
      setError('No se pudo eliminar el docente.');
      setDeleteId(null);
    }
  };

  if (loading) return <p className="text-center py-8">Cargando docentes…</p>;
  if (error)   return <p className="text-red-600 text-center py-8">{error}</p>;

  return (
    <section className="space-y-8">
      {/* === Formulario Card === */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-700 mb-4">
          {editing ? 'Editar Docente' : 'Agregar Docente'}
        </h3>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {editing && (
            <div className="col-span-full text-sm text-gray-500">
              Editando ID: {editing.id}
            </div>
          )}
          <input
            type="text"
            placeholder="Nombres"
            value={form.nombres}
            onChange={e => setForm(f => ({ ...f, nombres: e.target.value }))}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="text"
            placeholder="Apellidos"
            value={form.apellidos}
            onChange={e => setForm(f => ({ ...f, apellidos: e.target.value }))}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="date"
            value={form.fechaIngreso}
            onChange={e => setForm(f => ({ ...f, fechaIngreso: e.target.value }))}
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

      {/* === Tabla Card === */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Nombres','Apellidos','Ingreso','Acciones'].map(th => (
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
            {docentes.length > 0
              ? docentes.map(d => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700">{d.nombres}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{d.apellidos}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{d.fechaIngreso}</td>
                    <td className="px-4 py-3 flex items-center space-x-2">
                      <button
                        onClick={() => startEdit(d)}
                        title="Editar"
                        className="p-1 rounded hover:bg-gray-200 transition"
                      >
                        <FiEdit2 className="text-indigo-600" />
                      </button>
                      <button
                        onClick={() => requestDelete(d.id!)}
                        title="Eliminar"
                        className="p-1 rounded hover:bg-gray-200 transition"
                      >
                        <FiTrash2 className="text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))
              : (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                      No hay docentes registrados.
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
            <p className="text-gray-800">¿Eliminar este docente?</p>
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
