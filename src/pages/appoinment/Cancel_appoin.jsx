// rrd imports
import { useLoaderData, useNavigate } from 'react-router-dom';
import { dateSpanish, fetchData } from "../../Wrapper.js";
import { useEffect, useState } from "react";
// assets
import './Add_appoin.css';
import Loaging from '../../components/Loading.jsx';
import { urlApi } from "../../styles/Constants.jsx";
import RatingBar from "../../components/RatingBar.jsx";
import User from "../../assets/e.png";
import { BuildingStorefrontIcon, EnvelopeIcon, InformationCircleIcon, MapPinIcon, XMarkIcon as CloseIcon } from '@heroicons/react/24/solid';

// loader
export async function CancelarAppoinLoader({ params }) {
    const sCorreo = fetchData("correo");
    const sPassword = fetchData("pwd");
    const citaId = params.id;
    return { sCorreo, sPassword, citaId };
}

export function CancelarAppoin() {
    const navigate = useNavigate();
    const { sCorreo, sPassword, citaId } = useLoaderData();
    const [loading, setLoading] = useState(true);
    const [cita, setCita] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenC, setIsOpenC] = useState(false);
    const [selectedRating, setSelectedRating] = useState(0);
    const [comentario, setComentario] = useState('');

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
        if (flag === 0) {
            return dateSpanish(formattedDate);
        }
        else {
            return `${timeString}`;
        }

    }

    const _buildConfirm = async () => {
        //Enviar por DELETE
        var options = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        }
        try {
            const response = await fetch(`${urlApi}appoin?apoinment_id=${cita.APOINMENT_ID}&usernotification_id=${cita.BUS_USER_ID}&dorsl=${cita.DORSL}&for_who=Bus`, options);
            const json = await response.json();
            if (json['sucess'] == false) {
                setIsOpen(false);
                console.log(`Error al cancelar cita.`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            else {
                navigate("/");
            }
        }
        catch (e) {
            setIsOpen(false);
            return;
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
                console.log(`Error al calificar cita.`);
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
        <div className="min-h-screen grid items-center justify-center bg-gradient-to-br from-orange-600 to-orange-800 px-4">
            <div className="bg-white rounded-3xl shadow-xl mt-5 mb-10 text-center animate-fade-in-up">
                <div className="flex justify-center mb-4">
                    {
                        cita.BUS_PHOTO === null ? <img className="w-40 h-40 object-cover rounded-full border mt-8" src={User} /> :
                            <img className="w-40 h-40 object-cover rounded-full border mt-8" src={'data:image/jpeg;base64,' + arrayBufferToBase64(cita.BUS_PHOTO.data)} />
                    }
                </div>
                <div>
                    <h1 className='text-3xl text-black'>Resumen de la cita</h1>
                    <h4 className='text-2xl font-bold text-black mb-1'>{cita.DORSL}</h4>
                    <p className='w-full text-gray-400 mb-4'>{ConvertDateTime(cita.APPOINTMENT_DATE, cita.APPOINTMENT_TIME, 1)} -
                        {ConvertDateTime(cita.APPOINTMENT_DATE, cita.APPOINTMENT_TIME, 0)}</p>
                    {cita.BUS_USER_PHONE &&
                        <div className='flex justify-start items-center ms-4' style={{
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
                            <EnvelopeIcon className='w-8 h-8 md:w-10 md:h-10 lg:w-10 lg:h-10 mx-4 text-orange-500' />
                            <div>
                                <p className='text-gray-400'>{cita.BUS_USER_PHONE}</p>
                            </div>
                        </div>}
                    {cita.FLAG_ADDRESS != '0' ?
                        <div className='flex justify-start items-center ms-4'>
                            <MapPinIcon className='w-8 h-8 md:w-10 md:h-10 lg:w-10 lg:h-10 mx-4 text-orange-500' />
                            <div>
                                <p className='text-gray-400'>Visita a domicilio</p>
                            </div>
                        </div> : <></>
                    }
                </div>
                <hr className="mb-4 mt-4" />
                <div>
                    <h1 className='font-bold text-black mb-1'>Información de la cita</h1>
                    <div className='flex justify-start items-center ms-4'>
                        <InformationCircleIcon className='w-8 h-8 md:w-10 md:h-10 lg:w-10 lg:h-10 mx-4 text-orange-500' />
                        <div>
                            <p className='text-gray-400'>Cita reservada</p>
                        </div>
                    </div>
                    {
                        cita.ESTATUS == '1' ?
                            <div className='flex justify-start items-center ms-4'>
                                <InformationCircleIcon className='w-8 h-8 md:w-10 md:h-10 lg:w-10 lg:h-10 mx-4 text-orange-500' />
                                <div>
                                    <p className='text-gray-400'>Cita modificada por la empresa</p>
                                </div>
                            </div> : <div></div>
                    }
                    {
                        cita.ESTATUS == '-1' ? <div className='flex justify-start items-center ms-4'>
                            <InformationCircleIcon className='w-8 h-8 md:w-10 md:h-10 lg:w-10 lg:h-10 mx-4 text-red-500' />
                            <div>
                                <p className='text-gray-400'>Cita cancelada</p>
                            </div>
                        </div> :
                            cita.ESTATUS == '3' ?
                                <div className='flex justify-start items-center ms-4'>
                                    <InformationCircleIcon className='w-8 h-8 md:w-10 md:h-10 lg:w-10 lg:h-10 mx-4 text-blue-500' />
                                    <div>
                                        <p className='text-gray-400'>En cita</p>
                                    </div>
                                </div> :
                                cita.ESTATUS == '0' || cita.ESTATUS == '1' ?
                                    <div className='flex justify-start items-center ms-4'>
                                        <InformationCircleIcon className='w-8 h-8 md:w-10 md:h-10 lg:w-10 lg:h-10 mx-4 text-gray-500' />
                                        <div>
                                            <p className='text-gray-400'>Cita pendiente</p>
                                        </div>
                                    </div> : <div className='flex justify-start items-center ms-4'>
                                        <InformationCircleIcon className='w-8 h-8 md:w-10 md:h-10 lg:w-10 lg:h-10 mx-4 text-orange-500' />
                                        <div>
                                            <p className='text-gray-400'>Cita finalizada</p>
                                        </div>
                                    </div>
                    }
                    <hr className="mb-4 mt-4" />
                    <div className='flex justify-start items-center ms-4'>
                        <BuildingStorefrontIcon className='w-8 h-8 md:w-10 md:h-10 lg:w-10 lg:h-10 mx-4 text-orange-500' />
                        <div>
                            <p className='text-gray-400'>{cita.CATEGORIA}</p>
                        </div>
                    </div>
                    <hr className="mb-4 mt-4" />
                    <h1 className='font-bold text-black mb-1'>Ubicación</h1>
                    <div className='flex justify-start items-center ms-4'
                        style={{
                            cursor: 'pointer'
                        }}
                        onClick={() => {
                            if (navigator.platform.indexOf('iPhone') !== -1 || navigator.platform.indexOf('iPad') !== -1 || navigator.platform.indexOf('iPod') !== -1) {
                                window.open(`maps://maps.google.com/?q=${cita.ADDRESS_FIRST} ${cita.ADDRESS_SECOND} CP ${cita.POSTAL_CODE} ${cita.CITY}, ${cita.STATE} Mexico`);
                            } else {
                                window.open(`https://maps.google.com?q=${cita.ADDRESS_FIRST} ${cita.ADDRESS_SECOND} CP ${cita.POSTAL_CODE} ${cita.CITY}, ${cita.STATE} Mexico`);
                            }
                        }}>
                        <MapPinIcon className='w-8 h-8 md:w-10 md:h-10 lg:w-10 lg:h-10 mx-4 text-orange-500' />
                        <div className='text-left'>
                            <p className='text-gray-400'>{cita.ADDRESS_FIRST}, {cita.ADDRESS_SECOND}, {cita.POSTAL_CODE}</p>
                            <p className='text-gray-400'>{cita.CITY}, {cita.STATE}, Mexico</p>
                        </div>
                    </div>
                    <hr className="mb-4 mt-4" />
                    <div className='businessBtn'>
                        <button className='mb-10' onClick={() => {
                            if (cita.ESTATUS == '2' && cita.FLAG_SERVICE_LEVEL == '0') {
                                setIsOpenC(true);
                            } else {
                                setIsOpen(true);
                            }
                        }}>{cita.ESTATUS == '2' && cita.FLAG_SERVICE_LEVEL == '0' ? 'Calificar'
                            : 'Cancelar'}</button>
                    </div>
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
                                        if (cita.ESTATUS == '3' ||
                                            cita.ESTATUS == '2' ||
                                            cita.ESTATUS == '-1') {
                                            if (cita.ESTATUS == '3') {
                                                alert('No se puede cancelar la cita (Actual)');
                                            } else if (cita.ESTATUS == '-1') {
                                                alert('No se puede cancelar la cita (Cancelada)');
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
                ) : null }
            </div>
        </div>);
}

export default CancelarAppoin;