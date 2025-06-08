// rrd imports
import { useLoaderData, useNavigate } from 'react-router-dom';
import { dateSpanish, fetchData } from "../../Wrapper.js";
import { forwardRef, useEffect, useState } from "react";
// assets
import './Add_appoin.css';
import Loaging from '../../components/Loading.jsx';
import { urlApi } from "../../styles/Constants.jsx";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import User from "../../assets/e.png";
import { CalendarDateRangeIcon, EllipsisVerticalIcon, EnvelopeIcon, InformationCircleIcon, MapPinIcon } from '@heroicons/react/24/solid';

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
                {startDate ? <p>{dateSpanish(startDate)} ‒ {selectedTime ? selectedTime : 'Selecciona una hora'} </p> :
                    <p>Selecciona una fecha ‒ Selecciona una hora</p>
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
                    setIsOpenU(false);
                    setbAcceder(true);
                    getDaysInactive();                
                    alert(`Ya no se encuentra disponible Fecha : ${_selectedDate} Hora : ${selectedTime} Corríjalo e inténtelo nuevamente.`);
                    console.log(`Error al guardar cita.`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                else {
                    navigate("/");
                }
            }
            catch (e) {
                setIsOpenU(false);
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
            const response = await fetch(`${urlApi}appoin?apoinment_id=${cita.APOINMENT_ID}&usernotification_id=${cita.USER_ID}&dorsl=${cita.USER_NAME}&for_who=Usr`, options);
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
    return (
        <div className="AddAppoinContainer">
            {
                //Cambiar a ==
                cita.ESTATUS == '2' ?
                    <>
                        <div><h1 style={{ marginLeft: '20px', marginRight: '20px' }}>Resumen de la cita</h1></div>
                    </>
                    :
                    <div style={{ display: 'flex' }}>
                        <h1 style={{ marginLeft: '20px', marginRight: '20px' }}>Resumen de la cita</h1>
                        <div class="buttonTop iconbuttonTop">
                            <button
                                onClick={() => ModPopupMenu()}
                                class="fa-solid fa-plus"
                            >
                                <EllipsisVerticalIcon width={40} />
                            </button>
                        </div>
                        <div className={bPopupMenuButton ? 'popupMenuButton' : 'popupMenuButton active'}>
                            <button onClick={() => {
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
                            }}>
                                {bMostrarEditar ? 'Cancelar' : 'Reagendar'}
                            </button>
                            <button onClick={() => { setIsOpen(true); setPopupMenuButton(!bPopupMenuButton); }}>
                                Cancelar cita
                            </button>
                        </div>
                    </div>
            }


            <div className='businessTitleContainer'>
                <div className='businessTitleContainer--Name'>
                    <h4>{cita.ANONIMO == '' ? cita.USER_NAME : cita.ANONIMO.substring(0, cita.ANONIMO.indexOf(","))}</h4>
                    <h4>{cita.ANONIMO == '' ? '' : cita.ANONIMO.substring(cita.ANONIMO.indexOf(",") + 1, cita.ANONIMO.length)}</h4>
                    <p >{ConvertDateTime(cita.APPOINTMENT_DATE, cita.APPOINTMENT_TIME, 1)} -
                        {ConvertDateTime(cita.APPOINTMENT_DATE, cita.APPOINTMENT_TIME, 0)}</p>
                    {
                        cita.ANONIMO == '' ?
                            (
                                cita.USER_PHONE == '' ?
                                    <div className='businessSubTitleContainer'
                                        style={{
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => {
                                            if (navigator.platform.indexOf('iPhone') !== -1 || navigator.platform.indexOf('iPad') !== -1 || navigator.platform.indexOf('iPod') !== -1) {
                                                location.href = `mailto:${cita.USER_EMAIL}&subject=Tu cita en ${cita.DORSL}`;
                                            } else {
                                                window.open(`mailto:${cita.USER_EMAIL}&subject=Tu cita en ${cita.DORSL}`);
                                            }
                                        }}
                                    >
                                        <div className='businessSubTitleIcon'>
                                            <EnvelopeIcon />
                                        </div>
                                        <p>{cita.USER_EMAIL}</p>
                                    </div>
                                    :
                                    <div className='businessSubTitleContainer'
                                        style={{
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => {
                                            const cleanNumber = cita.USER_PHONE.replace(/\D/g, '');
                                            if (navigator.platform.indexOf('iPhone') !== -1 || navigator.platform.indexOf('iPad') !== -1 || navigator.platform.indexOf('iPod') !== -1) {
                                                window.open(`https://api.whatsapp.com/send/?phone=${cleanNumber}&text=Hola, ¿Tengo una duda sobre mi cita?&type=phone_number&app_absent=0`);
                                            } else {
                                                window.open(`https://api.whatsapp.com/send/?phone=${cleanNumber}&text=Hola, ¿Tengo una duda sobre mi cita?&type=phone_number&app_absent=0`);
                                            }
                                        }}
                                    >
                                        <div className='businessSubTitleIcon'>
                                            <EnvelopeIcon />
                                        </div>
                                        <p>{cita.USER_PHONE}</p>
                                    </div>
                            )
                            :
                            <div className='businessSubTitleContainer'
                                style={{
                                    cursor: 'pointer'
                                }}
                                onClick={() => {
                                    if (navigator.platform.indexOf('iPhone') !== -1 || navigator.platform.indexOf('iPad') !== -1 || navigator.platform.indexOf('iPod') !== -1) {
                                        location.href = `mailto:${cita.ANONIMO.substring(cita.ANONIMO.indexOf(",") + 1, cita.ANONIMO.length)}&subject=Tu cita en ${cita.DORSL}`;
                                    } else {
                                        window.open(`mailto:${cita.ANONIMO.substring(cita.ANONIMO.indexOf(",") + 1, cita.ANONIMO.length)}&subject=Tu cita en ${cita.DORSL}`);
                                    }
                                }}
                            >
                                <div className='businessSubTitleIcon'>
                                    <EnvelopeIcon />
                                </div>
                                <p>{cita.ANONIMO.substring(cita.ANONIMO.indexOf(",") + 1, cita.ANONIMO.length)}</p>
                            </div>
                    }

                </div>
                <div>
                    {
                        cita.USER_PHOTO === null ?
                            <img id='store' src={User} /> :
                            <img src={'data:image/jpeg;base64,' + arrayBufferToBase64(cita.USER_PHOTO.data)} />
                    }
                </div>

            </div>
            <div className='businessContainer_Divider'></div>
            <div className='businessTitle'>
                <h4>Información de la cita</h4>
                {
                    citaDetalle &&
                    citaDetalle.map((index) => (
                        <div className='businessSubTitleContainer'>
                            <div className='businessSubTitleIcon'>
                                <InformationCircleIcon color={index['STATUS_DETAIL'] == 'Cancelada' ? '#B71C1C' :
                                    index['STATUS_DETAIL'] == 'Actual' ? '#448AFF' :
                                        index['STATUS_DETAIL'] == 'Finalizada' || index['STATUS_DETAIL'] == 'Finalizada por baja' ? '#9E9E9E' : '#FF9800'
                                } />
                            </div>
                            <div style={{ display: 'flex' }}>
                                <p>{index['STATUS_DETAIL']}</p>
                                <p>{index['APPOINTMENT_DATE_DETAIL']}</p>
                            </div>

                        </div>
                    )
                    )
                }
            </div>
            {cita.FLAG_ADDRESS != '0' ?
                <>
                    <div className='businessContainer_Divider'></div>
                    <div className='businessTitle'>
                        <h4>Visita a domicilio</h4>
                        <div className='businessSubTitleContainer'
                            style={{
                                cursor: 'pointer'
                            }}
                            onClick={() => {
                                if (navigator.platform.indexOf('iPhone') !== -1 || navigator.platform.indexOf('iPad') !== -1 || navigator.platform.indexOf('iPod') !== -1) {
                                    window.open(`maps://maps.google.com/?q=${citaAddress.ADDRESS_FIRST} ${citaAddress.ADDRESS_SECOND} CP ${citaAddress.POSTAL_CODE} ${citaAddress.CITY}, ${citaAddress.STATE} Mexico`);
                                } else {
                                    window.open(`https://maps.google.com?q=${citaAddress.ADDRESS_FIRST} ${citaAddress.ADDRESS_SECOND} CP ${citaAddress.POSTAL_CODE} ${citaAddress.CITY}, ${citaAddress.STATE} Mexico`);
                                }
                            }}>
                            <div className='businessSubTitleIcon'>
                                <MapPinIcon />
                            </div>
                            <div >
                                <p >{citaAddress.ADDRESS_FIRST}, {citaAddress.ADDRESS_SECOND}, {citaAddress.POSTAL_CODE} {citaAddress.CITY}, {citaAddress.STATE}, Mexico</p>
                            </div>
                        </div>
                    </div>
                </>
                :
                <div></div>
            }
            <div className='businessContainer_Divider'></div>
            <div className='businessTitle'>
                <h4>Motivo de la visita/Servicio</h4>
                <div className='businessSubTitleContainer'>
                    <div className='businessSubTitleIcon'>
                    </div>
                    <p>{cita.MENSSAGE == '' ? 'Sin Motivo de la visita/Servicio' : cita.MENSSAGE}</p>
                </div>

            </div>
            {bMostrarEditar ?
                <>
                    <div className='businessContainer_Divider'></div>
                    <div className='businessTitle'>
                        <h4>Reagendar</h4>
                    </div>
                    <div className='businessSubTitle'>
                        <div className='businessSubTitleContainer'>
                            <div className='businessSubTitleIcon'>
                                <CalendarDateRangeIcon />
                            </div>
                            <div>
                                <DatePicker
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
                    </div>
                    <div className='businessAppointmentTimeContainer' >
                        {citaDate[0] &&
                            citaDate[0].map(({ APPOINTMENT_TIME, STATUS }, index) =>
                            (
                                <div className={STATUS === 'No' ? 'businessAppointmentTime active' : 'businessAppointmentTime'}
                                    key={index}
                                    style={{
                                        backgroundColor: index === selectedIndex ? 'white' : STATUS === 'No' ? 'grey' : '#e0e0e0',
                                        color: index === selectedIndex ? '#fc6500' : 'black'
                                    }}
                                    onClick={() => {
                                        if (STATUS === 'free') {
                                            setselectedTime(APPOINTMENT_TIME);
                                            setselectedIndex(index);
                                        }
                                    }}  >
                                    <label>{APPOINTMENT_TIME} </label>
                                </div>
                            ))
                        }
                    </div>
                    <div className='businessContainer_Divider'></div>

                    <div className='businessBtn'>
                        <button
                            onClick={() => {
                                var parts = cita.APPOINTMENT_DATE.split('-');
                                var partsTime = cita.APPOINTMENT_TIME.split(':');
                                var formattedDate = new Date(parts[0], parts[1] - 1, parts[2], partsTime[0], partsTime[1], partsTime[2]);
                                if (startDate === '') {
                                    alert(`Selecciona una fecha`);
                                }
                                else if (selectedTime === '') {
                                    alert(`Selecciona una hora`);
                                }
                                else if (selectedTime == cita.APPOINTMENT_TIME.substring(0, 5) && startDate != formattedDate) {
                                    setIsOpenU(true);
                                }
                                else if (selectedTime != cita.APPOINTMENT_TIME.substring(0, 5)) {
                                    setIsOpenU(true);
                                }
                                else {
                                    alert(`seleccionar una hora distinta a ${cita.APPOINTMENT_TIME}`);
                                }

                            }}>Guardar</button>
                    </div>
                </> : <div></div>}
            {
                isOpen ?
                    <>
                        <div className="backdropDialog" ></div>
                        <div className="dialogDialog">
                            <h2>Confirmar</h2>
                            <span>¿Seguro que quieres cancelar esta cita?</span>
                            <div className='buttonDialog'>
                                <button className='primaryBkg' onClick={() => { setIsOpen(false); }}>Cancelar</button>
                                <button className='secondBkg' onClick={() => { _buildCancelar(); }}>Confirmar</button>
                            </div>

                        </div>
                    </>
                    : isOpenU ?
                        <>
                            <div className="backdropDialog" ></div>
                            <div className="dialogDialog">
                                <h2>Confirmar</h2>
                                <span>¿Deseas guardar tu cita?</span>
                                <label>Motivo de la visita/Servicio</label>
                                <textarea type="text" placeholder='Opcional' rows="4" cols="50" onChange={handleChangeMessage} value={message}></textarea>
                                <div className='buttonDialog'>
                                    <button className='primaryBkg' onClick={() => { getDaysInactive(); setIsOpenU(false); }}>Cancelar</button>
                                    <button className='secondBkg' onClick={() => {
                                        _buildConfirm();
                                    }}>Confirmar</button>
                                </div>

                            </div>
                        </>
                        : null
            }

        </div>);
}

export default UpdateAppoinBusiness;