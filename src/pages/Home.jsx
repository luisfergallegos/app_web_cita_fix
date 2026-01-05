// rrd imports
import { useLoaderData, useNavigate } from "react-router-dom";
import { fetchData } from "../Wrapper.js";
import { useEffect, useState } from "react";
import CountUp from "react-countup";

// assets
import illustration from "../assets/clock_green.svg";
import Loaging from '../components/Loading.jsx';
import { urlApi } from "../styles/Constants.jsx";
import { ClockIcon, Cog6ToothIcon, PlusCircleIcon, ChevronDownIcon, ChevronUpIcon, XMarkIcon as CloseIcon, CalendarDateRangeIcon } from '@heroicons/react/24/outline';
import {
  BuildingOffice2Icon,
  BuildingOfficeIcon,
  CalendarDaysIcon
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


  const [citas, setCitas] = useState([]);
  const [userAdditInf, setUserAdditInf] = useState([]);
  const [colaboraciones, setColaboraciones] = useState([]);
  const [eventosUser, setEventosUser] = useState([]);

  const sUserCitaFix = fetchData("UserCitaFix") ?? [];
  const [firstName, setFirstName] = useState(sUserCitaFix['first_name'] ?? "");
  const [userId, setUserId] = useState(sUserCitaFix['USER_ID'] ?? "");
  const [dorsl, setDorsl] = useState(sUserCitaFix['DORSL'] ?? "");
  const [PhotoDorsl, setPhotoDorsl] = useState(sUserCitaFix['PHOTO_DORSL'] ?? "");
  const [businessId, setBusinessId] = useState(sUserCitaFix['BUSSINESS_ID'] ?? "");

  const [bAccederIndex, setbAccederIndex] = useState('');
  const [bAccederIndexCol, setbAccederIndexCol] = useState('');
  const [bAccederIndexCancelar, setbAccederIndexCancelar] = useState('');
  const [selectEvento, setSelectEvento] = useState(null);
  const [aIndexCol, setaIndexCol] = useState('');
  const [userGroup, setUserGroup] = useState(true);
  const [eventosGroup, setEventosGroup] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenCancelar, setIsOpenCancelar] = useState(false);
  const [bPopupMenuButton, setPopupMenuButton] = useState(false);

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

  const indexConfirmCol = async (e, col) => {
    e.stopPropagation();
    const AuxCol = col === '' ? aIndexCol : col;
    setbAccederIndexCol(AuxCol.ID);

    //Enviar por UPDATE
    var options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        {
          'collaborator_id': `${AuxCol.ID}`,
          'name': `${firstName}`
        })
    }
    try {
      const response = await fetch(`${urlApi}collaboratorConfirm`, options);
      const json = await response.json();
      if (json['sucess'] == false) {
        setbAccederIndexCol('');
        setaIndexCol('');
        setIsOpen(false);
        // console.log(`Error al cancelar cita.`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      else {
        //Solicitar por GET
        try {
          const response = await fetch(`${urlApi}usrInfCol?user_id=${userId}`);
          if (response.status == 200) {
            const json = await response.json();
            setColaboraciones(json['data']);
            setbAccederIndexCol('');
            setaIndexCol('');
            setIsOpen(false);
          } else {
            setbAccederIndexCol('');
            setaIndexCol('');
            setIsOpen(false);
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }
        catch (e) {
          setbAccederIndexCol('');
          setaIndexCol('');
          setIsOpen(false);
          return;
        }
      }
    }
    catch (e) {
      setbAccederIndexCol('');
      setaIndexCol('');
      setIsOpen(false);
      return;
    }
  };

  const ModPopupMenu = () => {
    setPopupMenuButton(!bPopupMenuButton);
  };

  const indexCancelar = async () => {
    //Enviar por DELETE
    var options = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        {
          'collaborator_id': `${aIndexCol.ID}`,
          'name': `${firstName}`
        })
    }
    try {
      const response = await fetch(`${urlApi}collaboratorRechazar`, options);
      const json = await response.json();
      if (json['sucess'] == false) {
        setIsOpen(false);
        // console.log(`Error al cancelar cita.`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      else {
        //Solicitar por GET
        try {
          const response = await fetch(`${urlApi}usrInfCol?user_id=${userId}`);
          if (response.status == 200) {
            const json = await response.json();
            setColaboraciones(json['data']);
          } else {
            console.log(`Error getting setUserAdditInf.`);
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          setIsOpen(false);
        }
        catch (e) {
          return;
        }
      }
    }
    catch (e) {
      setIsOpen(false);
      return;
    }
  };

  const _buildCancelar = async () => {
    setbAccederIndexCancelar(selectEvento);
    setIsOpenCancelar(false);
    //Enviar por DELETE
    var options = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        {
          'bussiness_id': selectEvento
        })
    }
    try {
      const response = await fetch(`${urlApi}event`, options);
      const json = await response.json();
      if (json['sucess'] == false) {
        setSelectEvento(null);
        setbAccederIndexCancelar('');
        // console.log(`Error al cancelar cita.`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      else {
        setSelectEvento(null);
        setbAccederIndexCancelar('');
        try {
          const response = await fetch(`${urlApi}event?userid=${userId}`);
          if (response.status == 200) {
            const json = await response.json();
            setEventosUser(json['data']);
          } else {
            console.log(`Error getting Eventos of User.`);
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }
        catch (e) {
          return;
        }
      }
    }
    catch (e) {
      setSelectEvento(null);
      setbAccederIndexCancelar('');
      return;
    }
  };

  useEffect(() => {
    const fData = async () => {
      //Solicitar por GET
      var options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-citafix-ps': sPassword
        }
      }
      try {
        const response = await fetch(`${urlApi}usr?email=${sCorreo}`, options);
        if (!response.ok) {
          toast.error(`No se puede obtener la información del usuario`);
        }
        const json = await response.json();
        //obtener nombre
        localStorage.setItem("UserCitaFix", JSON.stringify(json['data']));
        setFirstName(json['data']['first_name']);
        setUserId(json['data']['USER_ID']);
        setDorsl(json['data']['DORSL']);
        setPhotoDorsl(json['data']['PHOTO_DORSL']);
        setBusinessId(json['data']['BUSSINESS_ID']);
        localStorage.setItem("dorsl", JSON.stringify(dorsl));
      }
      catch (e) {
        console.log(`Error getting appoin.`);
      }
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
        try {
          const response = await fetch(`${urlApi}usrInf?user_id=${userId}`);
          if (response.status == 200) {
            const json = await response.json();
            setUserAdditInf(json['data'][0]);
          } else {
            console.log(`Error getting setUserAdditInf.`);
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          try {
            const response = await fetch(`${urlApi}usrInfCol?user_id=${userId}`);
            if (response.status == 200) {
              const json = await response.json();
              setColaboraciones(json['data']);
            } else {
              console.log(`Error getting setUserAdditInf.`);
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            try {
              const response = await fetch(`${urlApi}event?userid=${userId}`);
              if (response.status == 200) {
                const json = await response.json();
                setEventosUser(json['data']);
              } else {
                console.log(`Error getting Eventos of User.`);
                throw new Error(`HTTP error! status: ${response.status}`);
              }
            }
            catch (e) {
              setLoading(false);
              return;
            }
          }
          catch (e) {
            return;
          }
        }
        catch (e) {
          return;
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-800">{firstName.charAt(0).toUpperCase() + firstName.slice(1)}</h2>
            </div>
            <div className='flex items-center justify-between'>
              <button className='mr-2' onClick={() => navigate("/viewUpdateUser")} >
                <Cog6ToothIcon width={24} />
              </button>

            </div>
          </div>
          <div className='flex items-center justify-between mt-2 mb-2'>
            <BuildingOffice2Icon className="w-8 h-8 ml-2" color={'#fc6500'} />
            <div className='grid text-center'>
              <h1 className="text-1xl font-bold text-black">
                <CountUp start={0} end={userAdditInf.amount_business} duration={2} /></h1>
              <h1>Lugares visitados</h1>
            </div>
            <CalendarDaysIcon className="w-8 h-8" color={'#fc6500'} />
            <div className='grid text-center mr-4' >
              <h1 className="text-1xl font-bold text-black">
                <CountUp start={0} end={userAdditInf.amount_appointment} duration={2} /></h1>
              <h1 >Citas totales</h1>
            </div>
          </div>
          <div className='cursor-pointer flex items-center' onClick={() => toggle(setUserGroup)}>
            <h1 className='mr-2 text-gray-800'>Empresas que administras</h1>
            {userGroup ? <ChevronDownIcon className="w-5 h-5 text-gray-800 mt-1" /> : <ChevronUpIcon className="w-5 h-5 text-gray-800 mt-1" />}
          </div>
          {!userGroup && (
            <div className="grid mt-4 space-y-4">
              <button
                onClick={() => { dorsl == '' ? navigate("/registerBusiness") : navigate("/homeBusiness", { state: { businessId: businessId, tipo: true } }) }}
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
              {colaboraciones.length > 0 && <h1 className='mr-2 text-gray-800'>Empresas donde colaboras</h1>}
              {
                colaboraciones.length > 0 ? colaboraciones.map((index) => (
                  <div
                    onClick={() => {
                      if (index.CONFIRM == 1) {
                        navigate("/homeBusiness", { state: { businessId: index.BUSSINESS_ID, tipo: index.TIPO == '0' ? false : true } });
                      } else {
                        setaIndexCol(index);
                        setIsOpen(true);
                      }
                    }}
                    className="hover:bg-gray-200 text-orange-500 font-semibold py-2 px-2 rounded-md shadow-md transition flex items-center"
                  >
                    <div className="flex items-center space-x-4 mr-20" >
                      {
                        index.PHOTO == null ?
                          <BuildingOfficeIcon className='w-8 h-8 mx-1 md:w-5 md:h-5 lg:w-10 lg:h-10 ms:mx-2 md:mx-2 lg:mx-2' />
                          : <img className="w-8 h-8 mx-1 md:w-5 md:h-5 lg:w-10 lg:h-10 ms:mx-2 md:mx-2 lg:mx-2 rounded-full object-cover border"
                            src={'data:image/jpeg;base64,' + arrayBufferToBase64(index.PHOTO.data)} />
                      }
                      <div className="grid">
                        <label className="mr-4">{index.DORSL.charAt(0).toUpperCase() + index.DORSL.slice(1)}</label>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 ml-4">
                      {bAccederIndexCol == index.ID ?
                        <button className="px-4 py-2 rounded-lg bg-orange-500 text-white">
                          <div className='circleWhite'></div>
                        </button>
                        : index.CONFIRM == 0 ?
                          <button className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition"
                            onClick={(e) => { indexConfirmCol(e, index); }}>Aceptar
                          </button> : <></>}
                    </div>
                  </div>
                )) : <></>
              }
            </div>
          )}
        </div>
        {
          eventosUser.length > 0 &&
          <div className="bg-white rounded-3xl shadow-xl mt-20 p-10 max-w-2xl w-full text-center animate-fade-in-up">
            <div className='cursor-pointer flex items-center' onClick={() => toggle(setEventosGroup)}>
              <h1 className='mr-2 text-gray-800'>Tus próximos eventos</h1>
              {eventosGroup ? <ChevronDownIcon className="w-5 h-5 text-gray-800 mt-1" /> : <ChevronUpIcon className="w-5 h-5 text-gray-800 mt-1" />}
            </div>
            {!eventosGroup &&
              <div className="p-3 flex flex-col space-y-4 items-center">
                {eventosUser.map((index) =>
                (
                  <div className="bg-gray-100 shadow-lg rounded-lg overflow-hidden scale-95 hover:scale-100 transition-all duration-300"
                    key={index['BUSSINESS_ID']}
                  >
                    <div className="flex items-center space-x-4 mr-20 mt-5" >
                      <ClockIcon width={80} className="ml-5"
                        color={'#32325d'} />
                      <div className="grid">
                        <label className="text-lg font-semibold text-black">{index['EVENTO']} de {index['ANFITRION']} </label>
                        <label className="text-gray-400">{ConvertDateTime(index['EVENT_DATE'], index['EVENT_TIME'], 0)} </label>
                        <label className="text-gray-400">{ConvertDateTime(index['EVENT_DATE'], index['EVENT_TIME'], 1)} </label>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3 mr-2 mb-2">
                      {bAccederIndexCancelar == index['BUSSINESS_ID'] ?
                        <button className="px-4 py-2 rounded-lg bg-red-600 text-white">
                          <div className='circleWhiteRed'></div></button>
                        : <button className="px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition"
                          onClick={() => { setIsOpenCancelar(true); setSelectEvento(index['BUSSINESS_ID']); }}>Cancelar</button>}
                      <button className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition"
                        onClick={() => {
                          navigate(`/updateEvent`, { state: { userId: userId, evento: index } });
                        }}>Ver más</button>
                    </div>
                  </div>
                ))}
              </div>
            }
          </div>
        }
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
                          <label className="text-lg text-black">{index['DORSL']} </label>
                          <label className="text-gray-400">{ConvertDateTime(index['APPOINTMENT_DATE'], index['APPOINTMENT_TIME'], 0)} </label>
                          <label className="text-gray-400">{ConvertDateTime(index['APPOINTMENT_DATE'], index['APPOINTMENT_TIME'], 1)} </label>
                          <label className="text-gray-400">{index['ESTATUS'] == '1' ? 'Cita modificada por la empresa.' : ''} </label>
                        </div>
                      </div>
                      <div className="mt-6 flex justify-end space-x-3 mr-2 mb-2">
                        {bAccederIndex == index['APOINMENT_ID'] ?
                          <button className="px-4 py-2 rounded-lg bg-blue-500 text-white">
                            <div className='circleWhite'></div></button>
                          : index['APPOINTMENT_CONFIRM'] == 0 ?
                            <button className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
                              onClick={() => { indexConfirm(index) }}>Confirmar</button> : <></>}
                        <button className="px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition"
                          onClick={() => {
                            if (index['ESTATUS'] !== '-1' && index['ESTATUS'] !== '2') {
                              navigate(`/cancelAppoin/${index['APOINMENT_ID']}`, { state: { flagEvent: index['FLAG_EVENT'] } });
                            }
                          }}>Ver más</button>
                      </div>
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
      {!bPopupMenuButton ? <></> : <div class="fab-container2">
        <div class="button iconbutton">
          <button onClick={() => navigate("/addEvent", { state: { userId: userId } })} class="fa-solid fa-plus">
            <CalendarDateRangeIcon width={40} />
          </button>
          <label class="text-white px-1 font-bold">Evento</label>
        </div>
      </div>}
      <div class="fab-container">
        <div class="button iconbutton">
          <button
            onClick={() => ModPopupMenu()}
            class="fa-solid fa-plus"
          >
            {bPopupMenuButton ? <CloseIcon width={40} /> : <PlusCircleIcon width={40} />}
          </button>
        </div>
      </div>
      {/* Modal */}
      {isOpen ?
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative animate-fade-in-up">
              <button
                onClick={() => { setIsOpen(false); setaIndexCol(''); }}
                className="absolute top-3 right-3 text-gray-500 hover:text-orange-500"
              >
                <CloseIcon className="w-5 h-5 text-gray-900" />
              </button>
              <h4 className="text-xl font-bold text-center text-black mb-1">Confirmar</h4>
              <p className="text-center text-yellow-500 mb-1">¿Quieres aceptar la invitación a colaborar?</p>
              <div className='flex justify-end mt-2'>
                <button className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mx-2' onClick={() => {
                  indexCancelar();
                }}>Rechazar</button>
                <button className='bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600' onClick={(e) => {
                  indexConfirmCol(e, '');
                }}>Aceptar</button>
              </div>
            </div>
          </div>
        </> : <></>}
      {/* Modal */}
      {isOpenCancelar ?
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative animate-fade-in-up">
              <button
                onClick={() => { setIsOpenCancelar(false); setSelectEvento(null); }}
                className="absolute top-3 right-3 text-gray-500 hover:text-orange-500"
              >
                <CloseIcon className="w-5 h-5 text-gray-900" />
              </button>
              <h4 className="text-xl font-bold text-center text-black mb-1">Confirmar</h4>
              <p className="text-center text-yellow-500 mb-1">¿Seguro que quieres cancelar este evento?</p>
              <div className='flex justify-end mt-2'>
                <button className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mx-2' onClick={() => {
                  setIsOpenCancelar(false);
                  setSelectEvento(null);
                }}>Cancelar</button>
                <button className='bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600' onClick={(e) => {
                  _buildCancelar();
                }}>Aceptar</button>
              </div>
            </div>
          </div>
        </> : <></>}
    </div>
  );
}

export default Home;
