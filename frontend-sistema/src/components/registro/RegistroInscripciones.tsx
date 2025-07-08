import React, { useEffect, useState } from 'react';
import { useAuth0 }                   from '@auth0/auth0-react';
import api, { setAuthToken }          from '../../services/api';
import axios                          from 'axios';
import { FiEdit2, FiTrash2 }          from 'react-icons/fi';

interface ApiAlumno    { idAlumno: string; nombres: string; }
interface ApiMateria   { idMateria: string; nombreMateria: string; }
interface ApiDocente   { idDocente: string; nombres: string; apellidos: string; }
interface ApiInscripcion {
  id: string;
  alumnoId:   string;
  materiaId:  string;
  docenteId:  string;
  ciclo:      string;
  notaFinal:  number;
}

interface Inscripcion {
  id:        string;
  alumno:    { nombres: string };
  materia:   { nombreMateria: string };
  docente:   { nombres: string; apellidos: string };
  ciclo:     string;
  notaFinal: number;
}

interface InscripcionForm {
  alumnoId:   string;
  materiaId:  string;
  docenteId:  string;
  year:       string;
  sem:        '1' | '2';
  notaFinal:  string;
}

const emptyForm: InscripcionForm = {
  alumnoId: '', materiaId: '', docenteId: '', year: '', sem: '1', notaFinal: ''
};

