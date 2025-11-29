
// rrd imports
import { useLoaderData, useNavigate } from 'react-router-dom';
import { fetchData } from "../../Wrapper.js";
import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';

// assets
import { urlApi } from "../../styles/Constants.jsx";
import { TrashIcon, UserCircleIcon } from '@heroicons/react/24/solid';
// import InvitationPreview from "../../components/InvitationPreview.jsx";


// loader
export function UpdateEventoLoader() {
    const sCorreo = fetchData("correo");
    const sPassword = fetchData("pwd");
    return { sCorreo, sPassword };
}

export function UpdateEvento({ onSubmit }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { sCorreo, sPassword } = useLoaderData();
    const userId = location.state?.userId ?? '';
    const evento = location.state?.evento ?? '';
    const [invitados, setInvitados] = useState([]);
    const [bAcceder, setbAcceder] = useState(false);
    const [bEnviar, setbEnviar] = useState(true);
    const [totalInvitados, setTotalInvitados] = useState(0);
    const [totalConfirmados, setTotalConfirmados] = useState(0);
    const [form, setForm] = useState({
        user_id: 0,
        bussiness_id: evento.BUSSINESS_ID,
        usernotification_id: 0,
        appointment_date: evento.EVENT_DATE,
        appointment_time: evento.EVENT_TIME,
        anonimo: "",
        message: "",
        estatus: '0',
        dorsl: '',
        for_who: 'Usr',

        anfitrion: evento.ANFITRION,
        ubicacion: evento.UBICACION,
        dressCode: evento.DRESSCODE,
        notas: evento.NOTAS,
        encabezado: evento.ENCABEZADO,
        motivo: evento.MOTIVO,
        despedida: evento.DESPEDIDA,

        numInv: 0,
        detalleInv: "",

        nombre: "",
        phone: "",
        correo: "",
        appointment_confirm: 0,
        isPrivate: 0
    });
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [bAccederIndexCancelar, setbAccederIndexCancelar] = useState('');
    const [bAccederConf, setbAccederConf] = useState(true);

    const arrayBufferToBase64 = (buffer) => {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return btoa(binary);
    };

    const UpdateInvitados = async () => {
        //Solicitar por GET
        var options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }
        try {
            const response = await fetch(`${urlApi}appoinBussiness?bussiness_id=${evento.BUSSINESS_ID}`, options);
            if (response.status == 200) {
                const json = await response.json();
                setInvitados(json['data']);
                var aux = 0;
                var auxC = 0;
                var tempSubCategoria = json['data'][0]['APPOINTMENT'];
                for (const key in tempSubCategoria) {
                    aux += parseInt(tempSubCategoria[key]['MESSAGE'].substring(0, tempSubCategoria[key]['MESSAGE'].indexOf(",")));
                    if (tempSubCategoria[key]['APPOINTMENT_CONFIRM'] == 1) {
                        auxC += parseInt(tempSubCategoria[key]['MESSAGE'].substring(0, tempSubCategoria[key]['MESSAGE'].indexOf(",")));
                    }
                }
                setTotalInvitados(aux);
                setTotalConfirmados(auxC);
            } else if (response.status == 404) {
                setInvitados([]);
                setTotalInvitados(0);
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }
        catch (e) {
            console.log('catch ' + e.message);
        }
    };

    function validate() {
        const e = {};
        if (!form.nombre.trim())
            e.nombre = "El nombre del contacto es obligatorio.";
        if (form.isPrivate) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(form.correo))
                e.correo = "El correo electrónico es inválido.";
        }
        else {
            const isValidPhone = form.phone.replace(/\D/g, '');
            if (isValidPhone.length != 10) {
                e.phone = "El número de teléfono es inválido.";
            }
            else
                form.phone = `(${form.phone.slice(0, 3)}) ${form.phone.slice(3, 6)}-${form.phone.slice(6, 10)}`;
        }
        if (form.numInv == 0)
            e.numInv = "El número de invitados es obligatorio.";
        if (!form.detalleInv.trim())
            e.detalleInv = "El detalle de invitados es obligatorio.";
        return e;
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
        setSubmitted(false);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const eobj = validate();
        setErrors(eobj);
        if (Object.keys(eobj).length > 0)
            return;
        form.anonimo = form.isPrivate ? `${form.nombre},${form.correo}` : `${form.nombre},+52 ${form.phone}`;
        form.dorsl = `${evento.EVENTO} de ${evento.ANFITRION}`;
        form.message = `${form.numInv},${form.detalleInv}`;
        const payload = { ...form };

        if (bEnviar) {
            setbEnviar(false);
            //Enviar por POST
            var options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }
            try {
                const response = await fetch(`${urlApi}appoinEveW`, options);
                const json = await response.json();
                if (json['sucess'] == false) {
                    // Avisar que no se puedo enviar la invitación
                    setbEnviar(true);
                    setSubmitted(false);
                    setbAcceder(false);
                    setForm({
                        user_id: 0,
                        bussiness_id: evento.BUSSINESS_ID,
                        usernotification_id: 0,
                        appointment_date: evento.EVENT_DATE,
                        appointment_time: evento.EVENT_TIME,
                        anonimo: "",
                        message: "",
                        estatus: '0',
                        dorsl: '',
                        for_who: 'Bus',

                        anfitrion: evento.ANFITRION,
                        ubicacion: evento.UBICACION,
                        dressCode: evento.DRESSCODE,
                        notas: evento.NOTAS,
                        encabezado: evento.ENCABEZADO,
                        motivo: evento.MOTIVO,
                        despedida: evento.DESPEDIDA,

                        numInv: 0,
                        detalleInv: "",

                        nombre: "",
                        phone: "",
                        correo: "",
                        appointment_confirm: 0,
                        isPrivate: 0
                    });
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                else {

                    setbEnviar(true);
                    setSubmitted(false);
                    setbAcceder(false);
                    setForm({
                        user_id: 0,
                        bussiness_id: evento.BUSSINESS_ID,
                        usernotification_id: 0,
                        appointment_date: evento.EVENT_DATE,
                        appointment_time: evento.EVENT_TIME,
                        anonimo: "",
                        message: "",
                        estatus: '0',
                        dorsl: '',
                        for_who: 'Bus',

                        anfitrion: evento.ANFITRION,
                        ubicacion: evento.UBICACION,
                        dressCode: evento.DRESSCODE,
                        notas: evento.NOTAS,
                        encabezado: evento.ENCABEZADO,
                        motivo: evento.MOTIVO,
                        despedida: evento.DESPEDIDA,

                        numInv: 0,
                        detalleInv: "",

                        nombre: "",
                        phone: "",
                        correo: "",
                        appointment_confirm: 0,
                        isPrivate: 0
                    });
                    UpdateInvitados();
                }
            }
            catch (e) {
                setbEnviar(true);
                setSubmitted(false);
                setbAcceder(false);
                setForm({
                    user_id: 0,
                    bussiness_id: evento.BUSSINESS_ID,
                    usernotification_id: 0,
                    appointment_date: evento.EVENT_DATE,
                    appointment_time: evento.EVENT_TIME,
                    anonimo: "",
                    message: "",
                    estatus: '0',
                    dorsl: '',
                    for_who: 'Bus',

                    anfitrion: evento.ANFITRION,
                    ubicacion: evento.UBICACION,
                    dressCode: evento.DRESSCODE,
                    notas: evento.NOTAS,
                    encabezado: evento.ENCABEZADO,
                    motivo: evento.MOTIVO,
                    despedida: evento.DESPEDIDA,

                    numInv: 0,
                    detalleInv: "",

                    nombre: "",
                    phone: "",
                    correo: "",
                    appointment_confirm: 0,
                    isPrivate: 0
                });
            }

            if (onSubmit && typeof onSubmit === "function") onSubmit(payload);
            // else console.log("Invitation form submitted:", payload);

            setSubmitted(true);
        }
    }

    // Formatea la fecha en español (27 de noviembre de 2025)
    function formatDate(iso) {
        if (!iso) return "";
        try {
            var parts = iso.split('-');
            const d = new Date(parts[0], parts[1] - 1, parts[2]);
            return d.toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });
        } catch {
            return iso;
        }
    }

    // Formatea la hora a 12h (2:00 PM) manteniendo fallback
    function formatTime(t) {
        if (!t) return "";
        // acepta "HH:mm:ss" o "HH:mm"
        const parts = t.split(":");
        if (parts.length < 2) return t;
        const d = new Date();
        d.setHours(parseInt(parts[0], 10));
        d.setMinutes(parseInt(parts[1], 10));
        return d.toLocaleTimeString("es-ES", { hour: "numeric", minute: "2-digit" });
    }

    const _buildCancelar = async (index) => {
        setbAccederIndexCancelar(index['APOINMENT_ID']);
        //Enviar por DELETE
        var options = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        }
        try {
            const response = await fetch(`${urlApi}appoin?apoinment_id=${index['APOINMENT_ID']}&usernotification_id=${index['USER_ID']}&dorsl=${evento.EVENTO} de ${evento.ANFITRION}&for_who=Usr`, options);
            const json = await response.json();
            if (json['sucess'] == false) {
                setbAccederIndexCancelar('');
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            else {
                setbAccederIndexCancelar('');
                UpdateInvitados();
            }
        }
        catch (e) {
            setbAccederIndexCancelar('');
            return;
        }
    };

    const sendCon = async () => {
        if (bAccederConf) {
            setbAccederConf(false);
            //Enviar por DELETE
            var options = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }
            try {
                const response = await fetch(`${urlApi}sendEventConf?bussiness_id=${evento.BUSSINESS_ID}`, options);
                const json = await response.json();
                if (json['sucess'] == false) {
                    setbAccederConf(true);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                else 
                    setbAccederConf(true);
            }
            catch (e) {
                setbAccederConf(true);
                return;
            }
        }
    };

    useEffect(() => {
        const fData = async () => {
            if (userId === '') {
                navigate("/");
            }
            else if (sCorreo === null && sPassword === null) {
                navigate("/");
            }
            UpdateInvitados();
        };
        fData();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-600 to-orange-800 py-8 px-4 sm:px-6 lg:px-8">
            {/* <InvitationPreview data={data} /> */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                {/* Preview Card Evento */}
                <div className="flex flex-col gap-4">
                    <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="mt-3 text-lg font-bold text-gray-900">{evento.EVENTO || 'Tipo de evento'} de {evento.ANFITRION || 'Anfitrión'}</h3>
                                <p className="mb-2 text-sm text-gray-700">
                                    <strong>Vestimenta:</strong> {evento.DRESSCODE || 'Código de vestimenta'}
                                </p>
                            </div>
                            <div className="text-xs text-gray-400">Vista previa</div>
                        </div>
                        <div className="bg-white rounded-lg p-6 border border-gray-100">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">✨ {evento.ENCABEZADO || 'Encabezado'}</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {evento.ANFITRION ? `${evento.ANFITRION} —` : ""} <span className="font-medium">{evento.MOTIVO || 'Motivo'}</span>
                                    </p>
                                </div>

                            </div>
                            <hr className="my-4 border-gray-100" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                                <div>
                                    <p className="text-xs text-gray-500">📅 Fecha</p>
                                    <p className="font-medium">{formatDate(evento.EVENT_DATE)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">🕒 Hora</p>
                                    <p className="font-medium">{formatTime(evento.EVENT_TIME)}</p>
                                </div>

                                <div className="sm:col-span-2">
                                    <p className="text-xs text-gray-500">📍 Ubicación</p>
                                    <p className="font-medium">{evento.UBICACION || "Lugar"}</p>
                                    <p className="font-medium">{evento.NOTAS || "Notas / Indicaciones / enlace"}</p>
                                </div>
                            </div>
                            <div className="mt-6 text-sm text-gray-600">
                                <p>{evento.DESPEDIDA || 'Mensaje final'} 🎊</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white font-semibold shadow hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300"
                                onClick={() => {
                                    setbAcceder(true);
                                }}
                            >
                                Invitar al evento
                            </button>
                            <div className="text-sm text-gray-500">
                                <span> Invitados {('0' + (totalInvitados)).slice(-2)} / Confirmados {('0' + (totalConfirmados)).slice(-2)} </span>
                            </div>
                        </div>

                    </div>
                    {/* Invitados Evento */}
                    {totalInvitados > 0 &&
                        <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Invitados</h3>
                                    {bAccederConf ?
                                        <button
                                            className="mt-2 inline-flex items-center gap-2 px-2 py-1 rounded-xl bg-green-500 text-white font-semibold shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                                            onClick={() => {
                                                sendCon();
                                            }}
                                        >
                                            Enviar confirmación por WhatsApp
                                        </button> : <button className="px-4 py-2 mt-2 mb-2 mr-2 rounded-lg bg-green-600 text-white">
                                            <div className='circleWhite'></div></button>
                                    }

                                </div>
                            </div>
                            <div className="mt-4 bg-white rounded-lg p-4 border border-gray-100">
                                <ul className="text-sm text-gray-600 space-y-1">
                                    {invitados[0]['APPOINTMENT'].map((index) =>
                                    (
                                        <div className="flex justify-between bg-gray-100 shadow-lg rounded-lg overflow-hidden scale-95 hover:scale-100 transition-all duration-300"
                                            key={index['APOINMENT_ID']}
                                        >
                                            <div className='flex justify-center items-center ms:ml-3 lg:ml-4 '>
                                                {
                                                    index['PHOTO'] === null ?
                                                        <UserCircleIcon className='w-12 h-12'
                                                            color={index['ESTATUS'] == '-1' ? '#B71C1C' :
                                                                index['ESTATUS'] == '1' ? '#32325d' :
                                                                    index['ESTATUS'] == '3' || index['APPOINTMENT_CONFIRM'] == '1' ? '#4472C4' : '#fc6500'
                                                            } /> :
                                                        <img id='imgS' src={'data:image/jpeg;base64,' + arrayBufferToBase64(index['PHOTO'].data)} />
                                                }
                                            </div>
                                            <div className="grid">
                                                <label className="ms:text-2xl lg:text-2xl font-bold text-black text-center">{index['ANONIMO'] == '' ? index['COMPLET_NAME'] : index['ANONIMO'].substring(0, index['ANONIMO'].indexOf(","))} </label>
                                                <label className="ms:text-1xl lg:text-1xl font-bold text-black text-center">{index['ANONIMO'] != '' ? index['ANONIMO'].substring(index['ANONIMO'].indexOf(",") + 1, index['ANONIMO'].length) : ''} </label>
                                                <label className="ms:text-1xl lg:text-1xl text-gray-500 text-center">Invitados : {index['MESSAGE'].substring(0, index['MESSAGE'].indexOf(","))} {`(${index['MESSAGE'].substring(index['MESSAGE'].indexOf(",") + 1, index['MESSAGE'].length)})`} </label>
                                                <label className="ms:text-1xl lg:text-1xl font-bold text-green-600 text-center">{index['APPOINTMENT_CONFIRM'] == '1' ? 'Confirmada' : ''} </label>
                                            </div>
                                            {bAccederIndexCancelar == index['APOINMENT_ID'] ?
                                                <button className="px-4 py-2 mt-3 mb-3 mr-2 rounded-lg bg-red-600 text-white">
                                                    <div className='circleWhiteRed'></div></button>
                                                : <TrashIcon className="mr-4" width={25} color="#B71C1C" onClick={() => {
                                                    if (index['ESTATUS'] !== '-1' && index['ESTATUS'] !== '2') {
                                                        _buildCancelar(index);
                                                    }
                                                }} />}

                                        </div>
                                    ))}
                                </ul>
                            </div>

                        </div>}

                </div>

                {/* Invitar Card */}
                {bAcceder && <div className="flex flex-col gap-4">
                    <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Invitar</h3>
                            </div>
                            <div className="text-xs text-red-500 cursor-pointer" onClick={() => {
                                setbEnviar(true);
                                setbAcceder(false);
                                setSubmitted(false);
                                setForm({
                                    user_id: 0,
                                    bussiness_id: evento.BUSSINESS_ID,
                                    usernotification_id: 0,
                                    appointment_date: evento.EVENT_DATE,
                                    appointment_time: evento.EVENT_TIME,
                                    anonimo: "",
                                    message: "",
                                    estatus: '0',
                                    dorsl: '',
                                    for_who: 'Bus',

                                    anfitrion: evento.ANFITRION,
                                    ubicacion: evento.UBICACION,
                                    dressCode: evento.DRESSCODE,
                                    notas: evento.NOTAS,
                                    encabezado: evento.ENCABEZADO,
                                    motivo: evento.MOTIVO,
                                    despedida: evento.DESPEDIDA,

                                    numInv: 0,
                                    detalleInv: "",

                                    nombre: "",
                                    phone: "",
                                    correo: "",
                                    appointment_confirm: 0,
                                    isPrivate: 0
                                });
                            }}>cancelar</div>
                        </div>
                        <div className="mt-4 bg-white rounded-lg p-4 border border-gray-100">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <h4>Información de contacto</h4>
                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700">Nombre</span>
                                    <input
                                        name="nombre"
                                        value={form.nombre}
                                        onChange={handleChange}
                                        placeholder="Nombre del contacto"
                                        className={`mt-1 block w-full rounded-lg border ${errors.nombre ? 'border-red-400' : 'border-gray-200'} px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-300`}
                                    />
                                    {errors.nombre && <p className="mt-1 text-xs text-red-600">{errors.nombre}</p>}
                                </label>
                                <label className="flex items-center gap-2 mt-2">
                                    <input
                                        type="checkbox"
                                        name="isPrivate"
                                        checked={form.isPrivate || false}
                                        onChange={(e) => handleChange({ target: { name: 'isPrivate', value: e.target.checked } })}
                                        className={`h-4 w-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500`}
                                    />
                                    <span className="text-sm font-bold text-gray-700">¿Deseas que sea por correo electrónico?</span>
                                </label>
                                {form.isPrivate ? <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                                    <label className="block">
                                        <span className="text-sm font-medium text-gray-700">¿Cuál es el correo electrónico?</span>
                                        <input
                                            type="email"
                                            name="correo"
                                            value={form.correo}
                                            onChange={handleChange}
                                            placeholder="Correo electrónico"
                                            className={`mt-1 block w-full rounded-lg border ${errors.correo ? 'border-red-400' : 'border-gray-200'} px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-300`}
                                        />
                                        {errors.correo && <p className="mt-1 text-xs text-red-600">{errors.correo}</p>}
                                        <p className="mt-1 text-xs text-gray-600">En este correo electrónico recibirá un recordatorio de su vista.</p>
                                    </label>
                                </div> :
                                    <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                                        <label className="block">
                                            <span className="text-sm font-medium text-gray-700">¿Cuál es el número de teléfono?</span>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={form.phone}
                                                onChange={(e) => handleChange({ target: { name: 'phone', value: e.target.value.replace(/\D/g, '') } })}
                                                placeholder="Número de teléfono"
                                                className={`mt-1 block w-full rounded-lg border ${errors.phone ? 'border-red-400' : 'border-gray-200'} px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-300`}
                                            />
                                            {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                                            <p className="mt-1 text-xs text-gray-600">En este número de teléfono recibirá un recordatorio de su vista.</p>
                                        </label>
                                    </div>}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <label className="block">
                                        <span className="text-sm font-medium text-gray-700">Número de invitados</span>
                                        <input
                                            type="number"
                                            min="0"
                                            max="10"
                                            name="numInv"
                                            value={form.numInv}
                                            onChange={handleChange}
                                            className={`mt-1 block w-full rounded-lg border ${errors.numInv ? 'border-red-400' : 'border-gray-200'} px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-300`}
                                        />
                                        {errors.numInv && <p className="mt-1 text-xs text-red-600">{errors.numInv}</p>}
                                    </label>
                                    <label className="block">
                                        <span className="text-sm font-medium text-gray-700">Adultos / niños </span>
                                        <input
                                            name="detalleInv"
                                            value={form.detalleInv}
                                            onChange={handleChange}
                                            placeholder="Ej: 2 Adultos y 1 niño, 2 Adultos"
                                            className={`mt-1 block w-full rounded-lg border ${errors.detalleInv ? 'border-red-400' : 'border-gray-200'} px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-300`}
                                        />
                                        {errors.detalleInv && <p className="mt-1 text-xs text-red-600">{errors.detalleInv}</p>}
                                    </label>
                                </div>

                                <div className="flex items-center justify-between">
                                    {bEnviar ? <button
                                        type="submit"
                                        disabled={form.isPrivate ? true : false}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white 
                                        font-semibold shadow hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 
                                        disabled:border-gray-50 disabled:bg-gray-200 disabled:text-gray-500"
                                    >
                                        Enviar
                                    </button> : <button className='mb-10'><div className='circle' ></div></button>}
                                    <div className="text-sm text-gray-500">
                                        {submitted ? (
                                            <span className="text-orange-600 font-medium">¡Invitación lista!</span>
                                        ) : (
                                            form.isPrivate ? <span>Por el momento no se pueden enviar invitaciones por correo electrónico</span>
                                                : <span>Los campos obligatorios están marcados</span>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>}

            </div>
        </div>
    );
}

export default UpdateEvento;