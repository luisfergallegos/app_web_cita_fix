// rrd imports
import { useLoaderData, useNavigate } from "react-router-dom";
import { fetchData } from "../../Wrapper.js";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CountUp from "react-countup";

// assets
import illustration from "../../assets/clock_orange.png";
import Store from "../../assets/business.png";
import Loaging from '../../components/Loading.jsx';
import { urlApi } from "../../styles/Constants.jsx";
import { ClockIcon, Cog6ToothIcon, ChevronDownIcon, ChevronUpIcon, XMarkIcon as CloseIcon, CalendarDateRangeIcon } from '@heroicons/react/24/outline';
import {
    BuildingOffice2Icon,
    BuildingOfficeIcon,
    CalendarDaysIcon,
    PlusCircleIcon
} from '@heroicons/react/24/solid';
import CardCita from "../../components/CardCita.jsx";


export function Home() {
    const navigate = useNavigate();
    // const { sCorreo, sPassword } = useLoaderData();
    const sCorreo = fetchData("correo");
    const sPassword = fetchData("pwd");
    const [loading, setLoading] = useState(true);


    const [citas, setCitas] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [userAdditInf, setUserAdditInf] = useState([]);
    const [colaboraciones, setColaboraciones] = useState([]);
    const [eventosUser, setEventosUser] = useState([]);

    const sUserCitaFix = fetchData("UserCitaFix") ?? [];
    const [firstName, setFirstName] = useState(sUserCitaFix['first_name'] ?? "");
    const [userId, setUserId] = useState(sUserCitaFix['USER_ID'] ?? "");
    const [dorsl, setDorsl] = useState(sUserCitaFix['DORSL'] ?? "");
    const [PhotoDorsl, setPhotoDorsl] = useState(sUserCitaFix['PHOTO_DORSL'] ?? "");
    const [businessId, setBusinessId] = useState(sUserCitaFix['BUSSINESS_ID'] ?? "");

    const [bAccederIndex, setbAccederIndex] = useState('');
    const [bAccederIndexCol, setbAccederIndexCol] = useState('');
    const [bAccederIndexCancelarEvento, setbAccederIndexCancelarEvento] = useState('');
    const [bAccederIndexCancelar, setbAccederIndexCancelar] = useState('');
    const [selectEvento, setSelectEvento] = useState(null);
    const [aIndexCol, setaIndexCol] = useState('');
    const [userGroup, setUserGroup] = useState(true);
    const [eventosGroup, setEventosGroup] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenCancelar, setIsOpenCancelar] = useState(false);
    const [bPopupMenuButton, setPopupMenuButton] = useState(false);
    const [bAccederIndexConfirm, setbAccederIndexConfirm] = useState(true);
    const [todayGroup, setTodayGroup] = useState(false);
    const [tomorrowGroup, setTomorrowGroup] = useState(false);
    const [thisWeekGroup, setThisWeekGroup] = useState(false);

    const arrayBufferToBase64 = (buffer) => {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return btoa(binary);
    };

    const toggle = (setter) => setter((prev) => !prev);

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
            return `${parts[2]} / ${parts[1]} / ${parts[0]}`;
        }
        else {
            return `${timeString}`;
        }

    }

    const appoinUserid = async () => {
        //Solicitar por GET
        try {
            const response = await fetch(`${urlApi}appoin?userid=${userId}`);
            if (response.status == 200) {
                const json = await response.json();
                const [primerValor, ...restoDeValores] = json['data'];
                setUpcoming(primerValor);
                setCitas(restoDeValores);
            } else if (response.status == 404) {
                setCitas([]);
                setUpcoming([]);
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }
        catch (e) {
            return;
        }
    };

    const indexConfirm = async (cita) => {
        if (!bAccederIndex === '') return;

        setbAccederIndex(cita['APOINMENT_ID']);

        //Enviar por UPDATE
        var options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                {
                    'apoinment_id': `${cita['APOINMENT_ID']}`,
                    'usernotification_id': `${cita['USER_ID']}`,
                    'username': firstName
                })
        }
        try {
            const response = await fetch(`${urlApi}appoinConfirm`, options);
            const json = await response.json();
            if (json['sucess'] == false) {
                setbAccederIndex('');
                // console.log(`Error al cancelar cita.`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            else {
                setbAccederIndex('');
                appoinUserid();
            }
        }
        catch (e) {
            setbAccederIndex('');
            return;
        }
    };

    const indexCancelar = async (cita) => {
        if (!bAccederIndexCancelar === '') return;

        setbAccederIndexCancelar(cita['APOINMENT_ID']);
        //Enviar por DELETE
        var options = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        }
        const userName = `${sUserCitaFix.first_name} ${sUserCitaFix.last_name}`;

        try {
            const response = await fetch(`${urlApi}appoin?apoinment_id=${cita.APOINMENT_ID}&usernotification_id=${cita.USER_ID}&dorsl=${userName}&for_who=Bus`, options);
            const json = await response.json();
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            if (json['sucess'] == false) {
                toast.error("No fue posible cancelar tu cita");
                return;
            }
            else {
                toast.success("Cita cancelada");
                appoinUserid();
            }
        }
        catch (e) {
            return;
        }
        finally {
            setbAccederIndexCancelar('');
        }
    };

    const indexConfirmCol = async (e, col) => {
        e.stopPropagation();
        const AuxCol = col == '' ? aIndexCol : col;
        setbAccederIndexCol(AuxCol.ID);

        //Enviar por UPDATE
        var options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                {
                    'collaborator_id': `${AuxCol.ID}`,
                    'name': `${firstName}`
                })
        }
        try {
            const response = await fetch(`${urlApi}collaboratorConfirm`, options);
            const json = await response.json();
            if (json['sucess'] == false) {
                setbAccederIndexCol('');
                setaIndexCol('');
                setIsOpen(false);
                // console.log(`Error al cancelar cita.`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            else {
                //Solicitar por GET
                try {
                    const response = await fetch(`${urlApi}usrInfCol?user_id=${userId}`);
                    if (response.status == 200) {
                        const json = await response.json();
                        setColaboraciones(json['data']);
                        setbAccederIndexCol('');
                        setaIndexCol('');
                        setIsOpen(false);
                    } else {
                        setbAccederIndexCol('');
                        setaIndexCol('');
                        setIsOpen(false);
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                }
                catch (e) {
                    setbAccederIndexCol('');
                    setaIndexCol('');
                    setIsOpen(false);
                    return;
                }
            }
        }
        catch (e) {
            setbAccederIndexCol('');
            setaIndexCol('');
            setIsOpen(false);
            return;
        }
    };

    const ModPopupMenu = () => {
        setPopupMenuButton(!bPopupMenuButton);
    };

    const indexCancelarCol = async () => {
        //Enviar por DELETE
        var options = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                {
                    'collaborator_id': `${aIndexCol.ID}`,
                    'name': `${firstName}`
                })
        }
        try {
            const response = await fetch(`${urlApi}collaboratorRechazar`, options);
            const json = await response.json();
            if (json['sucess'] == false) {
                setIsOpen(false);
                // console.log(`Error al cancelar cita.`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            else {
                //Solicitar por GET
                try {
                    const response = await fetch(`${urlApi}usrInfCol?user_id=${userId}`);
                    if (response.status == 200) {
                        const json = await response.json();
                        setColaboraciones(json['data']);
                    } else {
                        console.log(`Error getting setUserAdditInf.`);
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    setIsOpen(false);
                }
                catch (e) {
                    return;
                }
            }
        }
        catch (e) {
            setIsOpen(false);
            return;
        }
    };

    const _buildCancelarEvento = async () => {
        setbAccederIndexCancelarEvento(selectEvento);
        setIsOpenCancelar(false);
        //Enviar por DELETE
        var options = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                {
                    'bussiness_id': selectEvento
                })
        }
        try {
            const response = await fetch(`${urlApi}event`, options);
            const json = await response.json();
            if (json['sucess'] == false) {
                setSelectEvento(null);
                setbAccederIndexCancelarEvento('');
                // console.log(`Error al cancelar cita.`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            else {
                setSelectEvento(null);
                setbAccederIndexCancelarEvento('');
                try {
                    const response = await fetch(`${urlApi}event?userid=${userId}`);
                    if (response.status == 200) {
                        const json = await response.json();
                        setEventosUser(json['data']);
                    } else {
                        console.log(`Error getting Eventos of User.`);
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                }
                catch (e) {
                    return;
                }
            }
        }
        catch (e) {
            setSelectEvento(null);
            setbAccederIndexCancelarEvento('');
            return;
        }
    };

    useEffect(() => {
        const fData = async () => {
            //Solicitar por GET
            var options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'x-citafix-ps': sPassword
                }
            }
            try {
                const response = await fetch(`${urlApi}usr?email=${sCorreo}`, options);
                if (!response.ok) {
                    toast.error(`No se puede obtener la información del usuario`);
                }
                const json = await response.json();
                //obtener nombre
                localStorage.setItem("UserCitaFix", JSON.stringify(json['data']));
                setFirstName(json['data']['first_name']);
                setUserId(json['data']['USER_ID']);
                setDorsl(json['data']['DORSL']);
                setPhotoDorsl(json['data']['PHOTO_DORSL']);
                setBusinessId(json['data']['BUSSINESS_ID']);
                localStorage.setItem("dorsl", JSON.stringify(dorsl));
            }
            catch (e) {
                console.log(`Error getting appoin.`);
            }
            try {
                const response = await fetch(`${urlApi}appoin?userid=${userId}`);
                if (response.status == 200) {
                    const json = await response.json();
                    const todasLasCitas = json['data'] || [];

                    // 1. Obtener la fecha de hoy en formato local "YYYY-MM-DD"
                    const hoy = new Date().toLocaleDateString('sv-SE').split('T')[0];
                    // console.log(hoy);
                    // 2. Buscar la primera cita que sea de hoy
                    let primerValor = todasLasCitas.find(cita => cita.APPOINTMENT_DATE === hoy);

                    let restoDeValores;

                    if (primerValor) {
                        // 3. Si hay una cita de hoy, el resto serán todas las demás citas
                        restoDeValores = todasLasCitas.filter(cita => cita !== primerValor);
                        // 5. Actualizar tus estados de React
                        // console.log(primerValor);
                        setUpcoming(primerValor);
                        // console.log(restoDeValores);
                        setCitas(restoDeValores);
                    } else {
                        // 4. Si NO hay citas de hoy, mantener tu lógica original (tomar la primera de la lista)
                        // [primerValor, ...restoDeValores] = todasLasCitas;                        
                        setUpcoming([]);
                        setCitas(todasLasCitas);
                    }



                } else if (response.status == 404) {
                    setUpcoming([]);
                    setCitas([]);
                } else {
                    console.log(`Error getting appoin.`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                try {
                    const response = await fetch(`${urlApi}usrInf?user_id=${userId}`);
                    if (response.status == 200) {
                        const json = await response.json();
                        setUserAdditInf(json['data'][0]);
                    } else {
                        console.log(`Error getting setUserAdditInf.`);
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    try {
                        const response = await fetch(`${urlApi}usrInfCol?user_id=${userId}`);
                        if (response.status == 200) {
                            const json = await response.json();
                            setColaboraciones(json['data']);
                        } else {
                            console.log(`Error getting setUserAdditInf.`);
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        try {
                            const response = await fetch(`${urlApi}event?userid=${userId}`);
                            if (response.status == 200) {
                                const json = await response.json();
                                setEventosUser(json['data']);
                            } else {
                                console.log(`Error getting Eventos of User.`);
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                        }
                        catch (e) {
                            setLoading(false);
                            return;
                        }
                    }
                    catch (e) {
                        return;
                    }
                }
                catch (e) {
                    return;
                }
                setLoading(false);
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

    const agruparCitas = (citas) => {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const manana = new Date(hoy);
        manana.setDate(manana.getDate() + 1);

        const finSemana = new Date(hoy);
        finSemana.setDate(finSemana.getDate() + (7 - hoy.getDay())); // Domingo

        const resultado = {
            hoy: [],
            manana: [],
            semana: []
        };

        citas.forEach(cita => {
            const fecha = new Date(`${cita.APPOINTMENT_DATE}T00:00:00`);

            if (fecha.getTime() === hoy.getTime()) {
                resultado.hoy.push(cita);
            }
            else if (fecha.getTime() === manana.getTime()) {
                resultado.manana.push(cita);
            }
            else if (fecha > manana && fecha <= finSemana) {
                resultado.semana.push(cita);
            }
        });

        return resultado;
    };

    const { hoy, manana, semana } = agruparCitas(citas);

    if (loading) {
        return <Loaging />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-6xl mx-auto mt-14 p-6 space-y-6 text-gray-800">
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-400 text-sm">
                                Bienvenido de nuevo
                            </p>
                            <h1 className="text-4xl font-black text-gray-900">
                                {firstName.charAt(0).toUpperCase() + firstName.slice(1)}
                            </h1>
                        </div>

                        <button
                            onClick={() =>
                                navigate("/addEvent", {
                                    state: { userId }
                                })
                            }
                            className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-lg whitespace-nowrap">
                            <CalendarDateRangeIcon width={20} />
                            <span className="hidden sm:inline">
                                Crear evento
                            </span>
                        </button>
                    </div>
                    {
                        upcoming.length === 0 ?
                            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm text-center">
                                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 flex items-center justify-center">
                                    <span className="text-4xl">🎉</span>
                                </div>

                                <h3 className="mt-4 text-xl font-bold text-gray-900">
                                    No tienes citas para hoy
                                </h3>

                                <p className="mt-2 text-gray-500">
                                    Tu agenda está libre por el momento.
                                    Aprovecha el día para organizar nuevas actividades.
                                </p>
                            </div> : (
                                <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm text-center hover:shadow-xl transition-all">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">
                                                Próximo compromiso
                                            </h3>

                                            <p className="text-sm text-gray-500">
                                                Tu siguiente actividad programada
                                            </p>
                                        </div>

                                        <div className="flex justify-center mt-3">
                                            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm">
                                                📅 Hoy
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            {/* Foto */}
                                            <div className="flex-shrink-0">
                                                {upcoming.BUS_PHOTO == null ? (
                                                    <div className="w-20 h-20 rounded-2xl bg-orange-50 flex items-center justify-center">
                                                        <img className="w-20 h-20 bg-gray-500 object-cover rounded-2xl border" id='store' src={Store} />
                                                    </div>
                                                ) : (
                                                    <img
                                                        className="w-16 h-16 rounded-2xl object-cover"
                                                        src={
                                                            'data:image/jpeg;base64,' +
                                                            arrayBufferToBase64(upcoming.BUS_PHOTO.data)
                                                        }
                                                    />
                                                )}
                                            </div>
                                            {/* Información */}
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-lg text-gray-900">
                                                    {upcoming.DORSL}
                                                </h3>

                                                <p className="text-sm text-gray-500">
                                                    {upcoming.ALIAS}
                                                </p>

                                                <div className="mt-2">
                                                    {upcoming.APPOINTMENT_CONFIRM === 1 ? (
                                                        <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                                                            Confirmada
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium">
                                                            ⏳ Por confirmar
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                        </div>
                                        {/* Hora */}
                                        <div className="flex-shrink-0">
                                            <div className="bg-slate-50 rounded-2xl px-4 py-3 text-center">
                                                <p className="text-xs uppercase tracking-wide text-slate-500">
                                                    Hora
                                                </p>

                                                <p className="font-bold text-slate-900">
                                                    {ConvertDateTime(
                                                        upcoming.APPOINTMENT_DATE,
                                                        upcoming.APPOINTMENT_TIME,
                                                        1
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                    </div>

                                    {/* Botones */}
                                    <div className="mt-6 space-y-3">
                                        {bAccederIndex == upcoming.APOINMENT_ID ? (
                                            <button
                                                className="w-full px-5 py-3 rounded-2xl bg-gray-300 text-white hover:bg-gray-400 transition font-medium"
                                            >
                                                <span className="animate-pulse">Confirmando...</span>
                                            </button>
                                        ) : upcoming.APPOINTMENT_CONFIRM === 0 &&
                                        <button
                                            className="w-full px-5 py-3 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 transition font-medium"
                                            onClick={() => indexConfirm(upcoming)}
                                        >
                                            ✓ Confirmar asistencia
                                        </button>}

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <button
                                                className="px-5 py-3 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
                                                onClick={() => {
                                                    if (upcoming.ESTATUS !== -1 && upcoming.ESTATUS !== 2) {
                                                        navigate(
                                                            `/cancelAppoin/${upcoming.APOINMENT_ID}`,
                                                            {
                                                                state: {
                                                                    flagEvent: upcoming.FLAG_EVENT
                                                                }
                                                            }
                                                        );
                                                    }
                                                }}
                                            >
                                                Ver detalles
                                            </button>
                                            {/* <button
                                                className="px-5 py-3 rounded-2xl border border-amber-300 text-amber-700 hover:bg-amber-50 transition"
                                            >
                                                Reagendar
                                            </button> */}
                                            {bAccederIndexCancelar == upcoming.APOINMENT_ID ?
                                                <button
                                                    className="px-5 py-3 rounded-2xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
                                                >
                                                    <span className="animate-pulse">Cancelando...</span>
                                                </button>
                                                : <button
                                                    className="px-5 py-3 rounded-2xl border border-red-300 text-red-600 hover:bg-red-50 transition"
                                                    onClick={() => indexCancelar(upcoming)}>
                                                    Cancelar
                                                </button>
                                            }

                                        </div>

                                    </div>
                                </div>
                            )

                    }
                    <div className="grid grid-cols-2 gap-4 mt-8">
                        <div className="bg-orange-50 rounded-3xl p-6 border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between">
                                <BuildingOffice2Icon className="w-8 h-8 text-orange-600" />
                                <h2 className="text-4xl font-black text-gray-900">
                                    <CountUp
                                        start={0}
                                        end={userAdditInf.amount_business}
                                        duration={2}
                                    />
                                </h2>
                            </div>
                            <p className="mt-4 text-sm text-gray-500">
                                Lugares visitados
                            </p>
                        </div>
                        <div className="bg-orange-50 rounded-3xl p-6 border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between">
                                <CalendarDaysIcon className="w-8 h-8 text-orange-600" />
                                <h2 className="text-4xl font-black text-gray-900">
                                    <CountUp
                                        start={0}
                                        end={userAdditInf.amount_appointment}
                                        duration={2}
                                    />
                                </h2>
                            </div>
                            <p className="mt-4 text-sm text-gray-500">
                                Citas totales
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                    {hoy.length > 0 && (
                    <>                        
                        <div className='mt-4 mb-4 cursor-pointer flex items-center border-b pb-2' onClick={() => toggle(setTodayGroup)}>
                            <h2 className="text-xl font-bold mr-4" >
                            Hoy ({hoy.length})
                        </h2>
                            {todayGroup ? <ChevronDownIcon className="w-5 h-5 text-gray-800 mt-1" /> : <ChevronUpIcon className="w-5 h-5 text-gray-800 mt-1" />}
                        </div>
                        {!todayGroup && hoy.map(cita => (
                            <CardCita
                                key={cita.APOINMENT_ID}
                                index={cita}
                                bAccederIndex={bAccederIndex}
                                indexConfirm={indexConfirm}
                            />
                        ))}
                    </>
                )}
                {manana.length > 0 && (
                    <>
                        <div className='mt-4 mb-4 cursor-pointer flex items-center border-b pb-2' onClick={() => toggle(setTomorrowGroup)}>
                            <h2 className="text-xl font-bold mr-4" >
                                Mañana ({manana.length})
                            </h2>
                            {tomorrowGroup ? <ChevronDownIcon className="w-5 h-5 text-gray-800 mt-1" /> : <ChevronUpIcon className="w-5 h-5 text-gray-800 mt-1" />}
                        </div>
                        {!tomorrowGroup && manana.map(cita => (
                            <CardCita
                                key={cita.APOINMENT_ID}
                                index={cita}
                                bAccederIndex={bAccederIndex}
                                indexConfirm={indexConfirm}
                            />
                        ))}
                    </>
                )}
                {semana.length > 0 && (
                    <>                        
                        <div className='mt-4 mb-4 cursor-pointer flex items-center border-b pb-2' onClick={() => toggle(setThisWeekGroup)}>
                            <h2 className="text-xl font-bold mr-4">
                            Esta semana ({semana.length})
                        </h2>
                            {thisWeekGroup ? <ChevronDownIcon className="w-5 h-5 text-gray-800 mt-1" /> : <ChevronUpIcon className="w-5 h-5 text-gray-800 mt-1" />}
                        </div>
                        {!thisWeekGroup && semana.map(cita => (
                            <CardCita
                                key={cita.APOINMENT_ID}
                                index={cita}
                                bAccederIndex={bAccederIndex}
                                indexConfirm={indexConfirm}
                                bWeek={1}
                            />
                        ))}

                        
                    </>
                )}
                {
                    eventosUser.length > 0 &&
                    <div className="bg-white rounded-3xl shadow-xl space-y-8 p-10 max-w-2xl w-full text-center animate-fade-in-up">
                        <div className='cursor-pointer flex items-center' onClick={() => toggle(setEventosGroup)}>
                            <h1 className='mr-2 text-gray-800'>Tus próximos eventos</h1>
                            {eventosGroup ? <ChevronDownIcon className="w-5 h-5 text-gray-800 mt-1" /> : <ChevronUpIcon className="w-5 h-5 text-gray-800 mt-1" />}
                        </div>
                        {!eventosGroup &&
                            <div className="p-3 flex flex-col space-y-4 items-center">
                                {eventosUser.map((index) =>
                                (
                                    <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm"
                                        key={index['BUSSINESS_ID']}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center">
                                                <CalendarDaysIcon className="w-8 h-8 text-orange-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg">
                                                    {index.EVENTO}
                                                </h3>
                                                <p className="text-gray-500">
                                                    {index.ANFITRION}
                                                </p>
                                            </div>
                                            {/* <ClockIcon width={80} className="ml-5"
                                                color={'#32325d'} />
                                            <div className="grid">
                                                <label className="text-lg font-semibold text-black">{index['EVENTO']} de {index['ANFITRION']} </label>
                                                <label className="text-gray-400">{ConvertDateTime(index['EVENT_DATE'], index['EVENT_TIME'], 0)} </label>
                                                <label className="text-gray-400">{ConvertDateTime(index['EVENT_DATE'], index['EVENT_TIME'], 1)} </label>
                                            </div> */}
                                        </div>
                                        <div className="mt-6 flex justify-end space-x-3 mr-2 mb-2">
                                            {bAccederIndexCancelarEvento == index['BUSSINESS_ID'] ?
                                                <button className="px-4 py-2 rounded-lg bg-red-600 text-white">
                                                    <div className='circleWhiteRed'></div></button>
                                                : <button className="px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition"
                                                    onClick={() => { setIsOpenCancelar(true); setSelectEvento(index['BUSSINESS_ID']); }}>Cancelar</button>}
                                            <button className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition"
                                                onClick={() => {
                                                    navigate(`/updateEvent`, { state: { userId: userId, evento: index } });
                                                }}>Ver más</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                }
                {/* Agenda */}
                {citas.length === 0 && (<div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm text-center">
                    <div className="w-20 h-20 mx-auto rounded-full bg-blue-50 flex items-center justify-center">
                        <img src={illustration} alt="Planners Day" className="mx-auto w-56" />
                    </div>
                    <h3 className="mt-4 text-xl font-bold text-gray-900">
                        Aún no tienes citas programadas
                    </h3>
                    <p className="mt-2 text-gray-500">
                        Encuentra negocios o crea un evento para comenzar a organizar tu agenda.
                    </p>
                    <button
                        onClick={() => navigate("/findBusiness")}
                        className="mt-5 px-5 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white transition"
                    >
                        Explorar servicios
                    </button>
                </div>)}

                </div>
                
            </div>
            {/* Modal */}
            {isOpen ?
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative animate-fade-in-up">
                            <button
                                onClick={() => { setIsOpen(false); setaIndexCol(''); }}
                                className="absolute top-3 right-3 text-gray-500 hover:text-orange-500"
                            >
                                <CloseIcon className="w-5 h-5 text-gray-900" />
                            </button>
                            <h4 className="text-xl font-bold text-center text-black mb-1">Confirmar</h4>
                            <p className="text-center text-yellow-500 mb-1">¿Quieres aceptar la invitación a colaborar?</p>
                            <div className='flex justify-end mt-2'>
                                <button className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mx-2' onClick={() => {
                                    indexCancelarCol();
                                }}>Rechazar</button>
                                <button className='bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600' onClick={(e) => {
                                    indexConfirmCol(e, '');
                                }}>Aceptar</button>
                            </div>
                        </div>
                    </div>
                </> : <></>}
            {/* Modal */}
            {isOpenCancelar ?
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative animate-fade-in-up">
                            <button
                                onClick={() => { setIsOpenCancelar(false); setSelectEvento(null); }}
                                className="absolute top-3 right-3 text-gray-500 hover:text-orange-500"
                            >
                                <CloseIcon className="w-5 h-5 text-gray-900" />
                            </button>
                            <h4 className="text-xl font-bold text-center text-black mb-1">Confirmar</h4>
                            <p className="text-center text-yellow-500 mb-1">¿Seguro que quieres cancelar este evento?</p>
                            <div className='flex justify-end mt-2'>
                                <button className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mx-2' onClick={() => {
                                    setIsOpenCancelar(false);
                                    setSelectEvento(null);
                                }}>Cancelar</button>
                                <button className='bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600' onClick={(e) => {
                                    _buildCancelarEvento();
                                }}>Aceptar</button>
                            </div>
                        </div>
                    </div>
                </> : <></>}
        </div>
    );
}

export default Home;
