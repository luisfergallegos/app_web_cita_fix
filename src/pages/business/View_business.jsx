// Library
import { BuildingStorefrontIcon, MapPinIcon, PhoneIcon, CalendarDaysIcon, StarIcon } from '@heroicons/react/24/solid';
import '../../components/CardBusiness.css';
// assents
import Store from "../../assets/business.png";
import Logo from "../../assets/splash_white.png";
import Loaging from '../../components/Loading.jsx';
// rrd imports
import { useLoaderData, useNavigate } from 'react-router-dom';
import { urlApi } from "../../styles/Constants.jsx";
import { useEffect, useState } from "react";

const StarRating = (stars) => '⭐'.repeat(stars);

// loader
export async function ViewBusinessLoader({ params }) {
    const businessId = params.id;
    return { businessId };
}

export function ViewBusiness() {
    const navigate = useNavigate();
    const { businessId } = useLoaderData();
    const [loading, setLoading] = useState(true);
    const [qualifications, setQualifications] = useState([]);
    const [horario, setHorario] = useState([]);
    // Function to convert Base64 string to binary data
    const arrayBufferToBase64 = (buffer) => {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return btoa(binary);
    };
    const [empresa, SetEmpresa] = useState([]);

    const handleButtonIcon = async (e) => {
        e.stopPropagation();
        setIsOpen(true);
        setIndexEmp(empresa);
        try {
            const response = await fetch(`${urlApi}getBusCalif?bussiness_id=${empresa['BUSSINESS_ID']}`);
            const json = await response.json();
            if (json['sucess']) {
                setQualifications(json['data']);
            }
            else {
                setQualifications([]);
            }
            if (!response.ok) {
                console.log(`Error getting empresas.`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

        }
        catch (e) {
            return;
        }
    }

    const handleADDRESS = (e) => {
        e.stopPropagation();
        if (navigator.platform.indexOf('iPhone') !== -1 || navigator.platform.indexOf('iPad') !== -1 || navigator.platform.indexOf('iPod') !== -1) {
            window.open(`maps://maps.google.com/?q=${empresa.ADDRESS_FIRST} ${empresa.ADDRESS_SECOND} CP ${empresa.POSTAL_CODE} ${empresa.CITY}, ${empresa.STATE} Mexico`);
        } else {
            window.open(`https://maps.google.com?q=${empresa.ADDRESS_FIRST} ${empresa.ADDRESS_SECOND} CP ${empresa.POSTAL_CODE} ${empresa.CITY}, ${empresa.STATE} Mexico`);
        }
    }

    useEffect(() => {
        // Cargar user info desde loader
        if (!businessId) {
            navigate("/");
        }
        const fData = async () => {
            //Solicitar por GET
            try {
                const response = await fetch(`${urlApi}bussinessId?bussiness_id=${businessId}`);
                if (response.status == 200) {
                    const json = await response.json();
                    SetEmpresa(json['data']);
                    try {
                        const response = await fetch(`${urlApi}getBusCalif?bussiness_id=${businessId}`);
                        const json = await response.json();
                        if (json['sucess']) {
                            setQualifications(json['data']);
                        }
                        else {
                            setQualifications([]);
                        }
                        if (!response.ok) {
                            console.log(`Error getting empresas.`);
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        //Solicitar por GET
                        try {
                            const response = await fetch(`${urlApi}schedule?bussinessId=${businessId}`);
                            if (response.status == 200) {
                                const json = await response.json();
                                setHorario(json['data']);
                            } else {
                                console.log(`Error getting schedule.`);
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                            setLoading(false);
                        }
                        catch (e) {
                            setLoading(false);
                            return;
                        }
                    }
                    catch (e) {
                        setLoading(false);
                        return;
                    }
                } else {
                    console.log(`Error getting bussinessId.`);
                    throw new Error(`HTTP error! status: ${response.status}`);
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
            <div className="flex justify-between items-center w-full bg-gradient-to-br from-orange-600 to-orange-800">
                <a href="https://www.plannersday.com/"><img className='w-58 h-14' src={Logo} alt="" /></a>
                <a href="https://app.plannersday.com/"><span className='me-6 text-white text-xl'>Iniciar sesión</span></a>
            </div>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-600 to-orange-800 px-4">

                <div className="bg-white rounded-3xl shadow-xl p-10 max-w-2xl w-full text-center animate-fade-in-up">
                    <div className='flex justify-center mb-4'>
                        {
                            empresa.PHOTO === null ?
                                <img className="w-64 h-64 object-cover rounded-full border" id='store' src={Store} /> :
                                <img className="w-64 h-64 object-cover rounded-full border" src={'data:image/jpeg;base64,' + arrayBufferToBase64(empresa.PHOTO.data)} />
                        }
                    </div>
                    <div className='CardContainer_Titulo'>
                        <h4><b>{empresa.DORSL}</b></h4>
                        <p className='eighth'>{empresa.CATEGORY}</p>
                        <p>{StarRating(empresa.SERVICE_LEVEL)}</p>
                    </div>
                    <hr className="mb-4" />
                    <div className='CardContainer_Detalle'>
                        <div className='CardContainer_DetalleIcon'>
                            <MapPinIcon />
                        </div>
                        <div onClick={handleADDRESS}>
                            <p>{empresa.ADDRESS_FIRST}, {empresa.ADDRESS_SECOND}, {empresa.POSTAL_CODE} {empresa.CITY}, {empresa.STATE}, Mexico</p>
                        </div>
                    </div>
                    {empresa.phone && <div className='CardContainer_Detalle'>
                        <div className='CardContainer_DetalleIcon'>
                            <PhoneIcon />
                        </div>

                        {empresa.phone}
                    </div>}

                    <div className='CardContainer_Detalle'>
                        <div className='CardContainer_DetalleIcon'>
                            <CalendarDaysIcon />
                        </div>
                        <div className="space-y-3 max-h-200 overflow-y-auto">
                            {horario.length > 0 ? (
                                horario.map((h) => (
                                    h.value == 1 ?
                                        <div key={h.schedule_id} className="text-sm text-gray-700">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium ms-4 me-6">{h.day_name}</span>
                                                <span className='ms-2 me-2'>{h.desdeH}:{h.desdeM}</span>
                                                <span >a</span>
                                                <span className='ms-2 me-2'>{h.hastaH}:{h.hastaM}</span>
                                            </div>
                                            <hr className="my-2" />
                                        </div> : <></>
                                ))
                            ) : (
                                <p className="text-gray-400 text-sm">Sin Horario.</p>
                            )}
                        </div>
                    </div>
                    <hr className="mb-4" />
                    <div>
                        <h5 className="text-sm font-semibold mb-2">Calificaciones</h5>
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                            {qualifications.length > 0 ? (
                                qualifications.map((q) => (
                                    <div key={q.SERVICE_LEVEL_DATE} className="text-sm text-gray-700">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">{q.USER}</span>
                                            <span>{StarRating(q.SERVICE_LEVEL)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs text-gray-400">{q.SERVICE_LEVEL_DATE}</p>
                                            <p className="text-sm mt-1">{q.COMMENTS}</p>
                                        </div>
                                        <hr className="my-2" />
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 text-sm">Sin calificaciones disponibles.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewBusiness;