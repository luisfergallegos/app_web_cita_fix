// rrd imports
import { useLoaderData, useNavigate } from "react-router-dom";
import { fetchData } from "../Wrapper.js";
import { useEffect, useState } from "react";

// assets
import illustration from "../assets/clock_green.svg";
import Loaging from '../components/Loading.jsx';
import { urlApi } from "../styles/Constants.jsx";
import { ClockIcon, Cog6ToothIcon, PlusCircleIcon, ChevronDownIcon, ChevronUpIcon, Bars3Icon } from '@heroicons/react/24/outline';
import {
  BuildingOfficeIcon
} from '@heroicons/react/24/solid';
import './Home.css';


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
  const dorsl = sUserCitaFix['DORSL'] ?? "";
  const PhotoDorsl = sUserCitaFix['PHOTO_DORSL'] ?? "";

  const [bAccederIndex, setbAccederIndex] = useState('');
  const [userGroup, setUserGroup] = useState(false);

  const arrayBufferToBase64 = (buffer) => {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return btoa(binary);
  };

  const toggle = (setter) => setter((prev) => !prev);

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

  const indexConfirm = async (cita) => {
    setbAccederIndex(cita['APOINMENT_ID']);

    //Enviar por UPDATE
    var options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        {
          'apoinment_id': `${cita['APOINMENT_ID']}`,
          'usernotification_id': `${cita['USER_ID']}`,
          'username': firstName
        })
    }
    try {
      const response = await fetch(`${urlApi}appoinConfirm`, options);
      const json = await response.json();
      if (json['sucess'] == false) {
        setbAccederIndex('');
        // console.log(`Error al cancelar cita.`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      else {
        setbAccederIndex('');
        //Solicitar por GET
        try {
          const response = await fetch(`${urlApi}appoin?userid=${userId}`);
          if (response.status == 200) {
            const json = await response.json();
            setCitas(json['data']);
          } else if (response.status == 404) {
            setCitas([]);
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          setLoading(false);
        }
        catch (e) {
          return;
        }
      }
    }
    catch (e) {
      setbAccederIndex('');
      return;
    }
  };

  useEffect(() => {
    const fData = async () => {
      //Solicitar por GET
      try {
        const response = await fetch(`${urlApi}appoin?userid=${userId}`);
        if (response.status == 200) {
          const json = await response.json();
          setCitas(json['data']);
        } else if (response.status == 404) {
          setCitas([]);
        } else {
          console.log(`Error getting appoin.`);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
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
      <div className="max-w-3xl mx-auto mt-20 p-6 space-y-6 text-gray-800">
        <div className="bg-white text-black shadow rounded-xl p-4">
          <div className="cursor-pointer flex items-center justify-between"
            onClick={() => toggle(setUserGroup)}>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-800">{firstName.charAt(0).toUpperCase() + firstName.slice(1)}</h2>
            </div>
            <div className='flex items-center justify-between'>
              <button className='mr-2' onClick={() => navigate("/viewUpdateUser")} >
                <Cog6ToothIcon width={24} />
              </button>
              {userGroup ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronUpIcon className="w-5 h-5" />}
            </div>
          </div>
          {!userGroup && (
            <div className="mt-4 space-y-4">
              <button
                onClick={() => { dorsl == '' ? navigate("/registerBusiness") : navigate("/homeBusiness") }}
                className="hover:bg-gray-200 text-orange-500 font-semibold py-2 px-2 rounded-md shadow-md transition flex items-center"
              >
                {
                  PhotoDorsl.data.length == 0 ?
                    <BuildingOfficeIcon className='w-8 h-8 mx-1 md:w-5 md:h-5 lg:w-10 lg:h-10 ms:mx-2 md:mx-2 lg:mx-2' />
                    : <img className="w-8 h-8 mx-1 md:w-5 md:h-5 lg:w-10 lg:h-10 ms:mx-2 md:mx-2 lg:mx-2 rounded-full object-cover border"
                      src={'data:image/jpeg;base64,' + arrayBufferToBase64(PhotoDorsl.data)} />
                }
                <label className="mr-4">{dorsl == '' ? 'Crear empresa' : dorsl.charAt(0).toUpperCase() + dorsl.slice(1)}</label>
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl shadow-xl mt-20 p-10 max-w-2xl w-full text-center animate-fade-in-up">
          {
            citas.length > 0 ? (
              <div>
                <h2 className="text-5xl font-bold text-orange-600 mb-8">{citas.length == 1
                  ? `${citas.length} cita`
                  : `${citas.length} citas`}</h2>

                <div className="p-3 flex flex-col space-y-4 items-center">
                  {citas.map((index) =>
                  (
                    <div className="bg-gray-100 shadow-lg rounded-lg overflow-hidden scale-95 hover:scale-100 transition-all duration-300"
                      key={index['APOINMENT_ID']}
                    >
                      <div className="flex items-center space-x-4 mr-20 mt-5" >
                        {
                          index['BUS_PHOTO'] === null ? <ClockIcon width={80} className="ml-5"
                            color={index['ESTATUS'] == '-1' ? '#B71C1C' :
                              index['ESTATUS'] == '1' ? '#32325d' :
                                index['ESTATUS'] == '3' ? '#4472C4' : 'grey'
                            } /> :
                            <img className="ml-5" id="imgSH" src={'data:image/jpeg;base64,' + arrayBufferToBase64(index['BUS_PHOTO'].data)} />
                        }
                        <div className="grid">
                          <label className="text-2xl font-bold text-black">{index['DORSL']} </label>
                          <label className="text-1xl text-gray-400">{ConvertDateTime(index['APPOINTMENT_DATE'], index['APPOINTMENT_TIME'], 0)} </label>
                          <label className="text-1xl text-gray-400">{ConvertDateTime(index['APPOINTMENT_DATE'], index['APPOINTMENT_TIME'], 1)} </label>
                          <label className="text-1xl text-gray-400">{index['ESTATUS'] == '1' ? 'Cita modificada por la empresa.' : ''} </label>
                        </div>
                      </div>
                      <div className="mt-6 flex justify-end space-x-3 mr-2 mb-2">
                        {bAccederIndex == index['APOINMENT_ID'] ?
                          <button className="px-4 py-2 rounded-lg bg-blue-500 text-white"><div className='circleWhite'></div></button>
                          : index['APPOINTMENT_CONFIRM'] == 0 ?
                            <button className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
                              onClick={() => { indexConfirm(index) }}>Confirmar</button> : <></>}
                        <button className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition" onClick={() => {
                          if (index['ESTATUS'] !== '-1' && index['ESTATUS'] !== '2') {
                            navigate(`/cancelAppoin/${index['APOINMENT_ID']}`);
                          }
                        }}>Cancelar</button>
                      </div>

                      {/* <ChevronRightIcon width={30} color="black" /> */}
                    </div>
                  ))
                  }
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* <h2 className="text-2xl font-bold text-gray-800">¡Hola {firstName}!</h2> */}
                <img src={illustration} alt="Planners Day" className="mx-auto w-56" />
                <p className="text-orange-600 font-bold">¡No olvides crear tu cita!</p>
                <p className="text-gray-600">Genera tus próximas citas de manera fácil y al instante.</p>
                <p className="text-gray-600 mb-4">Dirígete al buscador para empezar.</p>
                <button
                  onClick={() => navigate("/findBusiness")}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-md shadow-md transition"
                >
                  Ir al Buscador
                </button>
              </div>
            )
          }

        </div>
      </div>
      <div class="fab-container">
        <div class="button iconbutton">
          <button
            onClick={() => navigate("/findBusiness")}
            class="fa-solid fa-plus"
          >
            <PlusCircleIcon width={40} />
          </button>
        </div>
      </div>

      {/* <div class="fab-container">
        <div class="button iconbutton">
          <button
            onClick={() => navigate("/viewUpdateUser")}
            class="fa-solid fa-plus"
          >
            <Cog6ToothIcon width={40} />
          </button>
        </div>
      </div> */}
    </div>
  );
}

export default Home;
