// rrd imports
import { useLoaderData, useNavigate } from 'react-router-dom';
import { dateSpanish, fetchData } from "../../Wrapper.js";
import { useEffect, useState } from "react";
// assets
import './Find_business.css';
import { ChevronRightIcon, ShareIcon, UserCircleIcon, UserPlusIcon } from '@heroicons/react/24/solid';
import Pagination from '../../components/Pagination.jsx';
import Loaging from '../../components/Loading.jsx';
import { urlApi } from "../../styles/Constants.jsx";
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

// loader
export function HomeBusinessLoader() {
    const sCorreo = fetchData("correo");
    const sPassword = fetchData("pwd");
    const sUserCitaFix = fetchData("UserCitaFix") ?? [];
    const dorsl = sUserCitaFix['DORSL'];
    return { sCorreo, sPassword, dorsl };
}

const PageSize = 10;

export function HomeBusiness() {
    const navigate = useNavigate();
    const { sCorreo, sPassword, dorsl } = useLoaderData();
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const sUserCitaFix = fetchData("UserCitaFix") ?? [];
    const [citas, setCitas] = useState([]);

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

    useEffect(() => {
        const fData = async () => {
            const businessId = sUserCitaFix['BUSSINESS_ID'];
            const uid = sUserCitaFix['USER_ID'];
            //Solicitar por GET
            var options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'x-citafix-id': uid
                }
            }
            try {
                const response = await fetch(`${urlApi}appoinBussiness?bussiness_id=${businessId}`, options);
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
        if (dorsl === '') {
            navigate("/");
        }
        else if (sCorreo === null && sPassword === null) {
            navigate("/");
        }
        fData();
    }, []);

    if (loading) {
        return <Loaging />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-600 to-gray-800 px-4">
            {
                citas.length > 0 ?
                    <div>
                        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-2xl w-full text-center animate-fade-in-up">
                            <h2 className="text-5xl font-bold text-orange-600 mb-2">{citas[currentPage - 1]['APPOINTMENT'].length == 1
                                ? `Tienes ${citas[currentPage - 1]['APPOINTMENT'].length} cita agendada`
                                : `Tienes ${citas[currentPage - 1]['APPOINTMENT'].length} citas agendadas`}</h2>
                            <p className="text-gray-600">{ConvertDateTime(citas[currentPage - 1]['APPOINTMENT_DATE'], '00:00:00', 0)}</p>
                            {
                                citas[currentPage - 1]['APPOINTMENT'].map((index) => (
                                    <div className="flex justify-between bg-white-100 rounded-2xl shadow-2xl overflow-hidden scale-95 hover:scale-100 transition-all duration-300"
                                        key={index['APOINMENT_ID']}
                                        onClick={() => {
                                            if (index['ESTATUS'] !== '-1' && index['ESTATUS'] !== '2') {
                                                navigate(`/updateAppoinBusiness/${index['APOINMENT_ID']}`);
                                            }
                                        }}  >
                                        {
                                            index['PHOTO'] === null ?
                                                <UserCircleIcon width={80}
                                                    color={index['ESTATUS'] == '-1' ? '#B71C1C' :
                                                        index['ESTATUS'] == '1' ? '#32325d' :
                                                            index['ESTATUS'] == '3' ? '#4472C4' : '#fc6500'
                                                    } /> :
                                                <img id='imgS' src={'data:image/jpeg;base64,' + arrayBufferToBase64(index['PHOTO'].data)} />

                                        }
                                        <div className="grid">
                                            <label className="text-2xl font-bold text-black">{ConvertDateTime(citas[currentPage - 1]['APPOINTMENT_DATE'], index['APPOINTMENT_TIME'], 1)} </label>
                                            <label className="text-1xl font-bold text-gray-400">{index['ANONIMO'] == '' ? index['COMPLET_NAME'] : index['ANONIMO'].substring(0, index['ANONIMO'].indexOf(","))} </label>
                                            <label className="text-1xl font-bold text-gray-400">{index['ANONIMO'] != '' ? index['ANONIMO'].substring(index['ANONIMO'].indexOf(",") + 1, index['ANONIMO'].length) : ''} </label>
                                            <label className="text-1xl font-bold text-gray-400">{index['ESTATUS'] == '1' ? 'Cita modificada.' : ''} </label>
                                        </div>
                                        <ChevronRightIcon width={30} color="black" />
                                    </div>

                                )
                                )
                            }

                        </div>
                        <Pagination
                            className="pagination-bar flex items-center justify-center"
                            currentPage={currentPage}
                            totalCount={citas.length}
                            pageSize={PageSize}
                            onPageChange={page => setCurrentPage(page)}
                        />
                    </div>
                    :
                    <div className="bg-white rounded-3xl shadow-xl p-10 max-w-2xl w-full text-center animate-fade-in-up">
                        <div className="space-y-4">
                            <div className="mx-auto w-56" ><UserPlusIcon color='#fc6500' /></div>
                            <p className="text-gray-600">No olvides guardar tus citas!</p>
                            <p className="text-gray-600">Guarda tus proximas citas de manera fácil y al instante. </p>
                            <p className="text-gray-600 mb-4">Dirígete al buscador de cliente</p>
                            <button
                                onClick={() => navigate("/findUser")}
                                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-md shadow-md transition"
                            >
                                Ir a clientes
                            </button>
                        </div>
                    </div>
            }
            {
                dorsl == '' ? <div></div> :
                    <div class="fab-container3">
                        <div class="button iconbutton">
                            <button
                                onClick={() => (console.log('clic'))}
                                class="fa-solid fa-plus"
                            >
                                <ShareIcon width={40} />
                            </button>
                        </div>
                    </div>
            }
            {
                dorsl == '' ? <div></div> :
                    <div class="fab-container2">
                        <div class="button iconbutton">
                            <button
                                onClick={() => navigate("/findUser")}
                                class="fa-solid fa-plus"
                            >
                                <UserPlusIcon width={40} />
                            </button>
                        </div>
                    </div>
            }
            {
                dorsl == '' ? <div></div> :
                    <div class="fab-container">
                        <div class="button iconbutton">
                            <button
                                onClick={() => navigate("/viewUpdateBusiness")}
                                class="fa-solid fa-plus"
                            >
                                <Cog6ToothIcon width={40} />
                            </button>
                        </div>
                    </div>
            }


        </div>
    );
}

export default HomeBusiness;