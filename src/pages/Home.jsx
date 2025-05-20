// rrd imports
import { useLoaderData, useNavigate } from "react-router-dom";
import { fetchData } from "../Wrapper.js";
import { useEffect } from "react";

// assets
import illustration from "../assets/clock_green.svg";

// loader
export function homeLoader() {
    const sCorreo = fetchData("correo");
    const sPassword = fetchData("pwd");
    return { sCorreo, sPassword };
}

export function Home() {

  const navigate = useNavigate();
  const { sCorreo, sPassword } = useLoaderData();

  useEffect(() => {
    if (sCorreo === null && sPassword === null) {
      navigate("/");
    }
  }, []);

  const sUserCitaFix = fetchData("UserCitaFix") ?? [];
  const citas = [];
  const firstName = sUserCitaFix['first_name'] ?? "Usuario";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-600 to-orange-800 px-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-2xl w-full text-center animate-fade-in-up">
        {
          citas.length > 0 ? (
            <div>
              {/* Aquí podrías mostrar citas agendadas si las hubiera */}
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">¡Hola {firstName}!</h2>
              <img src={illustration} alt="Planners Day" className="mx-auto w-56" />
              <p className="text-gray-600">No olvides crear tu cita.</p>
              <p className="text-gray-600">Genera tus próximas citas de manera fácil y al instante.</p>
              <p className="text-gray-600 mb-4">Dirígete al buscador para empezar.</p>
              <button
                onClick={() => navigate("/findBusiness")}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-md shadow-md transition"
              >
                Ir al buscador
              </button>
            </div>
          )
        }
      </div>
    </div>
  );
}

export default Home;
