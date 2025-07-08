import { useState } from 'react';
import RegistroAlumnos from '../components/registro/RegistroAlumnos';
import RegistroMaterias from '../components/registro/RegistroMaterias';
import RegistroDocentes from '../components/registro/RegistroDocentes';
import RegistroInscripciones from '../components/registro/RegistroInscripciones';

const tabs = [
  { key: 'alumnos',       label: 'Alumnos',       component: RegistroAlumnos },
  { key: 'materias',      label: 'Materias',      component: RegistroMaterias },
  { key: 'docentes',      label: 'Docentes',      component: RegistroDocentes },
  { key: 'inscripciones', label: 'Inscripciones', component: RegistroInscripciones },
];

export default function RegistroAc() {
  const [activeTab, setActiveTab] = useState<string>('alumnos');
  const ActiveComp = tabs.find(t => t.key === activeTab)!.component;

  return (
    <section className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Title */}
      <h2 className="text-3xl font-semibold text-gray-800">
        Registro Académico
      </h2>

      {/* Tabs Nav */}
      <div className="overflow-x-auto">
        <nav className="flex space-x-2 pb-2 border-b border-gray-200">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`
                flex-shrink-0
                px-4 py-2 text-sm font-medium rounded-md
                transition
                ${activeTab === t.key
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
              `}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Active Tab Panel */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <ActiveComp />
      </div>
    </section>
  );
}
