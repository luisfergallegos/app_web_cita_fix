// rrd imports
import { useLoaderData, useNavigate, useLocation } from 'react-router-dom';
import { fetchData } from "../../Wrapper.js";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
// assets
import Loaging from '../../components/Loading.jsx';
import { urlApi } from "../../styles/Constants.jsx";
import RatingBar from "../../components/RatingBar.jsx";
import { XMarkIcon as CloseIcon } from '@heroicons/react/24/solid';
import VistaEvento from '../../components/VistaEvento.jsx';
import VistaCita from '../../components/VistaCita.jsx';

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
    const [bAccederC, setbAccederC] = useState(false);
    const [calificacionEnviada, setCalificacionEnviada] = useState(false);
    const textos = [
        "",
        "Muy malo",
        "Malo",
        "Regular",
        "Bueno",
        "Excelente"
    ];
    const StarRating = (stars) => "⭐".repeat(stars);

    // Function to convert Base64 string to binary data
    const arrayBufferToBase64 = (buffer) => {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return btoa(binary);
    };



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
                if (!response.ok) {
                    // setIsOpenC(false);
                    // console.log(`Error al calificar cita.`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                if (json['sucess'] == false) {
                    toast.error("No fue posible cancelar tu cita");
                    return;
                }
                else {
                    toast.success("Cita cancelada");
                    navigate("/");
                }
            }
            catch (e) {
                return;
            }
            finally {
                setbAcceder(true);
            }

        }
    };

    const _buildCalif = async () => {
        setbAccederC(true);
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
                    'comments': comentario.trim()
                })
        }
        try {
            const response = await fetch(`${urlApi}businessCalif`, options);
            const json = await response.json();
            if (!response.ok) {
                // setIsOpenC(false);
                // console.log(`Error al calificar cita.`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            if (json['sucess'] == false) {
                toast.error("No fue posible enviar tu calificación.");
                return;
            }
            else {
                setCalificacionEnviada(true);
                // navigate("/");
            }
        }
        catch (e) {
            return;
        }
        finally {
            setbAccederC(false);
            // setIsOpenC(false);
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
                if (json['data']['USER_EMAIL'] !== sCorreo) {
                    navigate("/");
                }
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

                {flagEvent ?
                    <VistaEvento evento={evento} cita={cita} /> :
                    <VistaCita cita={cita} photoBase64={photoBase64} setIsOpenC={setIsOpenC} setIsOpen={setIsOpen} bAcceder={bAcceder} />}

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
                    !calificacionEnviada ?
                        <><div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                                <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative animate-fade-in-up">
                                    <button
                                        onClick={() => setIsOpenC(false)}
                                        className="absolute top-3 right-3 text-gray-500 hover:text-orange-500"
                                    >
                                        <CloseIcon className="w-5 h-5 text-gray-900" />
                                    </button>
                                    <h4 className="text-xl font-bold text-center text-black mb-1">Califica tu experiencia</h4>
                                    <p className="text-center text-yellow-500 mb-1">¿Qué te pareció el servicio?</p>
                                    <div className='flex items-center justify-center mb-1'>
                                        <RatingBar onRatingChange={handleRatingChange} />
                                    </div>
                                    <p className="text-sm text-orange-600 font-medium mb-3">
                                        {textos[selectedRating]}
                                    </p>
                                    <p className="text-center text-gray-500 mb-2">¿Quieres contar cómo fue tu experiencia?</p>
                                    <hr className="mb-4" />
                                    <textarea type="text" maxLength={300} className='w-full text-black border px-4 py-2 rounded-md' rows="4" cols="50" placeholder='Cuéntale a otros usuarios cómo fue tu experiencia...' onChange={handleChangeComentario} />
                                    <div className="mt-2 text-right text-xs text-gray-400">
                                        {comentario.length}/300
                                    </div>
                                    <div className='flex justify-end mt-2'>
                                        <button className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mx-2' onClick={() => { setIsOpenC(false); }}>Cancelar</button>
                                        {bAccederC ? <button className="px-4 py-2 rounded-md bg-gray-300">
                                            <span className="animate-pulse">Enviando...</span>
                                        </button> : <button className='bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600'
                                            onClick={() => {
                                                if (selectedRating === 0) {
                                                    toast.warning("Selecciona una calificación ⭐.");
                                                    return;
                                                }
                                                if (comentario.length === 0) {
                                                    toast.warning("¡Tu opinión importa! Cuéntanos tu experiencia para ayudar a otros usuarios.");
                                                    return;
                                                }
                                                _buildCalif();
                                            }}>Calificar</button>}
                                    </div>
                                </div>
                            </div>
                        </> : <>
                            <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                                <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative animate-fade-in-up">
                                    <div className="text-center">
                                        <p className="text-5xl text-yellow-500 mb-4">
                                            {StarRating(selectedRating)}
                                        </p>
                                        <h3 className="text-xl font-bold text-gray-900">
                                            ¡Muchas gracias!
                                        </h3>
                                        <p className="mt-2 text-gray-500">
                                            Tu opinión ayudará a otros usuarios
                                            a elegir el mejor servicio.
                                        </p>
                                    </div>
                                    <div className="mt-6">
                                        <button className='w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition' 
                                        onClick={() => { setIsOpenC(false); navigate("/"); }}>Volver al inicio</button>
                                    </div>
                                </div>
                            </div>
                        </>
                ) : null}
            </div>
        </div>);
}

export default CancelarAppoin;