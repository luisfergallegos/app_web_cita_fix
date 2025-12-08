// Library
import { BuildingStorefrontIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/solid';
import '../../components/CardBusiness.css';
// assents
import Store from "../../assets/business.png";
import EventoPng from "../../assets/evento.png";
import Logo from "../../assets/splash.png";
import Loaging from '../../components/Loading.jsx';
// rrd imports
import { useLoaderData, useNavigate, useSearchParams } from 'react-router-dom';
import { urlApi } from "../../styles/Constants.jsx";
import { useEffect, useState } from "react";
import { dateSpanish, fetchData } from '../../Wrapper.js';

// loader
export async function ConfirmationLoader() {
    const sCorreo = fetchData("correo");
    const sPassword = fetchData("pwd");
    return { sCorreo, sPassword };
}

export function Confirmation() {
    const navigate = useNavigate();
    const { sCorreo, sPassword } = useLoaderData();
    const [loading, setLoading] = useState(true);
    const [cita, setCita] = useState([]);
    const [evento, setEvento] = useState([]);
    const [bAcceder, setbAcceder] = useState(true);

    const [searchParams] = useSearchParams();
    const apoinment_id = searchParams.get("ai");
    const keyName = searchParams.get("kn");
    const [flagEvent, setFlagEvent] = useState(false);

    // Function to convert Base64 string to binary data
    const arrayBufferToBase64 = (buffer) => {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return btoa(binary);
    };

    const handleADDRESS = (e) => {
        e.stopPropagation();
        if (navigator.platform.indexOf('iPhone') !== -1 || navigator.platform.indexOf('iPad') !== -1 || navigator.platform.indexOf('iPod') !== -1) {
            window.open(`maps://maps.google.com/?q=${cita.ADDRESS_FIRST} ${cita.ADDRESS_SECOND} CP ${cita.POSTAL_CODE} ${cita.CITY}, ${cita.STATE} Mexico`);
        } else {
            window.open(`https://maps.google.com?q=${cita.ADDRESS_FIRST} ${cita.ADDRESS_SECOND} CP ${cita.POSTAL_CODE} ${cita.CITY}, ${cita.STATE} Mexico`);
        }
    }

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
            return dateSpanish(formattedDate);
        }
        else {
            return `${timeString}`;
        }

    }

    const indexConfirm = async () => {
        if (bAcceder) {
            setbAcceder(false);
            //Enviar por UPDATE
            var options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    {
                        'apoinment_id': `${cita['APOINMENT_ID']}`,
                        'usernotification_id': `${cita['BUS_USER_ID']}`,
                        'username': cita['ANONIMO'] == '' ? cita['USER_NAME'] : cita['ANONIMO'].substring(0, cita['ANONIMO'].indexOf(","))
                    })
            }
            try {
                const response = await fetch(`${urlApi}appoinConfirm`, options);
                const json = await response.json();
                if (json['sucess'] == false) {
                    setbAcceder(true);
                    // console.log(`Error al cancelar cita.`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                else {
                    navigate("/");
                }
            }
            catch (e) {
                setbAcceder(true);
                return;
            }
        }
    }

    const indexConfirmNot = async () => {
        if (bAcceder) {
            setbAcceder(false);
            //Enviar por UPDATE
            var options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    {
                        'apoinment_id': `${cita['APOINMENT_ID']}`,
                        'usernotification_id': `${cita['BUS_USER_ID']}`,
                        'username': cita['ANONIMO'] == '' ? cita['USER_NAME'] : cita['ANONIMO'].substring(0, cita['ANONIMO'].indexOf(","))
                    })
            }
            try {
                const response = await fetch(`${urlApi}appoinConfirmNot`, options);
                const json = await response.json();
                if (json['sucess'] == false) {
                    setbAcceder(true);
                    // console.log(`Error al cancelar cita.`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                else {
                    navigate("/");
                }
            }
            catch (e) {
                setbAcceder(true);
                return;
            }
        }
    }

    function stringToHex(str) {
        let hexString = '';
        for (let i = 0; i < str.length; i++) {
            // Get the Unicode value of the character
            const charCode = str.charCodeAt(i);
            // Convert the charCode to a hexadecimal string
            // toString(16) converts a number to its hexadecimal representation
            let hexValue = charCode.toString(16);

            // Ensure two-digit hexadecimal representation by padding with a leading zero if necessary
            if (hexValue.length < 2) {
                hexValue = '0' + hexValue;
            }
            hexString += hexValue;
        }
        return hexString;
    }

    const TextoConLinks = ({ text }) => {
        const regex = /(https?:\/\/[^\s]+)/g;

        const partes = text.split(regex);

        return (
            <p className="font-medium">
                {partes.map((parte, index) =>
                    regex.test(parte) ? (
                        <a key={index} href={parte} target="_blank" rel="noopener noreferrer" style={{ color: "blue" }}>
                            {parte}
                        </a>
                    ) : (
                        <span key={index}>{parte}</span>
                    )
                )}
            </p>
        );
    };

    useEffect(() => {
        // Cargar user info desde loader
        console.log('apoinment_id: ' + apoinment_id);
        if (!apoinment_id) {
            navigate("/");
        }
        const fData = async () => {
            //Solicitar por GET
            try {
                const response = await fetch(`${urlApi}getAppoin?apoinment_id=${apoinment_id}`);
                if (!response.ok) {
                    console.log(`Error getting getAppoin.`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const json = await response.json();
                setCita(json['data']);
                // var Aux = json['data']['ANONIMO'] == '' ? json['data']['USER_NAME'] : json['data']['ANONIMO'].substring(0, json['data']['ANONIMO'].indexOf(","));
                // console.log('keyName: ' + Aux);
                // console.log('stringToHex: ' + stringToHex(Aux));
                // if( keyName != stringToHex(Aux)){
                //     navigate("/");
                // }
                if (json['data']['FLAG_EVENT'] == '1') {
                    setFlagEvent(true);
                    // console.log('flagEvent: ' + flagEvent);
                    // console.log('bussiness_id:' + json['data']['BUSSINESS_ID']);
                    //Solicitar por GET
                    try {
                        const response = await fetch(`${urlApi}getEvent?bussiness_id=${json['data']['BUSSINESS_ID']}`);
                        if (!response.ok) {
                            console.log(`Error getting inf Event.`);
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        const json2 = await response.json();
                        setEvento(json2['data']);
                        setLoading(false);
                    }
                    catch (e) {
                        return;
                    }
                }
                else {
                    setFlagEvent(false);
                    setLoading(false);
                }

            }
            catch (e) {
                setLoading(false);
                return;
            }
        };
        fData();
    }, []);

    if (loading) {
        return <Loaging />;
    }

    return (
        <div>

            {
                sCorreo == null & sPassword == null ? <div className="flex justify-between items-center w-full bg-white">
                    <a href="https://www.plannersday.com/"><img className='h-10 w-auto' src={Logo} alt="" /></a>
                    <a href="https://app.plannersday.com/"><span className='mr-10 text-orange-600 text-auto'>Iniciar sesión</span></a>
                </div> : <div></div>
            }
            <div className="min-h-screen grid items-center justify-center bg-gradient-to-br from-gray-600 to-gray-800 px-4">

                <div className="bg-white rounded-3xl shadow-xl mt-20 p-10 max-w-2xl w-full text-center animate-fade-in-up">
                    <div className='flex justify-center mb-4'>
                        {
                            cita.BUS_PHOTO === null ?
                                <img className="w-64 h-64 object-cover rounded-2xl border" id='store' src={flagEvent ? EventoPng : Store} /> :
                                <img className="w-64 h-64 object-cover rounded-2xl border" src={'data:image/jpeg;base64,' + arrayBufferToBase64(cita.BUS_PHOTO.data)} />
                        }
                    </div>
                    <div className='grid CardContainer_Titulo'>
                        <b className='text-4xl font-bold mb-4'>{cita.DORSL}</b>
                        {flagEvent ? <b className="mb-2 text-2xl text-gray-700">
                            Vestimenta: {evento.DRESSCODE || 'Código de vestimenta'}
                        </b> : <></>}
                        {flagEvent ? <></> : <b className='text-2xl font-bold mb-4'>{ConvertDateTime(cita.APPOINTMENT_DATE, cita.APPOINTMENT_TIME, 1)}  -  {ConvertDateTime(cita.APPOINTMENT_DATE, cita.APPOINTMENT_TIME, 0)}</b>}

                    </div>
                    {flagEvent ?
                        <div className="bg-white rounded-lg p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">✨ {evento.ENCABEZADO || 'Encabezado'}</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {evento.ANFITRION ? `${evento.ANFITRION} —` : ""} <span className="font-medium">{evento.MOTIVO || 'Motivo'}</span>
                                    </p>
                                </div>
                            </div>
                            <hr className="my-4 border-gray-100" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700 ">
                                <div>
                                    <p className="text-xs text-gray-500">📅 Fecha</p>
                                    <p className="font-medium">{ConvertDateTime(cita.APPOINTMENT_DATE, cita.APPOINTMENT_TIME, 0)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">🕒 Hora</p>
                                    <p className="font-medium">{ConvertDateTime(cita.APPOINTMENT_DATE, cita.APPOINTMENT_TIME, 1)}</p>
                                </div>

                                <div className="sm:col-span-2">
                                    <p className="text-xs text-gray-500">📍 Ubicación</p>
                                    <p className="font-medium">{evento.UBICACION || "Lugar"}</p>
                                    {<TextoConLinks text={"⚠️ "+evento.NOTAS}/> || <p className="font-medium">"Notas / Indicaciones / enlace" </p>}
                                    
                                </div>
                                <div className="sm:col-span-2 mt-2">
                                    <p className="text-xs text-gray-500">🔖 Invitados</p>
                                    <p className="font-medium">{cita.MENSSAGE.substring(0, cita.MENSSAGE.indexOf(","))} {`(${cita.MENSSAGE.substring(cita.MENSSAGE.indexOf(",") + 1, cita.MENSSAGE.length)})`}</p>
                                </div>
                            </div>
                            <div className="mt-6 text-sm text-gray-600">
                                <p>{evento.DESPEDIDA || 'Mensaje final'} 🎊</p>
                            </div>
                        </div> : <></>}
                    {flagEvent ? <></> : <hr className="mb-4 mt-4" />}
                    {flagEvent ? <></> : cita.CATEGORIA && <div className='CardContainer_Detalle'>
                        <div className='CardContainer_DetalleIcon'>
                            <BuildingStorefrontIcon className='w-10 h-10 md:w-10 md:h-10 lg:w-10 lg:h-10' />
                        </div>
                        {cita.CATEGORIA}
                    </div>}
                    {flagEvent ? <></> : <div className='CardContainer_Detalle'>
                        <div className='CardContainer_DetalleIcon'>
                            <MapPinIcon className='w-10 h-10 md:w-10 md:h-10 lg:w-10 lg:h-10 flex-shrink-0' />
                        </div>
                        <div className='text-left' onClick={handleADDRESS} >
                            <p>{cita.ADDRESS_FIRST}, {cita.ADDRESS_SECOND}, {cita.POSTAL_CODE}</p>
                            <p>{cita.CITY}, {cita.STATE}, Mexico</p>
                        </div>
                    </div>}
                    {flagEvent ? <></> : cita.BUS_USER_PHONE && <div className='CardContainer_Detalle'>
                        <div className='CardContainer_DetalleIcon'>
                            <PhoneIcon className='w-10 h-10 md:w-10 md:h-10 lg:w-10 lg:h-10' />
                        </div>
                        {cita.BUS_USER_PHONE}
                    </div>}
                    <hr className="mb-4" />
                    {cita.APPOINTMENT_CONFIRM == 0 ? bAcceder ? <div className='businessBtn flex'>
                        <button className='px-3 py-1 text-sm rounded-lg bg-gray-500 text-white hover:bg-gray-600' onClick={() => {
                            indexConfirm();
                        }}>Confirmar</button>
                        <button className='ml-4 px-3 py-1 text-sm rounded-lg bg-gray-500 text-white hover:bg-gray-600' onClick={() => {
                            indexConfirmNot();
                        }}>No asistiré</button>
                    </div> : <div className='businessBtn'>
                        <button className='mb-10 mt-4'><div className='circle' ></div></button>
                    </div> : <></>}

                </div>
            </div>
        </div>
    );
}

export default Confirmation;