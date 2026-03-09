// rrd imports
import { useLoaderData, useNavigate, useLocation } from 'react-router-dom';
import { dateSpanish, fetchData } from "../../Wrapper.js";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
// assets
// import './Add_appoin.css';
import '../../components/Loading.css';
import Loaging from '../../components/Loading.jsx';
import { urlApi } from "../../styles/Constants.jsx";
import RatingBar from "../../components/RatingBar.jsx";
import User from "../../assets/e.png";
import { BuildingStorefrontIcon, EnvelopeIcon, InformationCircleIcon, MapPinIcon, XMarkIcon as CloseIcon, ChatBubbleLeftEllipsisIcon, TagIcon } from '@heroicons/react/24/solid';

// loader
export async function CancelarAppoinLoader({ params }) {
    const sCorreo = fetchData("correo");
    const sPassword = fetchData("pwd");
    const citaId = params.id;
    return { sCorreo, sPassword, citaId };
}

export function CancelarAppoin() {
    const location = useLocation();
    const navigate = useNavigate();
    const { sCorreo, sPassword, citaId } = useLoaderData();
    const [loading, setLoading] = useState(true);
    const [cita, setCita] = useState([]);
    const [evento, setEvento] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenC, setIsOpenC] = useState(false);
    const [selectedRating, setSelectedRating] = useState(0);
    const [comentario, setComentario] = useState('');
    const [bAcceder, setbAcceder] = useState(true);
    const [flagEvent, setFlagEvent] = useState(location.state?.flagEvent == 1 ? true : false);

    // Function to convert Base64 string to binary data
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
        if (flag == 0) {
            return dateSpanish(formattedDate);
        }
        else {
            return `${timeString}`;
        }

    }

    const _buildConfirm = async () => {
        if (bAcceder) {
            setbAcceder(false);
            setIsOpen(false);
            //Enviar por DELETE
            var options = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            }
            try {
                const response = await fetch(`${urlApi}appoin?apoinment_id=${cita.APOINMENT_ID}&usernotification_id=${cita.BUS_USER_ID}&dorsl=${cita.USER_NAME}&for_who=Bus`, options);
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
    };

    const _buildCalif = async () => {
        //Enviar por POST
        var options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                {
                    'user_id': cita.USER_ID,
                    'bussiness_id': cita.BUSSINESS_ID,
                    'apoinment_id': cita.APOINMENT_ID,
                    'service_level': selectedRating,
                    'comments': comentario
                })
        }
        try {
            const response = await fetch(`${urlApi}businessCalif`, options);
            const json = await response.json();
            if (json['sucess'] == false) {
                setIsOpenC(false);
                // console.log(`Error al calificar cita.`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            else {
                navigate("/");
            }
        }
        catch (e) {
            setIsOpenC(false);
            return;
        }

    };

    const handleRatingChange = (newRating) => {
        setSelectedRating(newRating);
    };

    const handleChangeComentario = evt => {
        const value = evt.target.value;
        setComentario(value);
    };

    const TextoConLinks = ({ text = "" }) => {
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
        const fData = async () => {
            //Solicitar por GET
            try {
                const response = await fetch(`${urlApi}getAppoin?apoinment_id=${citaId}`);
                if (!response.ok) {
                    console.log(`Error getting getAppoin.`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const json = await response.json();
                setCita(json['data']);
                if (json['data']['FLAG_EVENT'] == '1') {
                    // console.log('flagEvent:' + flagEvent);
                    // console.log('bussiness_id:' + json['data']['BUSSINESS_ID']);
                    setFlagEvent(true);
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
                return;
            }
        };
        if (sCorreo == null && sPassword == null) {
            navigate("/");
        }
        fData();
    }, []);

    if (loading) {
        return <Loaging />;
    }

    const photoBase64 = arrayBufferToBase64(cita.BUS_PHOTO == null ? cita.BUS_PHOTO : cita.BUS_PHOTO.data);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-600 to-orange-800 p-4">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-6 text-center mt-20">
                <div className="flex flex-col items-center">
                    {photoBase64 ? (
                        <img className="w-36 h-36 rounded-full object-cover border mt-4" src={`data:image/jpeg;base64,${photoBase64}`} alt="business" />
                    ) : (
                        <img className="w-36 h-36 rounded-full object-cover border mt-4 bg-gray-200" src={User} alt="default" />
                    )}
                    {flagEvent ? <></> : <h1 className='text-3xl text-black'>Resumen de la cita</h1>}
                    <h4 className="mt-3 text-lg font-bold text-gray-900">{cita.DORSL}</h4>
                    {flagEvent ? <p className="mb-2 text-sm text-gray-700">
                        <strong>Vestimenta:</strong> {evento.DRESSCODE || 'Código de vestimenta'}
                    </p> : <></>}
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
                                    <TextoConLinks text={"⚠️ " + (evento.NOTAS || "")} />
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
                    {flagEvent ? <></> : <p className='w-full text-gray-400 mb-4'>{ConvertDateTime(cita.APPOINTMENT_DATE, cita.APPOINTMENT_TIME, 1)} -
                        {ConvertDateTime(cita.APPOINTMENT_DATE, cita.APPOINTMENT_TIME, 0)}</p>}
                    {flagEvent ? <></> : cita.BUS_USER_PHONE &&
                        <div className="w-full flex items-center gap-3 px-4 mt-2" style={{
                            cursor: 'pointer'
                        }}
                            onClick={() => {
                                const cleanNumber = cita.BUS_USER_PHONE.replace(/\D/g, '');
                                if (navigator.platform.indexOf('iPhone') !== -1 || navigator.platform.indexOf('iPad') !== -1 || navigator.platform.indexOf('iPod') !== -1) {
                                    window.open(`https://api.whatsapp.com/send/?phone=${cleanNumber}&text=Hola, ¿Tengo una duda sobre mi cita?&type=phone_number&app_absent=0`);
                                } else {
                                    window.open(`https://api.whatsapp.com/send/?phone=${cleanNumber}&text=Hola, ¿Tengo una duda sobre mi cita?&type=phone_number&app_absent=0`);
                                }
                            }}>
                            <EnvelopeIcon className="w-6 h-6 text-orange-500" />
                            <div>
                                <p className='text-gray-400'>{cita.BUS_USER_PHONE}</p>
                            </div>
                        </div>}
                    {cita.FLAG_ADDRESS != '0' ?
                        <div className="w-full flex items-center gap-3 px-4 mt-2">
                            <MapPinIcon className="w-6 h-6 text-orange-500" />
                            <div>
                                <p className='text-gray-400'>Visita a domicilio</p>
                            </div>
                        </div> : <></>
                    }
                </div>
                {flagEvent ? <></> : <hr className="my-4" />}
                <div className="text-left px-4">
                    {flagEvent ? <></> : <h4 className="text-lg font-semibold">Información de la cita</h4>}
                    {flagEvent ? <></> : <div className="w-full flex items-center gap-3 px-4 mt-2">
                        <InformationCircleIcon className="w-6 h-6 text-orange-500" />
                        <div>
                            <p className='text-gray-400'>Reservada</p>
                        </div>
                    </div>}
                    {flagEvent ? <></> : cita.APPOINTMENT_CONFIRM == 1 ? <div className="w-full flex items-center gap-3 px-4 mt-2">
                        <InformationCircleIcon className="w-6 h-6 text-orange-500" />
                        <div>
                            <p className='text-gray-400'>Confirmada</p>
                        </div>
                    </div> : <></>}
                    {flagEvent ? <></> : cita.ESTATUS == 1 ? <div className="w-full flex items-center gap-3 px-4 mt-2">
                        <InformationCircleIcon className="w-6 h-6 text-orange-500" />
                        <div>
                            <p className='text-gray-400'>Modificada por la empresa</p>
                        </div>
                    </div> : <></>}
                    {flagEvent ? <></> : cita.ESTATUS == -1 ? <div className="w-full flex items-center gap-3 px-4 mt-2">
                        <InformationCircleIcon className="w-6 h-6 text-red-500" />
                        <div>
                            <p className='text-gray-400'>Cancelada</p>
                        </div>
                    </div> : cita.ESTATUS == 3 ?
                        <div className="w-full flex items-center gap-3 px-4 mt-2">
                            <InformationCircleIcon className="w-6 h-6 text-blue-500" />
                            <div>
                                <p className='text-gray-400'>En cita</p>
                            </div>
                        </div> : cita.ESTATUS == 0 || cita.ESTATUS == 1 ?
                            <div className="w-full flex items-center gap-3 px-4 mt-2">
                                <InformationCircleIcon className="w-6 h-6 text-gray-500" />
                                <div>
                                    <p className='text-gray-400'>Pendiente</p>
                                </div>
                            </div> : <div className="w-full flex items-center gap-3 px-4 mt-2">
                                <InformationCircleIcon className="w-6 h-6 text-orange-500" />
                                <div>
                                    <p className='text-gray-400'>Finalizada</p>
                                </div>
                            </div>}
                </div>
                {flagEvent ? <></> : <hr className="my-4" />}
                <div className="text-left px-4">
                    {flagEvent ? <></> : <div className="w-full flex items-center gap-3 px-4 mt-2">
                        {cita.ALIAS == '' ? <></> : <TagIcon className="w-6 h-6 text-orange-500" /> }
                        <div>
                            <p className='text-gray-400'>{cita.ALIAS}</p>
                            <p className='text-gray-400'>{cita.NAME_SPACE}</p>
                        </div>
                    </div>}
                    {flagEvent ? <></> : <div className="w-full flex items-center gap-3 px-4 mt-2">
                        <BuildingStorefrontIcon className="w-6 h-6 text-orange-500" />
                        <div>
                            <p className='text-gray-400'>{cita.CATEGORIA}</p>
                        </div>
                    </div>}
                    {flagEvent ? <></> : <div className="w-full flex items-center gap-3 px-4 mt-2">
                        <ChatBubbleLeftEllipsisIcon className="w-6 h-6 text-orange-500" />
                        <div>
                            <p className='text-gray-400'>{cita.MENSSAGE ? cita.MENSSAGE : 'Sin Motivo de la visita/Servicio'}</p>
                        </div>
                    </div>}
                </div>
                {flagEvent ? <></> : <hr className="my-4" />}
                <div className="text-left px-4">
                    {flagEvent ? <></> : <h4 className="text-lg font-semibold">Ubicación</h4>}
                    {flagEvent ? <></> : cita.BUS_USER_PHONE &&
                        <div className="w-full flex items-center gap-3 px-4 mt-2" style={{
                            cursor: 'pointer'
                        }}
                            onClick={() => {
                                if (navigator.platform.indexOf('iPhone') !== -1 || navigator.platform.indexOf('iPad') !== -1 || navigator.platform.indexOf('iPod') !== -1) {
                                    window.open(`maps://maps.google.com/?q=${cita.ADDRESS_FIRST} ${cita.ADDRESS_SECOND} CP ${cita.POSTAL_CODE} ${cita.CITY}, ${cita.STATE} Mexico`);
                                } else {
                                    window.open(`https://maps.google.com?q=${cita.ADDRESS_FIRST} ${cita.ADDRESS_SECOND} CP ${cita.POSTAL_CODE} ${cita.CITY}, ${cita.STATE} Mexico`);
                                }
                            }}>
                            <MapPinIcon className="w-6 h-6 text-orange-500" />
                            <div>
                                <p className='text-gray-400'>{cita.ADDRESS_FIRST}, {cita.ADDRESS_SECOND}, {cita.POSTAL_CODE}</p>
                                <p className='text-gray-400'>{cita.CITY}, {cita.STATE}, Mexico</p>
                            </div>
                        </div>}
                </div>
                {flagEvent ? <></> : <hr className="my-4" />}
                <div className="mt-6 px-4 mb-6">
                    {bAcceder ? (
                        cita.ESTATUS == -1 ? <></> :
                            <button
                                onClick={() => {
                                    if (cita.ESTATUS == '2' && cita.FLAG_SERVICE_LEVEL == '0') {
                                        setIsOpenC(true);
                                    } else {
                                        setIsOpen(true);
                                    }
                                }}
                                className="w-full py-3 rounded-md font-bold text-white bg-orange-500 hover:bg-orange-600">
                                {cita.ESTATUS == '2' && cita.FLAG_SERVICE_LEVEL == '0' ? 'Calificar'
                                    : 'Cancelar'}
                            </button>
                    ) : (
                        <button className="w-full py-3 rounded-md bg-gray-300">
                            <span className="animate-pulse">Procesando...</span>
                        </button>
                    )}
                </div>
                {/* Modal */}
                {isOpen ? (
                    <>
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative animate-fade-in-up">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="absolute top-3 right-3 text-gray-500 hover:text-orange-500"
                                >
                                    <CloseIcon className="w-5 h-5 text-gray-900" />
                                </button>
                                <h4 className="text-xl font-bold text-center text-black mb-1">Confirmar</h4>
                                <p className="text-center text-yellow-500 mb-4">¿Seguro que quieres cancelar esta cita?</p>
                                <div className='flex justify-end mt-2'>
                                    <button className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mx-2' onClick={() => { setIsOpen(false); }}>Cancelar</button>
                                    <button className='bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600' onClick={() => {
                                        if (cita.ESTATUS == 3 ||
                                            cita.ESTATUS == 2 ||
                                            cita.ESTATUS == -1) {
                                            if (cita.ESTATUS == 3) {
                                                toast.error('No se puede cancelar la cita (Actual)');
                                            } else if (cita.ESTATUS == -1) {
                                                toast.error('No se puede cancelar la cita (Cancelada)');
                                            } else if (cita.FLAG_SERVICE_LEVEL ==
                                                '0') {
                                                _buildCalif();
                                            }
                                        }
                                        else {
                                            _buildConfirm();
                                        }
                                    }}>Confirmar</button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : isOpenC ? (
                    <>
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative animate-fade-in-up">
                                <button
                                    onClick={() => setIsOpenC(false)}
                                    className="absolute top-3 right-3 text-gray-500 hover:text-orange-500"
                                >
                                    <CloseIcon className="w-5 h-5 text-gray-900" />
                                </button>
                                <h4 className="text-xl font-bold text-center text-black mb-1">Calificación</h4>
                                <p className="text-center text-yellow-500 mb-1">Comparte tu calificación con otros usuarios</p>
                                <div className='flex items-center justify-center mb-3'>
                                    <RatingBar onRatingChange={handleRatingChange} />
                                </div>
                                <p className="text-center text-gray-500 mb-2">Comentario para el lugar (Opcional)</p>
                                <hr className="mb-4" />
                                <textarea type="text" className='w-full text-black border px-4 py-2 rounded-md' rows="4" cols="50" placeholder='Puedes añadir cualquier comentario que sea de interés para el lugar' onChange={handleChangeComentario} />

                                <div className='flex justify-end mt-2'>
                                    <button className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mx-2' onClick={() => { setIsOpenC(false); }}>Cancelar</button>
                                    <button className='bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600' onClick={() => {
                                        _buildCalif();
                                    }}>Calificar</button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : null}
            </div>
        </div>);
}

export default CancelarAppoin;