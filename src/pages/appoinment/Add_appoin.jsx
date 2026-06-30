// rrd imports
import { useLoaderData, useNavigate } from 'react-router-dom';
import { fetchData, dateSpanish } from "../../Wrapper.js";
import { forwardRef, useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { toast } from "react-toastify";
// assets
import Store from "../../assets/business.png";
import Loaging from '../../components/Loading.jsx';
import { urlApi } from "../../styles/Constants.jsx";
// Library
import { MapPinIcon, PhoneIcon, CalendarDaysIcon, CalendarDateRangeIcon, XMarkIcon as CloseIcon, TagIcon, CheckCircleIcon, PlusCircleIcon } from '@heroicons/react/24/solid';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
//import moment from 'moment';

// loader
export function AddAppoinLoader() {
    const sCorreo = fetchData("correo");
    const sPassword = fetchData("pwd");
    return { sCorreo, sPassword };
}

function selectableDayPredicate(_dias) {
    var tempdias = [];
    //Convert String to Date
    if (_dias.length !== 0) {
        for (let index = 0; index < _dias.length; index++) {
            //console.log(_dias[index]);
            var diaAux = parseInt(_dias[index].substring(0, 2));
            var MesAux = parseInt(_dias[index].substring(3, 5)) - 1;
            var AñoAux = parseInt(_dias[index].substring(6, 10));
            //console.log(diaAux+'_'+MesAux+'_'+AñoAux);
            var Aux = new Date(AñoAux, MesAux, diaAux);
            tempdias.push(Aux);
        }
    }
    return tempdias;
}

export function AddAppoin() {
    const location = useLocation();
    const navigate = useNavigate();
    const { sCorreo, sPassword } = useLoaderData();

    const [startDate, setStartDate] = useState();
    const [selectedTime, setselectedTime] = useState('');
    const [selectedIndex, setselectedIndex] = useState();
    const [cita, setcita] = useState([]);
    const [_excludeDates, setExcludeDates] = useState([]);
    const [citas, setCitas] = useState([]);
    const [bMostrarAddress, setbMostrarAddress] = useState(false);
    const [estado, setEstado] = useState();
    const [ciudad, setCiudad] = useState();
    const [colonias, setColonias] = useState([]);
    const [canSubmit, setCanSubmit] = useState(true);
    // const [direccionUno, setDireccionUno] = useState('');
    // const [direccionDos, setDireccionDos] = useState('');
    const [codigoPostal, setCodigoPostal] = useState('');
    const [address, setAddress] = useState({
        address_first: '',
        address_second: "",
        postal_code: "",
        city: "",
        state: ""
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    const { BUSSINESS_ID, USER_ID, DORSL, PHOTO, CATEGORY, SERVICE_LEVEL,
        ADDRESS_FIRST, ADDRESS_SECOND, POSTAL_CODE, CITY, STATE,
        phone, Horario, HOME_SERVICE } = location.state?.business ?? {};
    const userId = location.state?.userId ?? '';
    var _today = new Date();
    const initialDate = new Date(_today);
    const lastDate = new Date(_today.setDate(_today.getDate() + 31));
    const [spaces, setSpaces] = useState([]);
    const [selectSpace, setSelectSpace] = useState(null);
    const [bFin, setbFin] = useState(false);
    const [step, setStep] = useState(1);
    const [bAcceder, setbAcceder] = useState(true);

    const toggleAddress = () => setbMostrarAddress((v) => !v);

    function validate() {
        const e = {};
        if (!address.postal_code.trim())
            e.postal_code = "El Código postal es obligatorio.";
        if (!address.state.trim())
            e.state = "El Estado es obligatorio.";
        if (!address.city.trim())
            e.city = "El Municipio/Ciudad es obligatorio.";
        if (!address.address_second.trim())
            e.address_second = "La Colonia es obligatorio.";
        if (!address.address_first.trim())
            e.address_first = "La Calle / Número externo es obligatorio.";

        return e;
    };



    // Function to convert Base64 string to binary data
    const arrayBufferToBase64 = (buffer) => {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return btoa(binary);
    };

    const ExampleCustomInput = forwardRef(
        ({ onClick, className }, ref) => (
            <label className={className} onClick={onClick} ref={ref}>
                {step === 3 ? <></> : startDate ? <p>{dateSpanish(startDate)}</p> :
                    <p>Elige el día de tu cita</p>
                }
                {step === 2 ? <></> : selectedTime ? <p>{selectedTime}</p> :
                    <p>Selecciona una hora</p>
                }
            </label>
        ),
    );

    function SelectDateTime(date) {
        var tempcita = [];
        for (let index = 0; index < citas.length; index++) {
            var parts = citas[index]['APPOINTMENT_DATE'].split('-');
            var formattedDate = new Date(parts[0], parts[1] - 1, parts[2]);
            if (formattedDate.toLocaleDateString() == date.toLocaleDateString()) {
                tempcita.push(citas[index]['APPOINTMENT']);
            }
        }
        setcita(tempcita);
    };

    const _buildConfirm = async (e) => {
        if (!selectedTime || !startDate) {
            return toast.error(`Selecciona fecha y hora.`);
        }

        if (!canSubmit) return;

        setCanSubmit(false);
        setIsOpen(false);

        const month = (`0` + (startDate.getMonth() + 1)).slice(-2);
        const day = (`0` + startDate.getDate()).slice(-2);
        const selectedDate = `${startDate.getFullYear()}-${month}-${day}`;
        const bus_spaces_id = selectSpace == null ? '' : selectSpace.BUS_SPACES_ID;

        const bodyBase = {
            user_id: userId,
            bussiness_id: BUSSINESS_ID,
            usernotification_id: USER_ID,
            appointment_date: selectedDate,
            appointment_time: selectedTime,
            anonimo: '',
            message: message,
            estatus: '0',
            dorsl: location.state.userName,
            for_who: 'Bus',
            bus_spaces_id: bus_spaces_id
        };

        const endpoint = bMostrarAddress ? 'appoinAddress' : 'appoin';
        const body = bMostrarAddress
            ? { ...bodyBase, address_first: address.address_first, address_second: address.address_second, postal_code: address.postal_code, city: address.city, state: address.state }
            : bodyBase;

        try {
            const resp = await fetch(`${urlApi}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const json = await resp.json();
            if (json.sucess == false) {
                toast.error(`Fecha ${selectedDate} / Hora ${selectedTime} ya no está disponible.`);
                return;
            }
            navigate('/home');
        } catch (e) {
            console.error(e);
            toast.error('Ocurrió un error al guardar la cita. Intenta de nuevo.');
        }
        finally {
            setCanSubmit(true);
        }
    };

    const getCodigoPostal = async (evt) => {
        const value = evt.target.value;
        setCodigoPostal(value);
        setbAcceder(false);
        if (value.length !== 5) {
            setColonias([]);
            setEstado('');
            setCiudad('');
            setbAcceder(true);
            return;
        }
        try {
            const resp = await fetch(`${urlApi}postalCode?d_codigo=${value}`);
            if (!resp.ok) throw new Error('Postal fetch error');
            const json = await resp.json();
            const data = json.data?.[0];
            if (!data) return;
            setEstado(data.d_estado || '');
            setCiudad(data.d_ciudad || '');
            setColonias((data.d_asentas || []).map((a) => a.d_asenta));
            address.postal_code = value;
            address.state = data.d_estado || '';
            address.city = data.d_ciudad || '';
        } catch (e) {
            console.error(e);
        }
        finally {
            setbAcceder(true);
        }
    };

    function handleChange(e) {
        const { name, value } = e.target;
        setAddress((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const actulizarFechasHoras = async (e, busSpacesId) => {
        e.stopPropagation();
        if (busSpacesId !== null) {
            setbAcceder(false);
            //Solicitar por GET
            try {
                // bussiness_id=1&busSpacesId=2
                const response = await fetch(`${urlApi}appoinBussDateDays?bussiness_id=${BUSSINESS_ID}&busSpacesId=${busSpacesId}`);
                if (!response.ok) {
                    console.log(`Error getting getDaysInactive.`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const json = await response.json();
                setExcludeDates(selectableDayPredicate(json.data || []));

                //Solicitar por GET
                try {
                    const response = await fetch(`${urlApi}appoinBussDate?bussiness_id=${BUSSINESS_ID}&busSpacesId=${busSpacesId}`);
                    if (!response.ok) {
                        console.log(`Error getting getDaysInactive.`);
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const json = await response.json();
                    setCitas(json['data']);

                }
                catch (e) {
                    return;
                }
                setbAcceder(true);
                setbFin(true);
            }
            catch (e) {
                return;
            }
        }
    };

    const getBusinessStatus = (Horario) => {
        const horario = Horario == "Siempre abierto" ? "Lu 01-23, Ma 01-23, Mi 01-23, Ju 01-23, Vi 01-23, Sá 01-23, Do 01-23" : Horario;
        const dias = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];

        const now = new Date();

        const diaActual = dias[now.getDay()];
        const horaActual = now.getHours() + now.getMinutes() / 60;

        const bloques = horario.split(',');

        const horarioHoy = bloques.find(
            item => item.trim().startsWith(diaActual)
        );

        if (!horarioHoy) {
            return {
                abierto: false,
                mensaje: "CERRADO",
                hora: "Hoy"
            };
        }

        const match = horarioHoy.match(/(\d+)-(\d+)/);

        if (!match) {
            return {
                abierto: false,
                mensaje: "Horario no disponible",
                hora: ""
            };
        }

        const apertura = parseInt(match[1]);
        const cierre = parseInt(match[2]);

        const abierto = horaActual >= apertura && horaActual < cierre;

        return {
            abierto,
            mensaje: abierto
                ? "ABIERTO"
                : `CERRADO`,
            hora: abierto ? `Hasta las ${cierre}:00` : `Abre a las ${apertura}:00`
        };
    };

    const { abierto, mensaje, hora } = getBusinessStatus(Horario);


    useEffect(() => {
        const fData = async () => {
            if (userId == '') {
                navigate("/");
            }
            else if (sCorreo == null && sPassword == null) {
                navigate("/");
            }
            //Solicitar por GET
            try {
                const response = await fetch(`${urlApi}spaceBusinessId?bussiness_id=${BUSSINESS_ID}`);
                if (response.status == 200) {
                    const json = await response.json();
                    setSpaces(json['data']);
                    setLoading(false);
                }
                else if (response.status == 500) {
                    setStep(2);
                    //Solicitar por GET
                    try {
                        // bussiness_id=1&busSpacesId=2
                        const response = await fetch(`${urlApi}appoinBussDateDays?bussiness_id=${BUSSINESS_ID}`);
                        if (!response.ok) {
                            console.log(`Error getting getDaysInactive.`);
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        const json = await response.json();
                        setExcludeDates(selectableDayPredicate(json.data || []));

                        //Solicitar por GET
                        try {
                            const response = await fetch(`${urlApi}appoinBussDate?bussiness_id=${BUSSINESS_ID}`);
                            if (!response.ok) {
                                console.log(`Error getting getDaysInactive.`);
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                            const json = await response.json();
                            setCitas(json['data']);

                        }
                        catch (e) {
                            return;
                        }

                        setLoading(false);
                    }
                    catch (e) {
                        return;
                    }
                }

            }
            catch (e) {
                return;
            }
        };
        fData();
    }, []);


    if (loading) {
        return <Loaging />;
    }

    const photoBase64 = arrayBufferToBase64(PHOTO == null ? PHOTO : PHOTO.data);
    const showHours = spaces.length === 0 || bFin;
    const groupedHours = {
        morning: [],
        afternoon: [],
        evening: []
    };

    cita[0]?.forEach(item => {
        const hour = parseInt(
            item.APPOINTMENT_TIME.split(':')[0]
        );
        if (hour < 12) {
            groupedHours.morning.push(item);
        }
        else if (hour < 18) {
            groupedHours.afternoon.push(item);
        }
        else {
            groupedHours.evening.push(item);
        }
    });

    const renderHoursGroup = (title, items) => {
        if (!items.length) return null;
        return (
            <div className="mb-6">
                <h5 className="text-left text-sm font-semibold text-gray-500 mb-3">
                    {title}
                </h5>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {items.map(({ APPOINTMENT_TIME, STATUS }, idx) => {
                        const disabled = STATUS !== 'free';
                        const selected =
                            selectedTime === APPOINTMENT_TIME;
                        return (
                            <button
                                key={APPOINTMENT_TIME}
                                disabled={disabled}
                                onClick={() => {
                                    if (!disabled) {
                                        setselectedTime(
                                            selected
                                                ? null
                                                : APPOINTMENT_TIME
                                        );
                                    }
                                }}
                                className={`relative py-4 px-3 rounded-xl border transition-all duration-200 text-center font-medium 
                                    ${selected ? `border-orange-500 bg-orange-50 text-orange-600 shadow-md ring-2 ring-orange-200`
                                        : disabled ? `bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed`
                                            : `bg-white border-gray-200 hover:border-orange-300 hover:shadow-md`}`}>
                                {selected && (
                                    <span className="absolute top-1 right-2">
                                        ✓
                                    </span>
                                )}
                                {APPOINTMENT_TIME}
                            </button>
                        );

                    })}

                </div>

            </div>
        );
    };

    const isAddressComplete =
        codigoPostal.trim() !== '' &&
        estado.trim() !== '' &&
        ciudad.trim() !== '' &&
        address.address_second.trim() !== '' &&
        address.address_first.trim() !== '';

    const canContinue = !bMostrarAddress || isAddressComplete;


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-600 to-orange-800 p-4">
            <div className="max-w-6xl mx-auto mt-14 p-6 space-y-6 text-gray-800">

                <div className="bg-white rounded-3xl shadow-xl space-y-8 p-10 max-w-2xl w-full text-center animate-fade-in-up">
                    <div className="flex flex-col items-center">
                        {photoBase64 ? (
                            <img className="w-36 h-36 rounded-full object-cover border mt-4" src={`data:image/jpeg;base64,${photoBase64}`} alt="business" />
                        ) : (
                            <img className="w-36 h-36 rounded-full object-cover border mt-4 bg-gray-200" src={Store} alt="default" />
                        )}
                        <h3 className="text-2xl font-bold mt-4 text-black">{DORSL}</h3>
                        <p className="text-gray-500 mb-3">{CATEGORY}</p>
                        {/* HORARIO */}
                        <div className="flex items-center justify-center gap-2">
                            <div
                                className={`w-3 h-3 rounded-full ${abierto
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                    }`}
                            />
                            <span
                                className={`font-medium ${abierto
                                    ? "text-green-600"
                                    : "text-red-600"
                                    }`}
                            >
                                {mensaje}
                            </span>
                        </div>
                        <div className="flex items-center justify-center mb-2">
                            <span
                                className="text-gray-500 font-medium">
                                {hora}
                            </span>
                        </div>
                        <div className="w-full flex items-center gap-3 px-4 mt-2">
                            <div className="text-left leading-tight">
                                <p className="text-gray-500 text-sm"> 📍 {ADDRESS_FIRST} {ADDRESS_SECOND} CP {POSTAL_CODE} {CITY}, {STATE}</p>
                            </div>
                        </div>
                        {/* TELÉFONO */}
                        <div className="w-full flex items-center gap-3 px-4 mt-2">
                            {phone !== "" ? <a href={`tel:${phone}`} className="text-gray-500 text-sm">
                                📞 Llamar ahora
                            </a> : <div className="text-gray-500 text-sm">
                                Este negocio aún no ha agregado información de contacto.
                            </div>}
                        </div>
                    </div>
                </div>


                <div className="bg-white rounded-3xl shadow-xl space-y-8 p-10 max-w-2xl w-full text-center animate-fade-in-up">

                    <div className="hidden lg:flex items-center justify-center mb-4">
                        <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                                ${step >= 1 ? "bg-orange-500 text-white" : "bg-gray-300 text-gray-600"}`}   >
                                1
                            </div>
                            <span className="text-xs mt-1">Espacio</span>
                        </div>

                        <div className={`w-16 h-1 mx-2 ${step > 1 ? "bg-orange-500 text-white" : "bg-gray-300 text-gray-600"}`}></div>

                        <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                                ${step >= 2 ? "bg-orange-500 text-white" : "bg-gray-300 text-gray-600"}`} >
                                2
                            </div>
                            <span className="text-xs mt-1">Fecha</span>
                        </div>

                        <div className={`w-16 h-1 mx-2 ${step > 2 ? "bg-orange-500 text-white" : "bg-gray-300 text-gray-600"}`}></div>

                        <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                                ${step >= 3 ? "bg-orange-500 text-white" : "bg-gray-300 text-gray-600"}`}>
                                3
                            </div>
                            <span className="text-xs mt-1">Hora</span>
                        </div>

                        <div className={`w-16 h-1 mx-2 ${step > 3 ? "bg-orange-500 text-white" : "bg-gray-300 text-gray-600"}`}></div>

                        {HOME_SERVICE == '1' ?
                            <>
                                <div className="flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                                ${step >= 4 ? "bg-orange-500 text-white" : "bg-gray-300 text-gray-600"}`}>
                                        4
                                    </div>
                                    <span className="text-xs mt-1">Lugar de atención</span>
                                </div>
                                <div className={`w-16 h-1 mx-2 ${step > 4 ? "bg-orange-500 text-white" : "bg-gray-300 text-gray-600"}`}></div>
                                <div className="flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                                ${step >= 5 ? "bg-orange-500 text-white" : "bg-gray-300 text-gray-600"}`}>
                                        5
                                    </div>
                                    <span className="text-xs mt-1">Guardar</span>
                                </div>
                            </> :
                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                                ${step >= 4 ? "bg-orange-500 text-white" : "bg-gray-300 text-gray-600"}`}>
                                    4
                                </div>
                                <span className="text-xs mt-1">Guardar</span>
                            </div>
                        }


                    </div>
                    {/* Menú móvil */}
                    <div className='lg:hidden'>
                        <p className="text-sm text-gray-500">
                            Paso {step} de {HOME_SERVICE === '1' ? 5 : 4}
                        </p>

                        {step === 1 && (
                            <h3 className="text-xl font-bold">
                                Espacio de servicio
                            </h3>
                        )}
                        {step === 2 && (
                            <h3 className="text-xl font-bold">
                                Fecha
                            </h3>
                        )}
                        {step === 3 && (
                            <h3 className="text-xl font-bold">
                                Hora
                            </h3>
                        )}
                        {HOME_SERVICE == '1' ?
                            <>
                                {step === 4 && (
                                    <h3 className="text-xl font-bold">
                                        Lugar de atención
                                    </h3>

                                )}
                                {step === 5 && (
                                    <h3 className="text-xl font-bold">
                                        Confirmar
                                    </h3>

                                )}
                            </> :
                            step === 4 && (
                                <h3 className="text-xl font-bold">
                                    Confirmar
                                </h3>
                            )
                        }

                    </div>

                    {step === 1 && <>
                        {spaces.length > 0 ? <hr className="my-4" /> : <></>}

                        {spaces.length > 0 ? <div className="text-left px-4">
                            <h4 className="text-lg font-semibold">Espacio de servicio</h4>
                        </div> : <></>}

                        {spaces.length > 0 ? spaces.map((index) => (
                            // <div className="font-semibold   shadow-md transition flex items-center justify-between"
                            <div className={`bg-white py-2 px-2 rounded-md shadow-xl p-10 text-center mb-2
                                transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl 
                                ${selectSpace?.BUS_SPACES_ID == index.BUS_SPACES_ID ? "ring-2 ring-blue-500" : ""} `}
                                onClick={() => {
                                    setSelectSpace(selectSpace?.BUS_SPACES_ID == index.BUS_SPACES_ID ? null : index);

                                    setbFin(false);
                                    setStartDate(null);
                                    setselectedTime('');
                                    setselectedIndex();
                                    setcita([]);
                                }}>
                                <div className="flex items-center space-x-4" >
                                    <TagIcon className={`w-6 h-6 ml-2" ${selectSpace?.BUS_SPACES_ID == index.BUS_SPACES_ID ? "text-blue-500" : "text-orange-600"} `} />
                                    <div className='flex flex-col'>
                                        <label className="text-black">{index.ALIAS}</label>
                                        <p className="text-gray-400">{index.NAME_SPACE}</p>
                                    </div>
                                </div>
                            </div>
                        )) : <></>}
                        <button
                            disabled={!selectSpace}
                            onClick={(e) => {
                                actulizarFechasHoras(e, selectSpace.BUS_SPACES_ID);
                                setStep(2);
                            }}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-md 
                                            ${selectSpace ? "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg"
                                    : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"} `} >
                            Siguiente →
                        </button>
                    </>
                    }

                    {/* Div - Agendar */}
                    {step === 2 &&
                        <>
                            {bAcceder ?
                                <div className='items-center justify-center '>
                                    {showHours && <hr className="my-4" />}

                                    {showHours && <div className="text-left px-4">
                                        <h4 className="text-lg font-semibold mb-2">📅 ¿Qué día deseas asistir?</h4>
                                    </div>}
                                    {showHours && <div className='flex justify-center items-center ms-4'>
                                        {/* <CalendarDateRangeIcon className='w-6 h-6 mx-4 text-orange-500' /> */}
                                        <div>
                                            <DatePicker className='text-gray-400 text-left'
                                                inline
                                                dateFormat="dd/MM/yyyy"
                                                excludeDates={_excludeDates}
                                                selected={startDate}
                                                onChange={(date) => { setStartDate(date); SelectDateTime(date); setselectedTime(''); setselectedIndex(); }}
                                                minDate={initialDate}
                                                maxDate={lastDate}
                                            // customInput={<ExampleCustomInput className="example-custom-input cursor-pointer" />}
                                            />
                                        </div>
                                    </div>}



                                    {startDate && (
                                        <div className="mb-1 text-sm text-green-600 font-medium">
                                            ✓ Fecha seleccionada: {dateSpanish(startDate)}
                                        </div>
                                    )}

                                    {startDate && (
                                        <button
                                            onClick={() => {
                                                setStartDate(null);
                                                setselectedTime(null);
                                                setselectedIndex(null);
                                            }}
                                            className="text-red-500 text-sm"
                                        >
                                            Limpiar fecha
                                        </button>
                                    )}

                                    <div className="flex justify-between mt-4 mb-4">

                                        <button className="px-6 py-3 rounded-xl border border-gray-300 text-gray-600 font-medium hover:bg-gray-100 transition-all"
                                            onClick={() => {
                                                if (spaces.length > 0)
                                                    setStep(1);
                                                else setStep(2);
                                            }}
                                        >
                                            ← Atrás
                                        </button>

                                        <button
                                            disabled={!startDate}
                                            onClick={() => setStep(3)}
                                            className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-md 
                                            ${startDate ? "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg"
                                                    : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"} `} >
                                            Siguiente →
                                        </button>

                                    </div>

                                </div>

                                : <div>
                                    <hr className="my-4" />
                                    <div className="flex items-center justify-center p-4">
                                        <div className="flex flex-col items-center justify-center py-12">
                                            <div className="w-10 h-10 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"></div>

                                            <p className="mt-4 text-sm text-gray-400">
                                                Cargando...
                                            </p>
                                        </div>
                                    </div>
                                </div>}
                        </>
                    }

                    {step === 3 &&
                        <>
                            {bAcceder ?
                                <div>
                                    {showHours && <hr className="my-4" />}

                                    {showHours && <div className="text-left px-4 mb-2">
                                        <h4 className="text-lg font-semibold">🕒 ¿A qué hora te gustaría asistir?</h4>
                                    </div>}
                                    {/* Horarios */}
                                    {showHours &&
                                        <>
                                            {renderHoursGroup(
                                                "🌅 Mañana",
                                                groupedHours.morning
                                            )}

                                            {renderHoursGroup(
                                                "☀️ Tarde",
                                                groupedHours.afternoon
                                            )}

                                            {renderHoursGroup(
                                                "🌙 Noche",
                                                groupedHours.evening
                                            )}
                                        </>}

                                    {selectedTime && (
                                        <div className="mb-4 text-sm text-green-600 font-medium">
                                            ✓ Horario seleccionado: {selectedTime}
                                        </div>
                                    )}

                                    <div className="flex justify-between">

                                        <button className="px-6 py-3 rounded-xl border border-gray-300 text-gray-600 font-medium hover:bg-gray-100 transition-all"
                                            onClick={() => setStep(2)} >
                                            ← Atrás
                                        </button>

                                        <button
                                            disabled={!selectedTime}
                                            onClick={() => setStep(4)}
                                            className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-md 
                                            ${selectedTime ? "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg"
                                                    : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"} `} >
                                            Siguiente →
                                        </button>

                                    </div>

                                </div>

                                : <div>
                                    <hr className="my-4" />
                                    <div className="flex items-center justify-center p-4">
                                        <div className="flex flex-col items-center justify-center py-12">
                                            <div className="w-10 h-10 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"></div>

                                            <p className="mt-4 text-sm text-gray-400">
                                                Cargando...
                                            </p>
                                        </div>
                                    </div>

                                </div>}
                        </>
                    }

                    {HOME_SERVICE == '1' ?
                        <>
                            {step === 4 && (
                                <div className='items-center justify-center'>
                                    <div className="text-left px-4">
                                        <h4 className="text-lg font-semibold mb-2">¿Dónde deseas recibir el servicio?</h4>
                                    </div>


                                    <div className="flex items-center justify-center">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <h4 className="text-lg font-semibold mb-2"
                                                onClick={() => {
                                                    setbMostrarAddress(false);
                                                }}>📍 Acudir al establecimiento</h4>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-center">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <h4 className="text-lg font-semibold mb-2" onClick={() => {
                                                setbMostrarAddress(true);
                                            }}>🏠 Servicio a domicilio</h4>
                                        </label>
                                    </div>

                                    <div className="px-4 mb-4 transition-opacity duration-900">
                                        <div className={`${bMostrarAddress ? 'grid' : 'hidden'} grid-cols-1 md:grid-cols-2 gap-4 mt-4`}>
                                            <p className="text-sm text-gray-500 md:col-span-2">
                                                Ingresa tu código postal para completar la dirección automáticamente.
                                            </p>
                                            <div className="md:col-span-2">
                                                <label className="text-xs font-medium">Código postal</label>
                                                <input maxLength={5} value={codigoPostal} onChange={getCodigoPostal}
                                                    className="mt-1 w-full border-2 border-orange-200 rounded-xl p-3 text-lg tracking-widest"
                                                    placeholder="Código postal" />
                                                {errors.postal_code && <p className="mt-1 text-xs text-red-600">{errors.postal_code}</p>}
                                                {estado && (
                                                    <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-3 text-green-700 text-sm">
                                                        ✓ Código postal encontrado. Verifica tu colonia y completa la dirección.
                                                    </div>
                                                )}
                                                {bAcceder ? <></> : <div>
                                                    <hr className="my-4" />
                                                    <div className="flex items-center justify-center p-4">
                                                        <div className="flex flex-col items-center justify-center py-12">
                                                            <div className="w-10 h-10 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"></div>

                                                            <p className="mt-4 text-sm text-gray-400">
                                                                Cargando...
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>}
                                                <div className="my-6"></div>
                                            </div>
                                            {estado && (
                                                <>
                                                    <div>
                                                        <label className="text-xs font-medium">Estado</label>
                                                        <input value={estado} disabled className="mt-1 w-full rounded-xl bg-gray-50 border px-3 py-3" placeholder="Estado" />
                                                        {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state}</p>}
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-medium">Municipio/Ciudad</label>
                                                        <input value={ciudad} disabled className="mt-1 w-full rounded-xl bg-gray-50 border px-3 py-3" placeholder="Municipio/Ciudad" />
                                                        {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <label className="text-xs font-medium">Colonia</label>
                                                        <input list="optionsList" value={address.address_second}
                                                            // onChange={handleChange} 
                                                            onChange={(e) => {
                                                                const raw = e.target.value;
                                                                setAddress(prev => ({ ...prev, address_second: raw }));
                                                            }}
                                                            disabled={colonias.length == 0} className="mt-1 w-full border rounded-md p-2" placeholder="Empieza a escribir tu colonia..." />
                                                        <datalist id="optionsList">
                                                            {colonias.map((c, i) => <option key={i} value={c} />)}
                                                        </datalist>
                                                        {errors.address_second && <p className="mt-1 text-xs text-red-600">{errors.address_second}</p>}
                                                    </div>
                                                </>
                                            )}
                                            <div className="md:col-span-2">
                                                <div className="h-6"></div>
                                                <label className="text-xs font-medium">Calle / Número externo</label>
                                                <input name="address_first" disabled={!estado}
                                                    value={address.address_first} onChange={handleChange}
                                                    className="mt-1 w-full border rounded-md p-2" placeholder="Ej. Hidalgo #125" />
                                                {errors.address_first && <p className="mt-1 text-xs text-red-600">{errors.address_first}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {bMostrarAddress ?
                                        <div className="mb-4 text-sm text-green-600 font-medium">
                                            ✓ Seleccionado: Servicio a domicilio
                                        </div>
                                        : <div className="mb-4 text-sm text-green-600 font-medium">
                                            ✓ Seleccionado: Acudir al establecimiento
                                        </div>}

                                    <div className="flex justify-between">

                                        <button className="px-6 py-3 rounded-xl border border-gray-300 text-gray-600 font-medium hover:bg-gray-100 transition-all"
                                            onClick={() => setStep(3)} >
                                            ← Atrás
                                        </button>

                                        <button
                                            onClick={(e) => {
                                                if (bMostrarAddress) {
                                                    e.preventDefault();
                                                    const eobj = validate();
                                                    setErrors(eobj);
                                                    if (Object.keys(eobj).length > 0) return;
                                                }
                                                setStep(5);

                                            }}
                                            className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-md 
                                            ${canContinue ? "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg"
                                                    : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"} `} >
                                            Siguiente →
                                        </button>

                                    </div>

                                </div>

                            )}
                            {step === 5 && (
                                <>
                                    <hr className="my-4" />
                                    <h4 className="text-xl font-bold text-center mb-2">Confirmar</h4>
                                    {spaces.length > 0 ? <div className="px-4">
                                        <h4 className="font-semibold">{selectSpace == null ? '' : selectSpace.ALIAS}</h4>
                                        <h4 className="font-medium mb-2">{selectSpace == null ? '' : selectSpace.NAME_SPACE}</h4>
                                    </div> : <></>}
                                    <div className="px-4">
                                        <p><b>{dateSpanish(startDate)}</b></p>
                                        <p>Hora: <b>{selectedTime}</b></p>
                                    </div>
                                    <div className="px-4">
                                        <p className="text-center text-yellow-500 mb-4">¿Deseas guardar tu cita?</p>
                                        <p className="text-center text-gray-500 mt-1">Motivo de la visita/Servicio</p>
                                        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full mt-3 border rounded-md p-2" rows={4} placeholder="Opcional" />
                                    </div>
                                    {canSubmit ? (
                                        <div className="flex justify-end gap-3 mt-4">
                                            <button onClick={() => setStep(4)} className="px-6 py-3 rounded-xl border border-gray-300 text-gray-600 font-medium hover:bg-gray-100 transition-all">← </button>
                                            <button onClick={_buildConfirm} className="px-4 py-2 rounded-md bg-orange-500 text-white">Confirmar cita</button>
                                        </div>
                                    ) : (
                                        <div className="flex justify-end gap-3 mt-4">
                                            <button className="w-full py-3 rounded-md bg-gray-300">
                                                <span className="animate-pulse">Procesando...</span>
                                            </button>
                                        </div>
                                    )}

                                </>

                            )}
                        </> :
                        step === 4 && (
                            <>
                                <hr className="my-4" />
                                <h4 className="text-xl font-bold text-center mb-2">Confirmar</h4>
                                {spaces.length > 0 ? <div className="px-4">
                                    <h4 className="font-semibold">{selectSpace == null ? '' : selectSpace.ALIAS}</h4>
                                    <h4 className="font-medium mb-2">{selectSpace == null ? '' : selectSpace.NAME_SPACE}</h4>
                                </div> : <></>}
                                <div className="px-4">
                                    <p><b>{dateSpanish(startDate)}</b></p>
                                    <p>Hora: <b>{selectedTime}</b></p>
                                </div>
                                <div className="px-4">
                                    <p className="text-center text-yellow-500 mb-4">¿Deseas guardar tu cita?</p>
                                    <p className="text-center text-gray-500 mt-1">Motivo de la visita/Servicio</p>
                                    <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full mt-3 border rounded-md p-2" rows={4} placeholder="Opcional" />
                                </div>


                                {canSubmit ? (
                                    <div className="flex justify-end gap-3 mt-4">
                                        <button onClick={() => setStep(3)} className="px-6 py-3 rounded-xl border border-gray-300 text-gray-600 font-medium hover:bg-gray-100 transition-all">← </button>
                                        <button onClick={_buildConfirm} className="px-4 py-2 rounded-md bg-orange-500 text-white">Confirmar cita</button>
                                    </div>
                                ) : (
                                    <div className="flex justify-end gap-3 mt-4">
                                        <button className="w-full py-3 rounded-md bg-gray-300">
                                            <span className="animate-pulse">Procesando...</span>
                                        </button>
                                    </div>
                                )}


                            </>

                        )
                    }
                </div>
            </div >
        </div >

    );
}

export default AddAppoin;