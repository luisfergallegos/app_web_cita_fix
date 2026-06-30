// rrd imports
import { useLoaderData, useNavigate } from 'react-router-dom';
import { fetchData, dateSpanish } from "../../Wrapper.js";
import { forwardRef, useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { toast } from "react-toastify";
// assets
import Loaging from '../../components/Loading.jsx';
import { urlApi } from "../../styles/Constants.jsx";
import Logo from "../../assets/splash.png";
// Library
import { CalendarDateRangeIcon, UserCircleIcon, XMarkIcon as CloseIcon, TagIcon } from '@heroicons/react/24/solid';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

// loader
export function AddAppoinBusinesssAnonLoader() {
    const sCorreo = fetchData("correo");
    const sPassword = fetchData("pwd");
    return { sCorreo, sPassword };
}

function selectableDayPredicate(_dias) {
    var tempdias = [];
    //Convert String to Date
    if (_dias.length !== 0) {
        for (let index = 0; index < _dias.length; index++) {
            var diaAux = parseInt(_dias[index].substring(0, 2));
            var MesAux = parseInt(_dias[index].substring(3, 5)) - 1;
            var AñoAux = parseInt(_dias[index].substring(6, 10));
            var Aux = new Date(AñoAux, MesAux, diaAux);
            tempdias.push(Aux);
        }
    }
    return tempdias;
}


export function AddAppoinBusinesssAnon() {
    const location = useLocation();
    const navigate = useNavigate();
    const { sCorreo, sPassword } = useLoaderData();

    const [startDate, setStartDate] = useState();
    const [selectedTime, setselectedTime] = useState('');
    const [selectedIndex, setselectedIndex] = useState();
    const [cita, setcita] = useState([]);
    const [_excludeDates, setExcludeDates] = useState([]);
    const [citas, setCitas] = useState([]);
    const [bAcceder, setbAcceder] = useState(true);
    // const [bAccederSpace, setbAccederSpace] = useState(true);
    const [message, setMessage] = useState('');
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [phone, setPhone] = useState('');
    const [errorCorreo, setErrorCorreo] = useState('');
    const [errorPhone, setErrorPhone] = useState('');

    const [loading, setLoading] = useState(true);
    const [canSubmit, setCanSubmit] = useState(true);

    // const businessId = location.state?.businessId ?? '';
    // const dorsl = location.state?.dorsl;

    const empresa = location.state?.empresa ?? '';

    const [spaces, setSpaces] = useState([]);
    const [selectSpace, setSelectSpace] = useState(location.state?.selectSpace || []);
    const [bFin, setbFin] = useState(false);
    var _today = new Date();
    const initialDate = new Date(_today);
    const lastDate = new Date(_today.setDate(_today.getDate() + 31));
    const [bSwitchPhoneEmail, setbSwitchPhoneEmail] = useState(true);
    const [step, setStep] = useState(1);
    // const [showAlert, setShowAlert] = useState(false);
    // const [errorMsg, setErrorMsg] = useState('');

    const ExampleCustomInput = forwardRef(
        ({ onClick, className }, ref) => (
            <label className={className} onClick={onClick} ref={ref}>
                {startDate ? <p>{dateSpanish(startDate)}</p> :
                    <p>Selecciona una fecha</p>
                }
                {selectedTime ? <p>{selectedTime}</p> :
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
    }

    const ModSwitchPhoneEmail = () => {
        setbSwitchPhoneEmail(!bSwitchPhoneEmail);
    };

    const _buildConfirm = async () => {
        if (!selectedTime || !startDate) {
            return toast.error(`Selecciona fecha y hora.`);
        }

        if (!canSubmit) return;

        setCanSubmit(false);

        var anonimo = bSwitchPhoneEmail ? `${nombre},+52 ${phone}` : `${nombre},${correo}`;
        var dateFormat = startDate.getMonth() + 1;
        var _selectedDate = `${startDate.getFullYear()}-${('0' + dateFormat).slice(-2)}-${startDate.getDate()}`;
        const bus_spaces_id = selectSpace.length == 0 ? '' : selectSpace.BUS_SPACES_ID;
        const name_space = selectSpace.length == 0 ? '' : selectSpace.ALIAS;
        //Enviar por POST
        var options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                {
                    'user_id': '0',
                    'bussiness_id': empresa.BUSSINESS_ID,
                    'usernotification_id': '0',
                    'appointment_date': _selectedDate,
                    'appointment_time': selectedTime,
                    'anonimo': anonimo,
                    'message': message,
                    'estatus': '0',
                    'dorsl': empresa.DORSL,
                    'for_who': 'Bus',
                    'bus_spaces_id': bus_spaces_id,
                    'name_space': name_space
                })
        }        
        try {
            var url = bSwitchPhoneEmail ? `${urlApi}appoinW` : `${urlApi}appoin`;            
            const response = await fetch(url, options);
            const json = await response.json();
            if (json['sucess'] == false) {
                toast.error(`Ya no se encuentra disponible Fecha : ${_selectedDate} Hora : ${selectedTime} Corríjalo e inténtelo nuevamente.`);
                // console.log(`Error al guardar cita.`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            else {
                navigate("/");
            }
        }
        catch (e) {            
            return;
        }
        finally{
            setCanSubmit(true);
        }
    };

    const handleChangeMessage = evt => {
        const value = evt.target.value;
        setMessage(value);
    };

    const handleChangeName = evt => {
        const value = evt.target.value;
        setNombre(value);
    };

    const handleChangeEmail = evt => {
        const value = evt.target.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            setErrorCorreo('Correo electrónico inválido.');
            setCorreo(value);
            return;
        } else {
            setErrorCorreo('');
            setCorreo(value);
        }

    };

    const handleChangePhone = evt => {
        const value = evt.target.value;
        const isValidPhone = value.replace(/\D/g, '');
        if (isValidPhone.length != 10) {
            setPhone(isValidPhone);
            setErrorPhone('Número de teléfono inválido.');
            return;
        }
        else {
            setPhone(`(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`);
            setErrorPhone('');
        }
    };

    const actulizarFechasHoras = async (e, busSpacesId) => {
        e.stopPropagation();
        setbAcceder(false);
        //Solicitar por GET
        try {
            // bussiness_id=1&busSpacesId=2
            const response = await fetch(`${urlApi}appoinBussDateDays?bussiness_id=${empresa.BUSSINESS_ID}&busSpacesId=${busSpacesId}`);
            if (!response.ok) {
                console.log(`Error getting getDaysInactive.`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const json = await response.json();
            setExcludeDates(selectableDayPredicate(json.data || []));

            //Solicitar por GET
            try {
                const response = await fetch(`${urlApi}appoinBussDate?bussiness_id=${empresa.BUSSINESS_ID}&busSpacesId=${busSpacesId}`);
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

    };

    useEffect(() => {
        const fData = async () => {
            if (empresa.BUSSINESS_ID == '') {
                navigate("/");
            }
            // else if (sCorreo == null && sPassword == null) {
            //     navigate("/");
            // }
            else if (selectSpace.length == 0) {
                //Solicitar por GET
                try {
                    const response = await fetch(`${urlApi}spaceBusinessId?bussiness_id=${empresa.BUSSINESS_ID}`);
                    if (response.status == 200) {
                        const json = await response.json();
                        setSpaces(json['data']);
                        setLoading(false);
                    }
                    else if (response.status == 500) {
                        setStep(2);
                        //Solicitar por GET
                        try {
                            const response = await fetch(`${urlApi}appoinBussDateDays?bussiness_id=${empresa.BUSSINESS_ID}`);
                            if (!response.ok) {
                                console.log(`Error getting getDaysInactive.`);
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                            const json = await response.json();
                            setExcludeDates(selectableDayPredicate(json['data']));

                            //Solicitar por GET
                            try {
                                const response = await fetch(`${urlApi}appoinBussDate?bussiness_id=${empresa.BUSSINESS_ID}`);
                                if (!response.ok) {
                                    console.log(`Error getting getDaysInactive.`);
                                    throw new Error(`HTTP error! status: ${response.status}`);
                                }
                                const json = await response.json();
                                setCitas(json['data']);
                                setLoading(false);
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
            }
            else {
                //Solicitar por GET
                try {
                    const response = await fetch(`${urlApi}appoinBussDateDays?bussiness_id=${empresa.BUSSINESS_ID}&busSpacesId=${selectSpace.BUS_SPACES_ID}`);
                    if (!response.ok) {
                        console.log(`Error getting getDaysInactive.`);
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const json = await response.json();
                    setExcludeDates(selectableDayPredicate(json['data']));

                    //Solicitar por GET
                    try {
                        const response = await fetch(`${urlApi}appoinBussDate?bussiness_id=${empresa.BUSSINESS_ID}&busSpacesId=${selectSpace.BUS_SPACES_ID}`);
                        if (!response.ok) {
                            console.log(`Error getting getDaysInactive.`);
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        const json = await response.json();
                        setCitas(json['data']);
                        setLoading(false);
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



        };
        fData();
    }, []);

    if (loading) {
        return <Loaging />;
    }

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

    const { abierto, mensaje, hora } = getBusinessStatus(empresa.Horario);
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

    const puedeContinuar = bSwitchPhoneEmail
        ? nombre.trim() !== "" && phone.trim() !== ""
        : nombre.trim() !== "" && correo.trim() !== "";

    const showHours = spaces.length === 0 || bFin;

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

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-600 to-gray-800 p-4">
                {/* <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-6 text-center mt-20"> */}
                <div className="max-w-6xl mx-auto mt-14 p-6 space-y-6 text-gray-800">
                    <div className="bg-white rounded-3xl shadow-xl space-y-8 p-10 max-w-2xl w-full text-center animate-fade-in-up">
                        <div className="flex flex-col items-center">
                            <UserCircleIcon className="w-36 h-36  object-cover rounded-full border mt-4 bg-orange-600" width={200}
                                color={'#fff'
                                } />
                            <h3 className="text-2xl font-bold mt-4 text-black">{empresa.DORSL}</h3>
                            <p className="text-gray-500 mb-3">{empresa.CATEGORY}</p>
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
                                    <p className="text-gray-500 text-sm"> 📍 {empresa.ADDRESS_FIRST} {empresa.ADDRESS_SECOND} CP {empresa.POSTAL_CODE} {empresa.CITY}, {empresa.STATE}</p>
                                </div>
                            </div>
                            {/* TELÉFONO */}
                            <div className="w-full flex items-center gap-3 px-4 mt-2">
                                {empresa.phone !== "" ? <a href={`tel:${empresa.phone}`} className="text-gray-500 text-sm">
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
                                ${step >= 2 ? "bg-orange-500 text-white" : "bg-gray-300 text-gray-600"}`}   >
                                    2
                                </div>
                                <span className="text-xs mt-1">Contacto</span>
                            </div>

                            <div className={`w-16 h-1 mx-2 ${step > 2 ? "bg-orange-500 text-white" : "bg-gray-300 text-gray-600"}`}></div>

                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                                ${step >= 3 ? "bg-orange-500 text-white" : "bg-gray-300 text-gray-600"}`} >
                                    3
                                </div>
                                <span className="text-xs mt-1">Fecha</span>
                            </div>

                            <div className={`w-16 h-1 mx-2 ${step > 3 ? "bg-orange-500 text-white" : "bg-gray-300 text-gray-600"}`}></div>

                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                                ${step >= 4 ? "bg-orange-500 text-white" : "bg-gray-300 text-gray-600"}`}>
                                    4
                                </div>
                                <span className="text-xs mt-1">Hora</span>
                            </div>

                            <div className={`w-16 h-1 mx-2 ${step > 4 ? "bg-orange-500 text-white" : "bg-gray-300 text-gray-600"}`}></div>

                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                                ${step >= 5 ? "bg-orange-500 text-white" : "bg-gray-300 text-gray-600"}`}>
                                    5
                                </div>
                                <span className="text-xs mt-1">Guardar</span>
                            </div>
                        </div>
                        {/* Menú móvil */}
                        <div className='lg:hidden'>
                            <p className="text-sm text-gray-500">
                                Paso {step} de 5
                            </p>

                            {step === 1 && (
                                <h3 className="text-xl font-bold">
                                    Espacio de servicio
                                </h3>
                            )}
                            {step === 2 && (
                                <h3 className="text-xl font-bold">
                                    Información de contacto
                                </h3>
                            )}
                            {step === 3 && (
                                <h3 className="text-xl font-bold">
                                    Fecha
                                </h3>
                            )}
                            {step === 4 && (
                                <h3 className="text-xl font-bold">
                                    Hora
                                </h3>
                            )}
                            {step === 5 && (
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


                        {step === 2 &&
                            <>
                                <hr className="my-4" />

                                <div className='block ms-4 mt-4 mr-5'>
                                    <div>
                                        <h4 className='mb-2'>¿Cuál es el tu nombre?</h4>
                                        <input
                                            type="text"
                                            placeholder="Ingresa el nombre"
                                            className="w-full  px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                            value={nombre} onChange={handleChangeName} required
                                        />
                                    </div>
                                    <div className='flex items-center mt-4 mb-4'>
                                        <h4>¿Deseas que sea por número de teléfono?</h4>
                                        <label className="inline-flex items-center cursor-pointer ml-4">
                                            <input type="checkbox" checked={bSwitchPhoneEmail} onChange={ModSwitchPhoneEmail} className="sr-only peer" />
                                            <div className="relative w-10 h-6 rounded-full bg-gray-300 transition-colors peer-checked:bg-orange-500 
                                                after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 
                                                after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-4 "
                                            />
                                        </label>
                                    </div>
                                    {bSwitchPhoneEmail ?
                                        <div className='grid'>
                                            <h4>{bSwitchPhoneEmail ? '¿Cuál es el número de teléfono?' : '¿Cuál es el correo electrónico?'}</h4>
                                            <input
                                                type="tel"
                                                placeholder="Número de teléfono"
                                                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                                value={phone}
                                                onChange={handleChangePhone} required
                                            />
                                            {errorPhone != '' ? <label htmlFor="" style={{ color: 'red' }}>{errorPhone}</label> : <></>}
                                            <span>En este número de teléfono recibirá un recordatorio de su vista.</span>
                                        </div> :
                                        <></>
                                    }
                                    {!bSwitchPhoneEmail ?
                                        <div className='grid'>
                                            <h4>{bSwitchPhoneEmail ? '¿Cuál es el número de teléfono?' : '¿Cuál es el correo electrónico?'}</h4>
                                            <input
                                                type="email"
                                                placeholder="Correo electrónico"
                                                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                                value={correo}
                                                onChange={handleChangeEmail} required
                                            />
                                            {errorCorreo != '' ? <label htmlFor="" style={{ color: 'red' }}>{errorCorreo}</label> : <></>}
                                            <span>En este correo electrónico recibirá un recordatorio de su vista.</span>
                                        </div>
                                        :
                                        <></>
                                    }
                                </div>
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
                                        onClick={(e) => {
                                            if (!puedeContinuar) {
                                                toast.error('Completa todos los campos.');
                                                return;
                                            }
                                            setStep(3);
                                        }}
                                        className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-md 
                                            ${puedeContinuar ? "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg"
                                                : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"} `} >
                                        Siguiente →
                                    </button>

                                </div>

                            </>
                        }

                        {/* Div - Agendar */}
                        {step === 3 &&
                            <>
                                {bAcceder ?
                                    <div className='items-center justify-center '>
                                        {showHours && <hr className="my-4" />}

                                        {showHours && <div className="text-left px-4">
                                            <h4 className="text-lg font-semibold mb-2">📅 ¿Qué día deseas asistir?</h4>
                                        </div>}
                                        {showHours && <div className='flex justify-center items-center ms-4'>
                                            <div>
                                                <DatePicker className='text-gray-400 text-left'
                                                    inline
                                                    dateFormat="dd/MM/yyyy"
                                                    excludeDates={_excludeDates}
                                                    selected={startDate}
                                                    onChange={(date) => { setStartDate(date); SelectDateTime(date); setselectedTime(''); setselectedIndex(); }}
                                                    minDate={initialDate}
                                                    maxDate={lastDate}
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
                                                    setStep(2);
                                                }}
                                            >
                                                ← Atrás
                                            </button>

                                            <button
                                                disabled={!startDate}
                                                onClick={() => setStep(4)}
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

                        {step === 4 &&
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
                                                onClick={() => setStep(3)} >
                                                ← Atrás
                                            </button>

                                            <button
                                                disabled={!selectedTime}
                                                onClick={() => setStep(5)}
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
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddAppoinBusinesssAnon;