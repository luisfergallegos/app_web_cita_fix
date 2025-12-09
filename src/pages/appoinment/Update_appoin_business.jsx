// rrd imports
import { useLoaderData, useNavigate } from 'react-router-dom';
import { dateSpanish, fetchData } from "../../Wrapper.js";
import { forwardRef, useEffect, useState } from "react";
import { toast } from "react-toastify";
// assets
// import './Add_appoin.css';
import '../../components/Loading.css';
import Loaging from '../../components/Loading.jsx';
import { urlApi } from "../../styles/Constants.jsx";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import User from "../../assets/e.png";
import {
    BarsArrowUpIcon,
    CalendarDateRangeIcon, EnvelopeIcon, InformationCircleIcon, MapPinIcon, PhoneIcon,
    TrashIcon,
    XMarkIcon as CloseIcon
} from '@heroicons/react/24/solid';

// loader
export async function UpdateAppoinLoader({ params }) {
    const sCorreo = fetchData("correo");
    const sPassword = fetchData("pwd");
    const citaId = params.id;
    return { sCorreo, sPassword, citaId };
}

export function UpdateAppoinBusiness() {
    const navigate = useNavigate();
    const { sCorreo, sPassword, citaId } = useLoaderData();
    const [loading, setLoading] = useState(true);
    const [cita, setCita] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenU, setIsOpenU] = useState(false);
    const [message, setMessage] = useState('');
    const [bPopupMenuButton, setPopupMenuButton] = useState(false);
    const [bMostrarEditar, setbMostrarEditar] = useState(false);
    const [citaDetalle, setCitaDetalle] = useState([]);
    const [citaAddress, setCitaAddress] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [selectedTime, setselectedTime] = useState('');
    const [selectedIndex, setselectedIndex] = useState();
    const [_excludeDates, setExcludeDates] = useState([]);
    const [citas, setCitas] = useState([]);
    const [citaDate, setcitaDate] = useState([]);
    const [bAcceder, setbAcceder] = useState(true);
    var _today = new Date();
    const [initialDate, setinitialDate] = useState(new Date(_today));
    const lastDate = new Date(_today.setDate(_today.getDate() + 31));
    const [flagAnonPhone, setFlagAnonPhone] = useState('');


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
        setcitaDate(tempcita);
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

    const getDaysInactive = async () => {
        setLoading(true);
        //Solicitar por GET
        try {

            const response = await fetch(`${urlApi}appoinBussDateDays?bussiness_id=${cita.BUSSINESS_ID}`);
            if (!response.ok) {
                console.log(`Error getting appoinBussDateDays.`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const json = await response.json();
            setExcludeDates(selectableDayPredicate(json['data']));

            //Solicitar por GET
            try {
                const response = await fetch(`${urlApi}appoinBussDate?bussiness_id=${cita.BUSSINESS_ID}`);
                if (!response.ok) {
                    console.log(`Error getting appoinBussDate.`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const json = await response.json();
                setCitas(json['data']);
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
        if (flag === 0) {
            return dateSpanish(formattedDate);
        }
        else {
            return `${timeString}`;
        }

    }

    const _buildConfirm = async () => {
        if (bAcceder) {
            setbAcceder(false);
            setIsOpenU(false);

            var dateFormat = startDate.getMonth() + 1;
            var _selectedDate = `${startDate.getFullYear()}-${('0' + dateFormat).slice(-2)}-${startDate.getDate()}`;
            var anonimo = cita.ANONIMO.length === 0 ? '' : cita.ANONIMO;

            //Enviar por PUT
            var options = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    {
                        'apoinment_id': cita.APOINMENT_ID,
                        'user_id': cita.USER_ID,
                        'bussiness_id': cita.BUSSINESS_ID,
                        'usernotification_id': cita.USER_ID,
                        'appointment_date': _selectedDate,
                        'appointment_time': selectedTime,
                        'anonimo': anonimo,
                        'message': message,
                        'estatus': '1',
                        'dorsl': cita.DORSL
                    })
            }
            try {
                const response = await fetch(`${urlApi}appoin`, options);
                const json = await response.json();
                if (json['sucess'] == false) {
                    setbAcceder(true);
                    getDaysInactive();
                    alert(`Ya no se encuentra disponible Fecha : ${_selectedDate} Hora : ${selectedTime} Corríjalo e inténtelo nuevamente.`);
                    // console.log(`Error al guardar cita.`);
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

    };

    const _buildCancelar = async () => {
        //Enviar por DELETE
        var options = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        }
        try {
            const response = await fetch(`${urlApi}appoin?apoinment_id=${cita.APOINMENT_ID}&usernotification_id=${cita.USER_ID}&dorsl=${cita.DORSL}&for_who=Usr`, options);
            const json = await response.json();
            if (json['sucess'] == false) {
                setIsOpen(false);
                console.log(`Error al cancelar cita.`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            else {
                navigate("/");
            }
        }
        catch (e) {
            setIsOpen(false);
            return;
        }
    };

    const handleChangeMessage = evt => {
        const value = evt.target.value;
        setMessage(value);
    };

    const ModPopupMenu = () => {
        setPopupMenuButton(!bPopupMenuButton);
    };

    const ModMostrarEditar = () => {
        setbMostrarEditar(!bMostrarEditar);
    };


    useEffect(() => {
        const fData = async () => {
            //Solicitar por GET
            try {
                const response = await fetch(`${urlApi}getAppoin?apoinment_id=${citaId}`);
                if (!response.ok) {
                    console.log(`Error getting getAppoin.`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const json = await response.json();
                const FLAG_ADDRESS = json['data']['FLAG_ADDRESS'];
                setCita(json['data']);
                var temp = json['data']['ANONIMO'].substring(json['data']['ANONIMO'].indexOf(",") + 1, json['data']['ANONIMO'].length) ?? '';
                const cleanNumber = temp.replace(/\D/g, '');
                if (!isNaN(cleanNumber)) {
                    setFlagAnonPhone(cleanNumber);
                }

                //Solicitar por GET
                try {
                    const response = await fetch(`${urlApi}getAppoinDetail?apoinment_id=${citaId}`);
                    if (response.status == 404) {
                        setCitaDetalle([]);
                    } else if (response.status == 200) {
                        const json = await response.json();
                        setCitaDetalle(json['data']);
                        if (FLAG_ADDRESS == '1') {
                            //Solicitar por GET
                            try {
                                const response = await fetch(`${urlApi}getAppoinAddress?apoinment_id=${citaId}`);
                                if (!response.ok) {
                                    console.log(`Error getting getAppoinAddress.`);
                                    throw new Error(`HTTP error! status: ${response.status}`);
                                }
                                const json = await response.json();
                                setCitaAddress(json['data']);
                                setLoading(false);
                            }
                            catch (e) {
                                return;
                            }
                        }
                        else {
                            setLoading(false);
                        }
                    } else {
                        console.log(`Error getting getAppoinDetail.`);
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
        };
        if (sCorreo === null && sPassword === null) {
            navigate("/");
        }
        fData();
    }, []);

    if (loading) {
        return <Loaging />;
    }

    const photoBase64 = arrayBufferToBase64(cita.USER_PHOTO == null ? cita.USER_PHOTO : cita.USER_PHOTO.data);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-600 to-gray-800 p-4">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-6 text-center mt-20">
                <div className="flex flex-col items-center">
                    {photoBase64 ? (
                        <img className="w-36 h-36 rounded-full object-cover border mt-4" src={`data:image/jpeg;base64,${photoBase64}`} alt="business" />
                    ) : (
                        <img className="w-36 h-36 rounded-full object-cover border mt-4 bg-gray-200" src={User} alt="default" />
                    )}
                    <h3 className="text-2xl font-bold mt-4 text-black">{cita.ANONIMO == '' ? cita.USER_NAME : cita.ANONIMO.substring(0, cita.ANONIMO.indexOf(","))}</h3>
                    <h4 className='text-black mb-1'>{cita.ANONIMO == '' ? '' : cita.ANONIMO.substring(cita.ANONIMO.indexOf(",") + 1, cita.ANONIMO.length)}</h4>
                    <p className='w-full text-gray-400 mb-4'>{ConvertDateTime(cita.APPOINTMENT_DATE, cita.APPOINTMENT_TIME, 1)} -
                        {ConvertDateTime(cita.APPOINTMENT_DATE, cita.APPOINTMENT_TIME, 0)}</p>
                    {flagAnonPhone != '' ?
                        <div className="w-full flex items-center gap-3 px-4 mt-2">
                            <PhoneIcon className="w-6 h-6 text-orange-500" />
                            <div className="text-left" style={{
                                cursor: 'pointer'
                            }} onClick={() => {
                                const cleanNumber = cita.ANONIMO.substring(cita.ANONIMO.indexOf(",") + 1, cita.ANONIMO.length).replace(/\D/g, '');
                                if (navigator.platform.indexOf('iPhone') !== -1 || navigator.platform.indexOf('iPad') !== -1 || navigator.platform.indexOf('iPod') !== -1) {
                                    window.open(`https://api.whatsapp.com/send/?phone=${cleanNumber}&text=Hola, ¿Tengo una duda sobre mi cita?&type=phone_number&app_absent=0`);
                                } else {
                                    window.open(`https://api.whatsapp.com/send/?phone=${cleanNumber}&text=Hola, ¿Tengo una duda sobre mi cita?&type=phone_number&app_absent=0`);
                                }
                            }}>
                                <p className='text-gray-500'>{cita.ANONIMO.substring(cita.ANONIMO.indexOf(",") + 1, cita.ANONIMO.length)}</p>
                            </div>
                        </div> : cita.ANONIMO == '' ?
                            (cita.USER_PHONE == '' ?
                                <div className="w-full flex items-center gap-3 px-4 mt-2">
                                    <EnvelopeIcon className="w-6 h-6 text-orange-500" />
                                    <div className="text-left" style={{
                                        cursor: 'pointer'
                                    }} onClick={() => {
                                        if (navigator.platform.indexOf('iPhone') !== -1 || navigator.platform.indexOf('iPad') !== -1 || navigator.platform.indexOf('iPod') !== -1) {
                                            location.href = `mailto:${cita.USER_EMAIL}&subject=Tu cita en ${cita.DORSL}`;
                                        } else {
                                            window.open(`mailto:${cita.USER_EMAIL}&subject=Tu cita en ${cita.DORSL}`);
                                        }
                                    }}>
                                        <p className='text-gray-500'>{cita.USER_EMAIL}</p>
                                    </div>
                                </div> : <div className="w-full flex items-center gap-3 px-4 mt-2">
                                    <PhoneIcon className="w-6 h-6 text-orange-500" />
                                    <div className="text-left" style={{
                                        cursor: 'pointer'
                                    }} onClick={() => {
                                        const cleanNumber = cita.USER_PHONE.replace(/\D/g, '');
                                        if (navigator.platform.indexOf('iPhone') !== -1 || navigator.platform.indexOf('iPad') !== -1 || navigator.platform.indexOf('iPod') !== -1) {
                                            window.open(`https://api.whatsapp.com/send/?phone=${cleanNumber}&text=Hola, ¿Tengo una duda sobre mi cita?&type=phone_number&app_absent=0`);
                                        } else {
                                            window.open(`https://api.whatsapp.com/send/?phone=${cleanNumber}&text=Hola, ¿Tengo una duda sobre mi cita?&type=phone_number&app_absent=0`);
                                        }
                                    }}>
                                        <p className='text-gray-500'>{cita.USER_PHONE}</p>
                                    </div>
                                </div>) : <div className="w-full flex items-center gap-3 px-4 mt-2">
                                <EnvelopeIcon className="w-6 h-6 text-orange-500" />
                                <div className="text-left" style={{
                                    cursor: 'pointer'
                                }} onClick={() => {
                                    if (navigator.platform.indexOf('iPhone') !== -1 || navigator.platform.indexOf('iPad') !== -1 || navigator.platform.indexOf('iPod') !== -1) {
                                        location.href = `mailto:${cita.ANONIMO.substring(cita.ANONIMO.indexOf(",") + 1, cita.ANONIMO.length)}&subject=Tu cita en ${cita.DORSL}`;
                                    } else {
                                        window.open(`mailto:${cita.ANONIMO.substring(cita.ANONIMO.indexOf(",") + 1, cita.ANONIMO.length)}&subject=Tu cita en ${cita.DORSL}`);
                                    }
                                }}>
                                    <p className='text-gray-500'>{cita.ANONIMO.substring(cita.ANONIMO.indexOf(",") + 1, cita.ANONIMO.length)}</p>
                                </div>
                            </div>}
                </div>
                <hr className="my-4" />
                <div className="text-left px-4">
                    <h4 className="text-lg font-semibold">Información de la cita</h4>
                    {
                        citaDetalle &&
                        citaDetalle.map((index) => (
                            <div className="w-full flex items-center gap-3 px-4 mt-2" >
                                <InformationCircleIcon className='w-6 h-6'
                                    color={index['STATUS_DETAIL'] == 'Cancelada' ? '#B71C1C' :
                                        index['STATUS_DETAIL'] == 'Actual' ? '#448AFF' :
                                            index['STATUS_DETAIL'] == 'Finalizada' || index['STATUS_DETAIL'] == 'Finalizada por baja' ? '#9E9E9E' : '#FF9800'
                                    } />
                                <p className='text-gray-400'>{index['STATUS_DETAIL']}</p>
                            </div>
                        )
                        )
                    }
                </div>
                {cita.FLAG_ADDRESS != '0' ? <hr className="my-4" /> : <></>}
                {cita.FLAG_ADDRESS != '0' ?
                    <div className="text-left px-4">
                        <h4 className="text-lg font-semibold">Visita a domicilio</h4>
                        <div className="w-full flex items-center gap-3 px-4 mt-2">
                            <MapPinIcon className="w-6 h-6 text-orange-500" />
                            <div className="text-left" style={{
                                cursor: 'pointer'
                            }} onClick={() => {
                                if (navigator.platform.indexOf('iPhone') !== -1 || navigator.platform.indexOf('iPad') !== -1 || navigator.platform.indexOf('iPod') !== -1) {
                                    window.open(`maps://maps.google.com/?q=${citaAddress.ADDRESS_FIRST} ${citaAddress.ADDRESS_SECOND} CP ${citaAddress.POSTAL_CODE} ${citaAddress.CITY}, ${citaAddress.STATE} Mexico`);
                                } else {
                                    window.open(`https://maps.google.com?q=${citaAddress.ADDRESS_FIRST} ${citaAddress.ADDRESS_SECOND} CP ${citaAddress.POSTAL_CODE} ${citaAddress.CITY}, ${citaAddress.STATE} Mexico`);
                                }
                            }}>
                                <p className='text-gray-500'>{citaAddress.ADDRESS_FIRST}, {citaAddress.ADDRESS_SECOND}, {citaAddress.POSTAL_CODE} {citaAddress.CITY}, {citaAddress.STATE}, Mexico</p>
                            </div>
                        </div>
                    </div> : <></>}
                <hr className="my-4" />
                <div className="text-left px-4">
                    <h4 className="text-lg font-semibold">Motivo de la visita/Servicio</h4>
                    <div className="w-full flex items-center gap-3 px-4 mt-2">
                        <></>
                        <div className="text-left">
                            <p className='text-gray-500'>{cita.MENSSAGE == '' ? 'Aún no ha agregado motivo de la visita/Servicio' : cita.MENSSAGE}</p>
                        </div>

                    </div>
                </div>
                {bMostrarEditar ?
                    <>
                        <hr className="my-4" />
                        <div className="text-left px-4">
                            <h4 className="text-lg font-semibold">Reagendar</h4>
                        </div>
                        <div className='flex justify-start items-center ms-4'>
                            <CalendarDateRangeIcon className='w-8 h-8 md:w-10 md:h-10 lg:w-10 lg:h-10 mx-4 text-orange-500' />
                            <div>
                                <DatePicker className='text-gray-400 text-left'
                                    dateFormat="dd/MM/yyyy"
                                    excludeDates={_excludeDates}
                                    selected={startDate}
                                    onChange={(date) => { setStartDate(date); SelectDateTime(date); setselectedTime(''); setselectedIndex(); }}
                                    minDate={initialDate}
                                    maxDate={lastDate}
                                    customInput={<ExampleCustomInput className="example-custom-input" />}
                                />
                            </div>
                        </div>
                        {/* Horarios */}
                        <div className="grid grid-cols-4 gap-3 p-6">
                            {citaDate[0] && citaDate[0].map(({ APPOINTMENT_TIME, STATUS }, idx) => {
                                const disabled = STATUS !== 'free';
                                const selected = idx === selectedIndex;
                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        disabled={disabled}
                                        onClick={() => {
                                            if (!disabled) {
                                                setselectedTime(APPOINTMENT_TIME);
                                                setselectedIndex(idx);
                                            }
                                        }}
                                        className={`py-3 px-2 rounded-md shadow-sm text-sm ${selected ? 'bg-white text-orange-500 border' : disabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-100'}`}
                                    >
                                        {APPOINTMENT_TIME}
                                    </button>
                                );
                            })}
                        </div>
                        <hr className="my-4" />
                        <div className="mt-6 px-4 mb-6">
                            {bAcceder ? (
                                <button
                                    onClick={() => {
                                    var parts = cita.APPOINTMENT_DATE.split('-');
                                    var partsTime = cita.APPOINTMENT_TIME.split(':');
                                    var formattedDate = new Date(parts[0], parts[1] - 1, parts[2], partsTime[0], partsTime[1], partsTime[2]);
                                    if (startDate === '') {
                                        toast.error('Selecciona una fecha.');
                                    }
                                    else if (selectedTime === '') {
                                        toast.error('Selecciona una hora.');
                                    }
                                    else if (selectedTime == cita.APPOINTMENT_TIME.substring(0, 5) && startDate != formattedDate) {
                                        setIsOpenU(true);
                                    }
                                    else if (selectedTime != cita.APPOINTMENT_TIME.substring(0, 5)) {
                                        setIsOpenU(true);
                                    }
                                    else {
                                        toast.error(`Seleccionar una hora distinta a ${cita.APPOINTMENT_TIME}`);
                                    }
                                }}
                                    className="w-full py-3 rounded-md font-bold text-white bg-orange-500 hover:bg-orange-600"
                                >
                                    Guardar
                                </button>
                            ) : (
                                <button className="w-full py-3 rounded-md bg-gray-300">
                                    <span className="animate-pulse">Procesando...</span>
                                </button>
                            )}
                        </div>                       
                    </> : <></>}
                {/* Modal */}
                {isOpen ?
                    <>
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative animate-fade-in-up">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="absolute top-3 right-3 text-gray-500 hover:text-orange-500"
                                >
                                    <CloseIcon className="w-5 h-5 text-gray-900" />
                                </button>
                                <h4 className="text-xl font-bold text-center text-black mb-1">Confirmar</h4>
                                <p className="text-center text-yellow-500 mb-1">¿Seguro que quieres cancelar esta cita?</p>
                                <div className='flex justify-end mt-2'>
                                    <button className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mx-2' onClick={() => { setIsOpen(false); }}>Cancelar</button>
                                    <button className='bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600' onClick={() => {
                                        _buildCancelar();
                                    }}>Confirmar</button>
                                </div>
                            </div>
                        </div>
                    </> : isOpenU ? <>
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative animate-fade-in-up">
                                <button
                                    onClick={() => setIsOpenU(false)}
                                    className="absolute top-3 right-3 text-gray-500 hover:text-orange-500"
                                >
                                    <CloseIcon className="w-5 h-5 text-gray-900" />
                                </button>
                                <h4 className="text-xl font-bold text-center text-black mb-1">Confirmar</h4>
                                <p className="text-center text-yellow-500 mb-1">¿Deseas guardar tu cita?</p>
                                <p className="text-center text-gray-500 mb-4">Motivo de la visita/Servicio</p>
                                <hr className="mb-4" />
                                <textarea type="text" className='w-full text-black border px-4 py-2 rounded-md' placeholder='Opcional' rows="4" cols="50" onChange={handleChangeMessage}></textarea>
                                <div className='flex justify-end mt-2'>
                                    <button className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mx-2' onClick={() => { getDaysInactive(); setIsOpenU(false); }}>Cancelar</button>
                                    <button className='bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600' onClick={() => {
                                        _buildConfirm();
                                    }}>Confirmar</button>
                                </div>
                            </div>
                        </div>
                    </> : <></>
                }
            </div>

            {!bPopupMenuButton ? <></> : <div class="fab-container3">
                <div class="button iconbutton">
                    <button onClick={() => { setIsOpen(true); setPopupMenuButton(!bPopupMenuButton); }} class="fa-solid fa-plus">
                        <TrashIcon width={40} />
                    </button>
                    <label class="text-white px-1 font-bold">Cancelar</label>
                </div>
            </div>}

            {!bPopupMenuButton ? <></> : <div class="fab-container2">
                <div class="button iconbutton">
                    <button
                        onClick={() => {
                            if (bMostrarEditar) {
                                ModMostrarEditar();
                                setPopupMenuButton(!bPopupMenuButton);
                            }
                            else {
                                var parts = cita.APPOINTMENT_DATE.split('-');
                                var partsTime = cita.APPOINTMENT_TIME.split(':');
                                var formattedDate = new Date(parts[0], parts[1] - 1, parts[2], partsTime[0], partsTime[1], partsTime[2]);

                                setinitialDate(formattedDate);
                                setselectedTime(cita.APPOINTMENT_TIME.substring(0, 5));
                                setMessage(cita.MENSSAGE);
                                getDaysInactive();
                                ModMostrarEditar();
                                setPopupMenuButton(!bPopupMenuButton);
                            }
                        }}
                        class="fa-solid fa-plus"
                    >
                        {bMostrarEditar ? <CloseIcon width={40} /> : <CalendarDateRangeIcon width={40} />}
                    </button>
                    <label class="text-white px-1 font-bold">Reagendar</label>
                </div>
            </div>}

            {cita.ESTATUS == '2' ? <></> : <div class="fab-container">
                <div class="button iconbutton">
                    <button
                        onClick={() => ModPopupMenu()}
                        class="fa-solid fa-plus"
                    >
                        <BarsArrowUpIcon width={40} />
                    </button>
                </div>
            </div>}

        </div>);
}

export default UpdateAppoinBusiness;