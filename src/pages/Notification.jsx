import { useLoaderData, useNavigate } from 'react-router-dom';
import { fetchData } from "../Wrapper.js";
import { useEffect, useState } from "react";
import { urlApi } from "../styles/Constants.jsx";
// assets
import { BellAlertIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import Loaging from '../components/Loading.jsx';

export function notificationLoader() {
    const sCorreo = fetchData("correo");
    const sPassword = fetchData("pwd");
    return { sCorreo, sPassword };
}

export function Notification() {

    const navigate = useNavigate();
    const { sCorreo, sPassword } = useLoaderData();
    const [loading, setLoading] = useState(true);
    const sUserCitaFix = fetchData("UserCitaFix") ?? [];
    const userId = sUserCitaFix['USER_ID'] ?? "";
    const [notification, setNotification] = useState([]);

    useEffect(() => {
        const fData = async () => {
            //Solicitar por GET
            try {
                const response = await fetch(`${urlApi}notification?userid=${userId}`);
                if (!response.ok) {
                    console.log(`Error getting notification.`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const json = await response.json();
                setNotification(json['data']);
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
            {
                notification.length > 0 ?
                    <div className="gap-2 bg-white rounded-3xl shadow-xl mt-20 p-10 max-w-md w-full text-center animate-fade-in-up">
                        {
                            notification.map((index) => (
                                <div className="flex justify-between bg-white-100 rounded-2xl shadow-2xl overflow-hidden scale-95 hover:scale-100 transition-all duration-300"
                                    key={index['APOINMENT_ID']}
                                    onClick={() => {
                                        if (index['STATUS_DETAIL'] !== 'Cancelada') {
                                            navigate(`/cancelAppoin/${index['APOINMENT_ID']}`);
                                        }
                                    }}  >
                                    <BellAlertIcon width={40}
                                        color={index['STATUS_DETAIL'] == 'Cancelada' ? '#B71C1C' :
                                            index['STATUS_DETAIL'] == 'Creada' ? '#424242' :
                                                index['STATUS_DETAIL'] == 'Actual' ? '#4472C4' : '#fc6500'
                                        } />
                                    <div className="grid">
                                        <label className="text-1xl font-bold text-black">
                                            {
                                                index['STATUS_DETAIL'] == 'Finalizada' ?
                                                    `Cita ${index['STATUS_DETAIL']} en ${index['DORSL']}` :
                                                    index['STATUS_DETAIL'] == 'Finalizada por baja' ?
                                                        `Cita ${index['STATUS_DETAIL']} en ${index['DORSL']}` :
                                                        index['STATUS_DETAIL'] == 'Actual' ?
                                                            `Tu cita está comenzando en ${index['DORSL']}` :
                                                            index['STATUS_DETAIL'] == 'Cancelada' ?
                                                                `Cita ${index['STATUS_DETAIL']} en ${index['DORSL']}` :
                                                                index['STATUS_DETAIL'] == 'Creada' ?
                                                                    `${index['USER_NAME']} tu cita se creo en ${index['DORSL']}` :
                                                                    `${index['DORSL']} modifico tu cita`
                                            }
                                        </label>
                                        <label className="text-1xl text-gray-400">
                                            {
                                                index['DIF_DIAS'] == '0' ? `${index['DIF_HORAS']} h, ${index['DIF_MINUTOS']} min` :
                                                    `${index['DIF_DIAS']} ${index['DIF_DIAS'] == '1' ? 'dia' : 'dias'}, ${index['DIF_HORAS']} h ${index['DIF_MINUTOS']} min`
                                            } </label>
                                    </div>
                                    <ChevronRightIcon width={30} color="black" />
                                </div>
                            ))
                        }
                    </div> : <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center animate-fade-in-up">
                        <BellAlertIcon className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Sin notificaciones</h1>
                        <p className="text-gray-500 text-sm">
                            Actualmente no tienes notificaciones pendientes. ¡Te avisaremos si ocurre algo nuevo!
                        </p>
                    </div>
            }
        </div>
    );
}

export default Notification;
