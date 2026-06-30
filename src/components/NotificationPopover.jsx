// rrd imports
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { urlApi } from "../styles/Constants.jsx";
import { fetchData } from "../Wrapper.js";
// assets
import { BellAlertIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import Loaging from '../components/Loading.jsx';

export default function NotificationPopover() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState([]);
    const [colaboraciones, setColaboraciones] = useState([]);
    const [notificationAll, setNotificationAll] = useState([]);
    const [colaboracionesAll, setColaboracionesAll] = useState([]);
    const sUserCitaFix = fetchData("UserCitaFix") ?? [];
    const userId = sUserCitaFix['USER_ID'] ?? "";
    const [viewAll, setViewAll] = useState(true);

    useEffect(() => {
        const fData = async () => {
            console.log('fData');
            //Solicitar por GET
            try {
                const response = await fetch(`${urlApi}notification?userid=${userId}`);
                if (!response.ok) {
                    console.log(`Error getting notification.`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const json = await response.json();
                setNotificationAll(json['data']);
                setNotification(json['data'].slice(0, 3));
                let Aux = json['data'];
                //Solicitar por GET
                try {
                    const response = await fetch(`${urlApi}usrInfCol?user_id=${userId}`);
                    if (response.status == 200) {
                        const json = await response.json();
                        setColaboracionesAll(json['data'].filter(e => e.CONFIRM == 0));
                        setColaboraciones(json['data'].filter(e => e.CONFIRM == 0).slice(0, 3));
                        localStorage.setItem("numNot", json['data'].filter(e => e.CONFIRM == 0).length + Aux.length);
                    } else {
                        console.log(`Error getting setUserAdditInf.`);
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                }
                catch (e) {
                    return;
                }
            }
            catch (e) {
                return;
            }
            finally {
                setLoading(false);
            }
        };
        fData();
    }, []);

    if (loading) {
        return <div className="absolute right-0 mt-4 w-96 rounded-2xl bg-white border shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b">
                <h3 className="font-bold text-lg">
                    Notificaciones
                </h3>
            </div>

            <Loaging />

            <div className="border-t">
                <button
                    className="w-full py-3 hover:bg-gray-50 text-orange-500 font-semibold"
                >
                    Ver todas
                </button>
            </div>
        </div>;
    }

    return (
        <div className="absolute right-0 mt-4 w-96 rounded-2xl bg-white border shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b">
                <h3 className="font-bold text-lg">
                    Notificaciones
                </h3>
            </div>

            <div className="max-h-96 overflow-y-auto">

                {
                    notification.length > 0 ?
                        <>
                            {
                                colaboraciones.length > 0 ? colaboraciones.map((index) => (
                                    <div className="flex justify-center items-center shadow-lg rounded-lg overflow-hidden scale-95 hover:scale-100 transition-all duration-300"
                                        key={index.ID}
                                        onClick={() => {
                                            navigate("/home");
                                        }} >
                                        <BellAlertIcon width={40} className='ml-2 text-orange-500 flex-shrink-0' />
                                        <div className="grid mb-4 mt-4 ml-2 mr-2">
                                            <label className="text-1xl font-bold text-black">
                                                {
                                                    `Invitación de ${index['DORSL']}`
                                                }
                                            </label>
                                            <label className="text-1xl text-gray-400">
                                                Lo(a) han invitado a colaborar en la empresa. </label>
                                        </div>
                                        <ChevronRightIcon width={30} className='mr-2 flex-shrink-0' color="black" />
                                    </div>))
                                    : <></>
                            }
                            {
                                notification.map((index) => (
                                    <div className="flex justify-center items-center shadow-lg rounded-lg overflow-hidden scale-95 hover:scale-100 transition-all duration-300"
                                        key={index['APOINMENT_ID']}
                                        onClick={() => {
                                            if (index['STATUS_DETAIL'] !== 'Cancelada') {
                                                navigate(`/cancelAppoin/${index['APOINMENT_ID']}`, { state: { flagEvent: index['FLAG_EVENT'] } });
                                            }
                                        }}  >
                                        <BellAlertIcon width={40} className='ml-2 flex-shrink-0'
                                            color={index['STATUS_DETAIL'] == 'Cancelada' ? '#B71C1C' :
                                                index['STATUS_DETAIL'] == 'Creada' ? '#424242' :
                                                    index['STATUS_DETAIL'] == 'Actual' ? '#4472C4' : '#fc6500'
                                            } />
                                        <div className="grid mb-4 mt-4 ml-2 mr-2">
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
                                        <ChevronRightIcon width={30} className='mr-2 flex-shrink-0' color="black" />
                                    </div>
                                ))
                            }
                        </> :
                        colaboraciones.length > 0 ?
                            <>
                                {
                                    colaboraciones.length > 0 ? colaboraciones.map((index) => (
                                        <div className="flex justify-center items-center shadow-lg rounded-lg overflow-hidden scale-95 hover:scale-100 transition-all duration-300"
                                            key={index.ID}
                                            onClick={() => {
                                                navigate("/home");
                                            }} >
                                            <BellAlertIcon width={40} className='ml-2 text-orange-500 flex-shrink-0' />
                                            <div className="grid mb-4 mt-4 ml-2 mr-2">
                                                <label className="text-1xl font-bold text-black">
                                                    {
                                                        `Invitación de ${index['DORSL']}`
                                                    }
                                                </label>
                                                <label className="text-1xl text-gray-400">
                                                    Lo(a) han invitado a colaborar en la empresa. </label>
                                            </div>
                                            <ChevronRightIcon width={30} className='mr-2 flex-shrink-0' color="black" />
                                        </div>))
                                        : <></>
                                }
                            </>
                            :
                            <>
                                <BellAlertIcon className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                                <h1 className="text-2xl font-bold text-gray-800 mb-2">Sin notificaciones</h1>
                                <p className="text-gray-500 text-sm">
                                    Actualmente no tienes notificaciones pendientes. ¡Te avisaremos si ocurre algo nuevo!
                                </p>
                            </>
                }

            </div>

            <div className="border-t">
                {viewAll ? <button
                    className="w-full py-3 hover:bg-gray-50 text-orange-500 font-semibold"
                    onClick={() => { setNotification(notificationAll); setColaboraciones(colaboracionesAll); setViewAll(!viewAll); }}
                >
                    Ver todas
                </button> : <div className="w-full py-3 hover:bg-gray-50 text-orange-500 font-semibold"></div>}
            </div>



        </div>
    );

}