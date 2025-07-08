import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// En producción: "/api"
// En desarrollo: "http://localhost:9090/api"

interface ApiInscripcion {
  id: string;
  alumnoId: string;
  materiaId: string;
  docenteId: string;
  ciclo: string;
  notaFinal: number;
}
interface ApiAlumno { idAlumno: string; nombres: string; }
interface ApiMateria { idMateria: string; nombreMateria: string; }
interface ApiDocente { idDocente: string; nombres: string; apellidos: string; }

interface Inscripcion {
  id: string;
  alumno: { nombres: string };
  materia: { nombreMateria: string };
  docente: { nombres: string; apellidos: string };
  ciclo: string;
  notaFinal: number;
}

interface FormValues {
  alumnoId: string;
  materiaId: string;
  docenteId: string;
  year: string;
  sem: '1' | '2';
  notaFinal: string;
}

const emptyForm: FormValues = {
  alumnoId: '', materiaId: '', docenteId: '', year: '', sem: '1', notaFinal: ''
};

export default function ProfesorNotas() {
  const { getAccessTokenSilently } = useAuth0();

  const [insRaw, setInsRaw] = useState<ApiInscripcion[]>([]);
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [alumnos, setAlumnos] = useState<ApiAlumno[]>([]);
  const [materias, setMaterias] = useState<ApiMateria[]>([]);
  const [docentes, setDocentes] = useState<ApiDocente[]>([]);

  const [form, setForm] = useState<FormValues>(emptyForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notaError, setNotaError] = useState('');
  const [toast, setToast] = useState('');

  const years = Array.from({ length: 6 }, (_, i) => `${new Date().getFullYear() - i}`);

  const fetchAll = async () => {
    try {
      const token = await getAccessTokenSilently();
      const [insR, alumR, matR, docR] = await Promise.all([
        axios.get<ApiInscripcion[]>(`${API_BASE_URL}/alumno-materias`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get<ApiAlumno[]>(`${API_BASE_URL}/alumnos`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get<ApiMateria[]>(`${API_BASE_URL}/materias`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get<ApiDocente[]>(`${API_BASE_URL}/docentes`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setInsRaw(insR.data);
      setAlumnos(alumR.data);
      setMaterias(matR.data);
      setDocentes(docR.data);
      setError('');
    } catch (e) {
      console.error(e);
      setError('No se pudo cargar la información.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [getAccessTokenSilently, API_BASE_URL]);

  useEffect(() => {
    if (!alumnos.length || !materias.length || !docentes.length) return;
    const aMap = Object.fromEntries(alumnos.map(a => [a.idAlumno, a.nombres]));
    const mMap = Object.fromEntries(materias.map(m => [m.idMateria, m.nombreMateria]));
    const dMap = Object.fromEntries(docentes.map(d => [d.idDocente, `${d.nombres} ${d.apellidos}`]));

    setInscripciones(insRaw.map(r => ({
      id: r.id,
      alumno: { nombres: aMap[r.alumnoId] || '–' },
      materia: { nombreMateria: mMap[r.materiaId] || '–' },
      docente: {
        nombres: dMap[r.docenteId]?.split(' ')[0] || '–',
        apellidos: dMap[r.docenteId]?.split(' ').slice(1).join(' ') || ''
      },
      ciclo: r.ciclo,
      notaFinal: r.notaFinal
    })));
  }, [insRaw, alumnos, materias, docentes]);  

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(''); 
  setNotaError('');
  const val = parseFloat(form.notaFinal);
  if (isNaN(val) || val <= 0 || val > 10) {
    setNotaError('La nota debe ser > 0 y ≤ 10');
    return;
  }
  const ciclo = `${form.year}-${form.sem}`;
  try {
    const token = await getAccessTokenSilently();
    const payload = {
      alumnoId: form.alumnoId,
      materiaId: form.materiaId,
      docenteId: form.docenteId,
      ciclo,
      notaFinal: val
    };
    if (editing) {
      await axios.put(`${API_BASE_URL}/alumno-materias/${editing}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setToast('Nota actualizada');
    } else {
      await axios.post(`${API_BASE_URL}/alumno-materias`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setToast('Nota creada');
    }
    setTimeout(() => setToast(''), 3000);
    setEditing(null);
    setForm(emptyForm);
    fetchAll();
  } catch (err: unknown) {
    const msg = axios.isAxiosError(err)
      ? typeof err.response?.data?.message === 'string'
        ? err.response.data.message
        : `Error ${err.response?.status}`
      : 'Error inesperado';
    setError(msg);
  }
};

const startEdit = (ins: Inscripcion) => {
  setEditing(ins.id);
  const raw = insRaw.find(r => r.id === ins.id)!;
  const [y, s] = raw.ciclo.split('-');
  setForm({
    alumnoId: raw.alumnoId,
    materiaId: raw.materiaId,
    docenteId: raw.docenteId,
    year: y,
    sem: s as '1' | '2',
    notaFinal: raw.notaFinal.toString()
  });
};

const requestDelete = (id: string) => setDeleteId(id);
const cancelDelete = () => setDeleteId(null);

const confirmDelete = async (id: string) => {
  setDeleteId(null);
  try {
    const token = await getAccessTokenSilently();
    await axios.delete(`${API_BASE_URL}/alumno-materias/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setToast('Inscripción eliminada');
    setInsRaw(prev => prev.filter(r => r.id !== id));
    setTimeout(() => setToast(''), 3000);
  } catch {
    setError('Error al eliminar');
  }
};

  if (loading) return <p className="text-center py-8">Cargando…</p>;
  if (error)   return <p className="text-red-600 text-center py-8">{error}</p>;

  return (
    <section className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800">Gestión de Notas</h2>

      {toast && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400
                        text-green-800 px-4 py-2 rounded shadow">
          {toast}
        </div>
      )}

      {/* Formulario */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-700 mb-4">
          {editing ? 'Editar Nota' : 'Nueva Nota'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {editing && (
            <div className="col-span-full text-sm text-gray-500">
              Editando ID: {editing}
            </div>
          )}

          {/* Selects y campo de nota */}
          <select
            className="w-full border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-400"
            value={form.alumnoId}
            onChange={e => setForm(f => ({ ...f, alumnoId: e.target.value }))}
            required
          >
            <option value="">Alumno…</option>
            {alumnos.map(a => (
              <option key={a.idAlumno} value={a.idAlumno}>{a.nombres}</option>
            ))}
          </select>

          <select
            className="w-full border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-400"
            value={form.materiaId}
            onChange={e => setForm(f => ({ ...f, materiaId: e.target.value }))}
            required
          >
            <option value="">Materia…</option>
            {materias.map(m => (
              <option key={m.idMateria} value={m.idMateria}>{m.nombreMateria}</option>
            ))}
          </select>

          <select
            className="w-full border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-400"
            value={form.docenteId}
            onChange={e => setForm(f => ({ ...f, docenteId: e.target.value }))}
            required
          >
            <option value="">Docente…</option>
            {docentes.map(d => (
              <option key={d.idDocente} value={d.idDocente}>
                {d.nombres} {d.apellidos}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <select
              className="flex-1 border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-400"
              value={form.year}
              onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
              required
            >
              <option value="">Año…</option>
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <select
              className="w-24 border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-400"
              value={form.sem}
              onChange={e => setForm(f => ({ ...f, sem: e.target.value as '1'|'2' }))}
            >
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </div>

          <div>
            <input
              type="text"
              placeholder="Nota 0–10"
              className="w-full border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-400"
              value={form.notaFinal}
              onChange={e => setForm(f => ({ ...f, notaFinal: e.target.value }))}
              required
            />
            {notaError && <p className="text-red-600 text-sm mt-1">{notaError}</p>}
          </div>

          <div className="col-span-full flex space-x-2 mt-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
            >
              {editing ? 'Actualizar' : 'Crear'}
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setForm(emptyForm);
                  setError('');
                  setNotaError('');
                }}
                className="bg-gray-200 text-gray-700 px-5 py-2 rounded hover:bg-gray-300 transition"
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
              {['Alumno','Materia','Docente','Ciclo','Nota','Acciones'].map(th => (
                <th key={th} className="px-4 py-2 text-left text-sm font-medium text-gray-600 uppercase">
                  {th}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inscripciones.length > 0 ? inscripciones.map(ins => (
              <tr key={ins.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm">{ins.alumno.nombres}</td>
                <td className="px-4 py-2 text-sm">{ins.materia.nombreMateria}</td>
                <td className="px-4 py-2 text-sm">
                  {ins.docente.nombres} {ins.docente.apellidos}
                </td>
                <td className="px-4 py-2 text-sm">{ins.ciclo}</td>
                <td className="px-4 py-2 text-sm">{ins.notaFinal}</td>
                <td className="px-4 py-2 flex items-center space-x-2">
                  <button onClick={() => startEdit(ins)}>
                    <FiEdit2 className="text-indigo-600" />
                  </button>
                  <button onClick={() => requestDelete(ins.id)}>
                    <FiTrash2 className="text-red-600" />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No hay inscripciones.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Confirm Delete */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow max-w-sm w-full space-y-4">
            <p className="text-gray-800">¿Eliminar esta inscripción?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={cancelDelete}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={() => confirmDelete(deleteId)}
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
