export default function Dashboard() {
  return (
    <main className="flex flex-col items-center pt-16 px-4 bg-gray-50">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Sistema Gestor de Instituto Educativo
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
          <div className="w-full bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-2 text-center">Mi Perfil</h2>
            <p className="text-gray-600 text-center">
              Ver y editar tus datos personales.
            </p>
          </div>
          <div className="w-full bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-2 text-center">Boleta de Notas</h2>
            <p className="text-gray-600 text-center">
              Consulta tus calificaciones por materia.
            </p>
          </div>
          <div className="w-full bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-2 text-center">
              Gestión de Notas
            </h2>
            <p className="text-gray-600 text-center">
              Para profesores: edita y guarda notas de alumnos.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

