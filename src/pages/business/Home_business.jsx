// rrd imports
import { useLoaderData, useNavigate } from 'react-router-dom';
import { dateSpanish, fetchData } from "../../Wrapper.js";
import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { toast } from "react-toastify";
import { useProfile } from "../../ProfileContext.jsx";
// assets
import './Find_business.css';
import { ChevronRightIcon, MagnifyingGlassPlusIcon, ShareIcon, UserCircleIcon, UserPlusIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import Pagination from '../../components/Pagination.jsx';
import Loaging from '../../components/Loading.jsx';
import { urlApi } from "../../styles/Constants.jsx";
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

// loader
// export function HomeBusinessLoader() {
//     const sCorreo = fetchData("correo");
//     const sPassword = fetchData("pwd");
//     return { sCorreo, sPassword };
// }

const PageSize = 10;

export function HomeBusiness() {
    const { setProfile } = useProfile();
    const location = useLocation();
    const navigate = useNavigate();
    // const { sCorreo, sPassword } = useLoaderData();
    const sCorreo = fetchData("correo");
    const sPassword = fetchData("pwd");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const sUserCitaFix = fetchData("UserCitaFix") ?? [];
    const [citas, setCitas] = useState([]);
    const stored = JSON.parse(localStorage.getItem("homeBusiness"));
    const businessId = stored.businessId ?? '';
    const businessAdmin = stored.tipo;
    const [empresa, SetEmpresa] = useState([]);

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

    const STATUS_CONFIG = {
        '-1': { label: 'Cancelada', color: 'text-red-500' },
        '0': { label: 'Nueva', color: 'text-sky-400' },
        '1': { label: 'Modificada', color: 'text-blue-700' },
        '2': { label: 'Finalizada', color: 'text-gray-400' },
        '3': { label: 'Actual', color: 'text-blue-500' },
    };

    const getStatusInfo = (status) =>
        STATUS_CONFIG[status] || { label: 'Desconocido', color: 'text-gray-400' };

    useEffect(() => {
        const fData = async () => {
            const uid = sUserCitaFix['USER_ID'];
            if (businessId == '') {
                navigate("/");
            }
            else
                if (sCorreo == null && sPassword == null) {
                    navigate("/");
                }
            try {
                const response = await fetch(`${urlApi}bussinessId?bussiness_id=${businessId}`);
                if (response.status == 200) {
                    const json = await response.json();
                    SetEmpresa(json['data']);
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
                    }
                    catch (e) {
                        navigate("/");
                    }
                } else {
                    console.log(`Error getting bussinessId.`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                setLoading(false);
            }
            catch (e) {
                navigate("/");
            }
        };

        fData();
    }, []);

    if (loading) {
        return <Loaging />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-600 to-gray-800 px-4">
            <div className="max-w-3xl mx-auto mt-20 p-6 space-y-6 text-gray-800">
                <div className="bg-white text-black shadow rounded-xl p-4">
                    <div className="cursor-pointer flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold text-gray-800">{empresa.DORSL}</h2>
                        </div>
                        <div className='flex items-center justify-between ml-2 '>
                            {businessAdmin && <button className='mr-2' onClick={() => navigate("/viewUpdateBusiness", { state: { businessId: businessId, tipo: businessAdmin } })} >
                                <Cog6ToothIcon width={24} />
                            </button>}
                            <button onClick={() => {
                                const baseUrl = '/viewBusiness';
                                const params = new URLSearchParams({
                                    n: empresa.DORSL,
                                    i: businessId
                                });
                                navigate(`${baseUrl}?${params.toString()}`);
                            }
                            } >
                                <ShareIcon width={24} />
                            </button>
                        </div>
                    </div>
                </div>
                {
                    citas.length > 0 ?
                        <div>
                            <div className="bg-white rounded-3xl shadow-xl p-10 max-w-2xl w-full text-center animate-fade-in-up">
                                <h2 className="ms:text-5xl lg:text-5xl font-bold text-orange-600 mb-2">{citas[currentPage - 1]['APPOINTMENT'].length == 1
                                    ? `Tienes ${citas[currentPage - 1]['APPOINTMENT'].length} cita agendada`
                                    : `Tienes ${citas[currentPage - 1]['APPOINTMENT'].length} citas agendadas`}</h2>
                                <p className="ms:text-2xl lg:text-2xl text-gray-600">{ConvertDateTime(citas[currentPage - 1]['APPOINTMENT_DATE'], '00:00:00', 0)}</p>
                                {
                                    citas[currentPage - 1]['APPOINTMENT'].map((index) => {
                                        const statusInfo = getStatusInfo(index['ESTATUS']);
                                        return (
                                            <div className="flex justify-between bg-gray-100 shadow-lg rounded-lg overflow-hidden scale-95 hover:scale-100 transition-all duration-300"
                                                key={index['APOINMENT_ID']}
                                                onClick={() => {
                                                    if (index['ESTATUS'] !== -1 && index['ESTATUS'] !== 2) {
                                                        navigate(`/updateAppoinBusiness/${index['APOINMENT_ID']}`);
                                                    } else {
                                                        toast.error(`No se puede acceder, Cita ${statusInfo.label}`);
                                                    }
                                                }}  >
                                                <div className='flex justify-center items-center ms:ml-3 lg:ml-4 '>
                                                    {
                                                        index['PHOTO'] == null ?
                                                            <UserCircleIcon className='w-12 h-12'
                                                                color={index['ESTATUS'] == -1 ? '#B71C1C' :
                                                                    index['ESTATUS'] == 1 ? '#32325d' :
                                                                        index['ESTATUS'] == 3 || index['APPOINTMENT_CONFIRM'] == 1 ? '#4472C4' : '#fc6500'
                                                                } /> :
                                                            <img id='imgS' src={'data:image/jpeg;base64,' + arrayBufferToBase64(index['PHOTO'].data)} />
                                                    }
                                                </div>
                                                <div className="grid">
                                                    <label className="ms:text-2xl lg:text-2xl font-bold text-black">{ConvertDateTime(citas[currentPage - 1]['APPOINTMENT_DATE'], index['APPOINTMENT_TIME'], 1)} </label>
                                                    <label className="ms:text-2xl lg:text-2xl font-bold text-gray-400">{index['ANONIMO'] == '' ? index['COMPLET_NAME'] : index['ANONIMO'].substring(0, index['ANONIMO'].indexOf(","))} </label>
                                                    <label className="ms:text-1xl lg:text-1xl font-bold text-gray-400">{index['ANONIMO'] != '' ? index['ANONIMO'].substring(index['ANONIMO'].indexOf(",") + 1, index['ANONIMO'].length) : ''} </label>
                                                    <label className={`ms:text-2xl lg:text-2xl font-bold ${statusInfo.color}`}> {statusInfo.label} </label>
                                                    {index['APPOINTMENT_CONFIRM'] == 1 &&
                                                        index['ESTATUS'] !== -1 &&
                                                        index['ESTATUS'] !== 2 && (
                                                            <label className="ms:text-2xl lg:text-2xl font-bold text-blue-500">
                                                                Confirmada
                                                            </label>
                                                        )}
                                                </div>
                                                <ChevronRightIcon width={30} color="black" />
                                            </div>
                                        );
                                    }
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
                                <div className="mx-auto w-56" ><MagnifyingGlassPlusIcon color='#fc6500' /></div>
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
            </div>
            {
                empresa.DORSL == '' ? <div></div> :
                    <div class="fab-container2">                        
                        <div class="button iconbutton">
                            <button
                                onClick={() => navigate("/addAppoinBusinessAnon", { state: { businessId: businessId, dorsl: empresa.DORSL } })} //Cambiar
                                class="fa-solid fa-plus">
                                <UserPlusIcon width={40} />
                            </button>
                            <label class="text-white px-1 font-bold">Invitar</label>
                        </div>
                    </div>
            }
            {
                empresa.DORSL == '' ? <div></div> :
                    <div class="fab-container">
                        <div class="button iconbutton">
                            <button
                                onClick={() => navigate("/findUser")}
                                class="fa-solid fa-plus">
                                <MagnifyingGlassPlusIcon width={40} />
                            </button>
                            <label class="text-white px-1 font-bold">Clientes</label>
                        </div>
                    </div>
            }
            {/* {
                empresa.DORSL == '' ? <div></div> :
                    <div class="fab-container">                        
                        <div class="button iconbutton text-center">
                            <button
                                onClick={() => {
                                    setProfile("user");
                                    navigate("/home");
                                }}
                                class="fa-solid fa-plus">
                                <ArrowPathIcon width={40} />
                            </button>
                            <label class="text-white px-1 font-bold">{sUserCitaFix['first_name']}</label>
                        </div>
                    </div>
            } */}
        </div>
    );
}

export default HomeBusiness;