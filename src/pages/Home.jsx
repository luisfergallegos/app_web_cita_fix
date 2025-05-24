// rrd imports
import { useLoaderData, useNavigate } from "react-router-dom";
import { fetchData } from "../Wrapper.js";
import { useEffect, useState } from "react";

// assets
import illustration from "../assets/clock_green.svg";
import Loaging from '../components/Loading.jsx';
import { urlApi } from "../styles/Constants.jsx";
import { ChevronRightIcon, ClockIcon } from '@heroicons/react/24/solid';


// loader
export function homeLoader() {
  const sCorreo = fetchData("correo");
  const sPassword = fetchData("pwd");
  return { sCorreo, sPassword };
}

export function Home() {

  const navigate = useNavigate();
  const { sCorreo, sPassword } = useLoaderData();
  const [loading, setLoading] = useState(true);

  const sUserCitaFix = fetchData("UserCitaFix") ?? [];
  const [citas, setCitas] = useState([]);
  const firstName = sUserCitaFix['first_name'] ?? "Usuario";
  const userId = sUserCitaFix['USER_ID'] ?? "";

  const arrayBufferToBase64 = (buffer) => {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return btoa(binary);
  };

  function ConvertDateTime(date, time, flag) {
    var parts = date.split('-');
    var partsTime = time.split(':');
    var formattedDate = new Date(parts[0], parts[1] - 1, parts[2], partsTime[0], partsTime[1], partsTime[2]);
    const timeString = formattedDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    if (flag === 0) {
      return `${parts[2]} / ${parts[1]} / ${parts[0]}`;
    }
    else {
      return `${timeString}`;
    }

  }

  useEffect(() => {
    const fData = async () => {
      //Solicitar por GET
      try {
        const response = await fetch(`${urlApi}appoin?userid=${userId}`);
        if (!response.ok) {
          console.log(`Error getting appoin.`);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        setCitas(json['data']);

        setLoading(false);
      }
      catch (e) {
        return;
      }
    };
    if (sCorreo === null && sPassword === null) {
      navigate("/");
    }
    fData();
  }, []);

  if (loading) {
    return <Loaging />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-600 to-orange-800 px-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-2xl w-full text-center animate-fade-in-up">
        {
          citas.length > 0 ? (
            <div>
              <h2 className="text-5xl font-bold text-orange-600 mb-2">{citas.length == 1
                ? `${citas.length} cita`
                : `${citas.length} citas`}</h2>

              {citas.map((index) =>
              (
                <div className="flex bg-gray-100 scale-95 hover:scale-100 transition-all duration-300"
                  key={index}
                  onClick={() => {
                    if (index['ESTATUS'] !== '-1' && index['ESTATUS'] !== '2') {
                      navigate(`/cancelAppoin/${index['APOINMENT_ID']}`);
                    }
                  }}  >
                  {
                    index['BUS_PHOTO'] === null ? <ClockIcon width={40}
                      color={index['ESTATUS'] == '-1' ? 'red-900' :
                        index['ESTATUS'] == '1' ? 'gray-800' :
                          index['ESTATUS'] == '3' ? 'blueAccent' : 'grey'
                      } /> :
                      <img src={'data:image/jpeg;base64,' + arrayBufferToBase64(index['BUS_PHOTO'].data)} width={40} />
                  }
                  <div className="grid">
                    <label className="text-2xl font-bold text-black">{index['DORSL']} </label>
                    <label className="text-1xl text-gray-400">{ConvertDateTime(index['APPOINTMENT_DATE'], index['APPOINTMENT_TIME'], 0)} </label>
                    <label className="text-1xl text-gray-400">{ConvertDateTime(index['APPOINTMENT_DATE'], index['APPOINTMENT_TIME'], 1)} </label>
                    <label className="text-1xl text-gray-400">{index['ESTATUS'] == '1' ? 'Cita modificada por la empresa.' : ''} </label>
                  </div>

                  <ChevronRightIcon width={30} color="black" />
                </div>
              ))
              }
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
