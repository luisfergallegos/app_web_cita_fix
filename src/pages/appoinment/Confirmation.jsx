// Library
import { BuildingStorefrontIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/solid';
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
import VistaEvento from '../../components/VistaEvento.jsx';
import ConfirmationCita from '../../components/ConfirmationCita.jsx';

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
    const [flagEvent, setFlagEvent] = useState(searchParams.get("fe") == 'true' ? true : false);

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
        if (flag == 0) {
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
        // Cargar user info desde loader
        if (!apoinment_id) {
            navigate("/");
        }
        const fData = async () => {
            //Solicitar por GET
            try {
                // const response = await fetch(`${urlApi}getAppoin?apoinment_id=${apoinment_id}`);
                // console.log("📡 URL:", `${urlApi}getAppoin?apoinment_id=${apoinment_id}`);
                const response = await fetch(`${urlApi}getAppoin?apoinment_id=${apoinment_id}`)
                    .catch(err => {
                        console.error("❌ FETCH ERROR:", err);
                    });
                // console.log("📡 RESPONSE:", response);
                if (!response.ok) {
                    console.log(`Error getting getAppoin.`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                // const json = await response.json();
                const json = await response.json().catch(e => console.log("❌ JSON PARSE ERROR:", e));
                // console.log("📡 JSON:", json);
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

    const photoBase64 = arrayBufferToBase64(cita.BUS_PHOTO == null ? cita.BUS_PHOTO : cita.BUS_PHOTO.data);
    const canCalificar = cita.ESTATUS == 2;

    return (
        <div>

            {
                sCorreo == null & sPassword == null ?
                    /* Navbar */
                    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur">
                        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                            <div className="text-2xl font-bold tracking-tight">
                                <a href="https://www.plannersday.com/"><img className='h-10 w-auto' src={Logo} alt="" /></a>
                            </div>
                            <nav className="hidden gap-8 md:flex">
                            </nav>
                            <button className="rounded-full bg-orange-600 px-5 py-2 text-sm font-semibold text-white transition hover:scale-105"
                                onClick={() => navigate("/login")}>
                                Iniciar sesión
                            </button>
                        </div>
                    </header> : <div></div>
            }
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-600 to-gray-800 px-4">
                <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-6 text-center mt-20">

                    {flagEvent ?
                        <VistaEvento evento={evento} cita={cita} indexConfirm={indexConfirm} indexConfirmNot={indexConfirmNot} bAcceder={bAcceder} /> :
                        <ConfirmationCita cita={cita} photoBase64={photoBase64} indexConfirm={indexConfirm} indexConfirmNot={indexConfirmNot} bAcceder={bAcceder} />}

                </div>
            </div>
        </div>
    );
}

export default Confirmation;