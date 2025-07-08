import React, { useEffect, useState } from 'react';
import { useAuth0 }                   from '@auth0/auth0-react';
import axios                          from 'axios';
import { FiEdit2, FiTrash2 }          from 'react-icons/fi';

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

type AlumnoForm = Omit<Alumno, 'id'>;

const emptyForm: AlumnoForm = {
  nombres: '',
  apellidos: '',
  fechaIngreso: '',
  direccion: '',
  telefono: ''
};

export default function RegistroAlumnos() {
  const { getAccessTokenSilently } = useAuth0();
  const [alumnos, setAlumnos]     = useState<Alumno[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [editing, setEditing]     = useState<Alumno | null>(null);
  const [form, setForm]           = useState<AlumnoForm>(emptyForm);
  const [deleteId, setDeleteId]   = useState<string | null>(null);

  // ① Leer la URL base de la API desde las variables de entorno
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  // En producción: "/api"
  // En desarrollo: "http://localhost:9090/api"

  const fetchAlumnos = async () => {
    try {
      const token = await getAccessTokenSilently();
      const res = await axios.get<ApiAlumno[]>(
        `${API_BASE_URL}/alumnos`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const list = res.data
        .map(a => ({
          id: a.id ?? a.idAlumno ?? '',
          nombres: a.nombres,
          apellidos: a.apellidos,
          fechaIngreso: a.fechaIngreso,
          direccion: a.direccion,
          telefono: a.telefono
        }))
        .filter(a => a.id);
      setAlumnos(list);
      setError('');
    } catch (e) {
      console.error('fetchAlumnos error:', e);
      setError('No se pudieron cargar los alumnos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumnos();
  }, [getAccessTokenSilently]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const token = await getAccessTokenSilently();
      const payload = { ...form };
      if (editing?.id) {
        await axios.put(
          `${API_BASE_URL}/alumnos/${editing.id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${API_BASE_URL}/alumnos`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      await fetchAlumnos();
      setEditing(null);
      setForm(emptyForm);
    } catch (unknownError: unknown) {
      if (axios.isAxiosError(unknownError)) {
        const status = unknownError.response?.status;
        const data   = unknownError.response?.data;
        console.error('PUT/POST /api/alumnos error:', { status, data });
        const backendMsg =
          typeof data?.message === 'string' ? data.message : JSON.stringify(data);
        setError(backendMsg || `Error ${status} al guardar el alumno.`);
      } else {
        console.error('handleSubmit unexpected error:', unknownError);
        setError('Error inesperado al guardar el alumno.');
      }
    }
  };

  const startEdit = (a: Alumno) => {
    setEditing(a);
    setForm({
      nombres:     a.nombres,
      apellidos:   a.apellidos,
      fechaIngreso: a.fechaIngreso,
      direccion:   a.direccion,
      telefono:    a.telefono
    });
  };

  const requestDelete = (id: string) => setDeleteId(id);
  const cancelDelete  = () => setDeleteId(null);

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const token = await getAccessTokenSilently();
      await axios.delete(
        `${API_BASE_URL}/alumnos/${deleteId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAlumnos(prev => prev.filter(a => a.id !== deleteId));
      setDeleteId(null);
    } catch (e) {
      console.error('handleDelete error:', e);
      setError('No se pudo eliminar el alumno.');
      setDeleteId(null);
    }
  };

  if (loading) return <p className="text-center py-8">Cargando alumnos…</p>;
  if (error)   return <p className="text-red-600 text-center py-8">{error}</p>;

  return (
    <section className="space-y-8">
      {/* === Formulario === */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-700 mb-4">
          {editing ? 'Editar Alumno' : 'Agregar Alumno'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="text"
            placeholder="Apellidos"
            value={form.apellidos}
            onChange={e => setForm(f => ({ ...f, apellidos: e.target.value }))}
            required
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="date"
            value={form.fechaIngreso}
            onChange={e => setForm(f => ({ ...f, fechaIngreso: e.target.value }))}
            required
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="text"
            placeholder="Dirección"
            value={form.direccion}
            onChange={e => setForm(f => ({ ...f, direccion: e.target.value }))}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="tel"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-indigo-400"
          />
          <div className="col-span-full flex flex-wrap gap-2 mt-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
            >
              {editing ? 'Actualizar' : 'Crear'}
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => { setEditing(null); setForm(emptyForm); }}
                className="bg-gray-200 text-gray-700 px-5 py-2 rounded hover:bg-gray-300"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* === Tabla de Alumnos === */}
      <div className="bg-white border rounded shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Nombre','Apellidos','Ingreso','Dirección','Teléfono','Acciones'].map(th => (
                <th key={th} className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase">
                  {th}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {alumnos.length > 0 ? alumnos.map(a => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-700">{a.nombres}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{a.apellidos}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{a.fechaIngreso}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{a.direccion}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{a.telefono}</td>
                <td className="px-4 py-3 flex items-center space-x-2">
                  <button onClick={() => startEdit(a)} title="Editar" className="p-1 rounded hover:bg-gray-200">
                    <FiEdit2 className="text-indigo-600" />
                  </button>
                  <button onClick={() => requestDelete(a.id)} title="Eliminar" className="p-1 rounded hover:bg-gray-200">
                    <FiTrash2 className="text-red-600" />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  No hay alumnos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de confirmación */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded shadow max-w-sm w-full space-y-4">
            <p className="text-gray-800">¿Eliminar este alumno?</p>
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