export default function RegistroInscripciones() {
  const { getAccessTokenSilently } = useAuth0();

  const [insRaw,        setInsRaw]        = useState<ApiInscripcion[]>([]);
  const [alumnos,       setAlumnos]       = useState<ApiAlumno[]>([]);
  const [materias,      setMaterias]      = useState<ApiMateria[]>([]);
  const [docentes,      setDocentes]      = useState<ApiDocente[]>([]);
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);

  const [form,    setForm]    = useState<InscripcionForm>(emptyForm);
  const [editing, setEditing] = useState<string|null>(null);

  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [notaError, setNotaError] = useState('');

  const [deleteId, setDeleteId] = useState<string|null>(null);

  const years = Array.from({ length: 6 }, (_, i) =>
    `${new Date().getFullYear() - i}`
  );

  // inyecta el token en axios
  const injectToken = async () => {
    const token = await getAccessTokenSilently({
      authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE! }
    });
    setAuthToken(token);
  };

  // 1) Fetch de datos
  const fetchAll = async () => {
    try {
      await injectToken();
      const [insR, alumR, matR, docR] = await Promise.all([
        api.get<ApiInscripcion[]>('/alumno-materias'),
        api.get<ApiAlumno[]>       ('/alumnos'),
        api.get<ApiMateria[]>      ('/materias'),
        api.get<ApiDocente[]>      ('/docentes'),
      ]);
      setInsRaw(insR.data);
      setAlumnos(alumR.data);
      setMaterias(matR.data);
      setDocentes(docR.data);
      setError('');
    } catch (e) {
      console.error('fetchAll error:', e);
      setError('No se pudo cargar la información.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchAll(); }, [getAccessTokenSilently]);

  // 2) Mapeo insRaw → inscripciones
  useEffect(() => {
    if (!alumnos.length || !materias.length || !docentes.length) return;
    const aMap = Object.fromEntries(alumnos.map(a => [a.idAlumno, a.nombres]));
    const mMap = Object.fromEntries(materias.map(m => [m.idMateria, m.nombreMateria]));
    const dMap = Object.fromEntries(docentes.map(d => [d.idDocente, `${d.nombres} ${d.apellidos}`]));

    setInscripciones(insRaw.map(r => ({
      id: r.id,
      alumno:    { nombres: aMap[r.alumnoId] || '–' },
      materia:   { nombreMateria: mMap[r.materiaId] || '–' },
      docente:   {
        nombres:   (dMap[r.docenteId]  || '–').split(' ')[0],
        apellidos: (dMap[r.docenteId] || '').split(' ').slice(1).join(' ')
      },
      ciclo:     r.ciclo,
      notaFinal: r.notaFinal
    })));
  }, [insRaw, alumnos, materias, docentes]);

  // 3) Crear / actualizar
  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setError(''); setNotaError('');

    const val = parseFloat(form.notaFinal);
    if (isNaN(val) || val <= 0 || val > 10) {
      setNotaError('La nota debe ser > 0 y ≤ 10');
      return;
    }
    const ciclo = `${form.year}-${form.sem}`;

    try {
      await injectToken();
      const payload = {
        alumnoId:  form.alumnoId,
        materiaId: form.materiaId,
        docenteId: form.docenteId,
        ciclo,
        notaFinal: val
      };
      if (editing) {
        await api.put(`/alumno-materias/${editing}`, payload);
      } else {
        await api.post('/alumno-materias', payload);
      }
      setEditing(null);
      setForm(emptyForm);
      await fetchAll();
    } catch (e: unknown) {
      const msg = axios.isAxiosError(e)
        ? typeof e.response?.data?.message === 'string'
          ? e.response!.data.message
          : `Error ${e.response?.status}`
        : 'Error inesperado';
      setError(msg);
    }
  };

  const startEdit = (ins: Inscripcion) => {
    setEditing(ins.id);
    const raw = insRaw.find(r => r.id === ins.id)!;
    const [y, s] = raw.ciclo.split('-');
    setForm({
      alumnoId:  raw.alumnoId,
      materiaId: raw.materiaId,
      docenteId: raw.docenteId,
      year:      y,
      sem:       s as '1'|'2',
      notaFinal: raw.notaFinal.toString()
    });
  };

  // 4) Eliminar
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await injectToken();
      await api.delete(`/alumno-materias/${deleteId}`);
      setInsRaw(prev => prev.filter(r => r.id !== deleteId));
      setDeleteId(null);
    } catch {
      setError('Error al eliminar');
    }
  };

  if (loading) return <p className="text-center py-4">Cargando…</p>;
  if (error)   return <p className="text-red-500 text-center py-4">{error}</p>;

  return (
    <section className="space-y-6">
      <h3 className="text-xl font-semibold">Inscripciones</h3>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-5 gap-4 bg-white p-6 rounded-lg shadow"
      >
        {editing && (
          <p className="col-span-full text-gray-600">Editando ID: {editing}</p>
        )}
        <select
          className="border rounded px-3 py-2"
          value={form.alumnoId}
          onChange={e => setForm(f => ({ ...f, alumnoId:   e.target.value }))}
          required
        >
          <option value="">Alumno…</option>
          {alumnos.map(a => (
            <option key={a.idAlumno} value={a.idAlumno}>{a.nombres}</option>
          ))}
        </select>
        <select
          className="border rounded px-3 py-2"
          value={form.materiaId}
          onChange={e => setForm(f => ({ ...f, materiaId:  e.target.value }))}
          required
        >
          <option value="">Materia…</option>
          {materias.map(m => (
            <option key={m.idMateria} value={m.idMateria}>{m.nombreMateria}</option>
          ))}
        </select>
        <select
          className="border rounded px-3 py-2"
          value={form.docenteId}
          onChange={e => setForm(f => ({ ...f, docenteId:  e.target.value }))}
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
            className="flex-1 border rounded px-3 py-2"
            value={form.year}
            onChange={e => setForm(f => ({ ...f, year:        e.target.value }))}
            required
          >
            <option value="">Año…</option>
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <select
            className="w-24 border rounded px-3 py-2"
            value={form.sem}
            onChange={e => setForm(f => ({ ...f, sem:         e.target.value as '1'|'2' }))}
          >
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>
        <div>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Nota 0–10"
            value={form.notaFinal}
            onChange={e => setForm(f => ({ ...f, notaFinal:   e.target.value }))}
            required
          />
          {notaError && <p className="text-red-500 text-sm">{notaError}</p>}
        </div>
        <div className="col-span-full flex gap-2">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {editing ? 'Actualizar' : 'Crear'}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => { setEditing(null); setForm(emptyForm); }}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Tabla */}
      <div className="overflow-x-auto bg-white p-4 rounded shadow">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Alumno</th>
              <th className="p-2 text-left">Materia</th>
              <th className="p-2 text-left">Docente</th>
              <th className="p-2 text-left">Ciclo</th>
              <th className="p-2 text-left">Nota</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {inscripciones.map(ins => (
              <tr key={ins.id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-200">
                <td className="p-2">{ins.alumno.nombres}</td>
                <td className="p-2">{ins.materia.nombreMateria}</td>
                <td className="p-2">{ins.docente.nombres} {ins.docente.apellidos}</td>
                <td className="p-2">{ins.ciclo}</td>
                <td className="p-2">{ins.notaFinal}</td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => startEdit(ins)}
                    className="text-blue-600 hover:underline"
                  >
                    <FiEdit2/>
                  </button>
                  <button
                    onClick={() => setDeleteId(ins.id)}
                    className="text-red-600 hover:underline"
                  >
                    <FiTrash2/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de confirmación */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow max-w-sm w-full space-y-4">
            <p className="text-gray-800">¿Eliminar esta inscripción?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteId(null)}
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
