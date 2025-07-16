// rrd imports
import { useLoaderData, useNavigate } from 'react-router-dom';
import { fetchData, dateSpanish } from "../../Wrapper.js";
import { forwardRef, useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
// assets
import './Add_appoin.css';
import Store from "../../assets/business.png";
import Loaging from '../../components/Loading.jsx';
import { urlApi } from "../../styles/Constants.jsx";
// Library
import { CalendarDateRangeIcon, UserCircleIcon } from '@heroicons/react/24/solid';
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
    const [message, setMessage] = useState('');
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [phone, setPhone] = useState('');
    const [errorCorreo, setErrorCorreo] = useState('');
    const [errorPhone, setErrorPhone] = useState('');

    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    const userId = location.state.userId;
    const businessId = location.state.businessId;
    const dorsl = location.state.dorsl;
    var _today = new Date();
    const initialDate = new Date(_today);
    const lastDate = new Date(_today.setDate(_today.getDate() + 31));
    const [bSwitchPhoneEmail, setbSwitchPhoneEmail] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

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
        setcita(tempcita);
    }

    const ModSwitchPhoneEmail = () => {
        setbSwitchPhoneEmail(!bSwitchPhoneEmail);
    };

    const _buildConfirm = async () => {
        if (selectedTime !== '') {
            if (bAcceder) {
                setbAcceder(false);
                var anonimo = bSwitchPhoneEmail ? `${nombre},+52 ${phone}` : `${nombre},${correo}`;
                var dateFormat = startDate.getMonth() + 1;
                var _selectedDate = `${startDate.getFullYear()}-${('0' + dateFormat).slice(-2)}-${startDate.getDate()}`;
                //Enviar por POST
                var options = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(
                        {
                            'user_id': userId,
                            'bussiness_id': businessId,
                            'usernotification_id': '0',
                            'appointment_date': _selectedDate,
                            'appointment_time': selectedTime,
                            'anonimo': anonimo,
                            'message': message,
                            'estatus': '0',
                            'dorsl': dorsl,
                            'for_who': 'Bus'
                        })
                }
                try {
                    var url = bSwitchPhoneEmail ? `${urlApi}appoinW` : `${urlApi}appoin`;
                    const response = await fetch(url, options);
                    const json = await response.json();
                    if (json['sucess'] == false) {
                        setIsOpen(false);
                        alert(`Ya no se encuentra disponible Fecha : ${_selectedDate} Hora : ${selectedTime} Corríjalo e inténtelo nuevamente.`);
                        console.log(`Error al guardar cita.`);
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
                setbAcceder(true);

            }
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

    useEffect(() => {
        const fData = async () => {
            //Solicitar por GET
            try {
                const response = await fetch(`${urlApi}appoinBussDateDays?bussiness_id=${businessId}`);
                if (!response.ok) {
                    console.log(`Error getting getDaysInactive.`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const json = await response.json();
                setExcludeDates(selectableDayPredicate(json['data']));

                //Solicitar por GET
                try {
                    const response = await fetch(`${urlApi}appoinBussDate?bussiness_id=${businessId}`);
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
            {/* Alerta centrada */}
            {showAlert && (
                <div className="absolute top-6 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg text-sm animate-bounce z-50">
                    {errorMsg}
                </div>
            )}
            <div className='businessTitleContainer'>
                <div className='businessTitleContainer--Name'>
                    <h4>Usuario no registrado.</h4>
                    <p >{dorsl}</p>
                </div>
                <div >
                    <UserCircleIcon width={200}
                        color={'#fc6500'
                        } />
                </div>
            </div>
            <div className='businessContainer_Divider'></div>
            <div className='businessTitle'>
                <h4>Información de contacto</h4>
                <div className='businessContainer_Address'>
                    <div className='AddressForm-group'>
                        <input type="text" placeholder='Ingresa el nombre' onChange={handleChangeName} required />
                    </div>
                    <div className='AddressForm-group'>
                        <div style={{ display: 'flex', justifyItems: 'center', alignItems: 'center', marginRight: '20px' }}>
                            <h4 style={{ marginRight: '20px' }}>¿Deseas que sea por número de teléfono?</h4>
                            <label className="switch">
                                <input type="checkbox" onClick={ModSwitchPhoneEmail} />
                                <span class="slider round"></span>
                            </label>
                        </div>
                    </div>


                    {bSwitchPhoneEmail ?
                        <div className='AddressForm-group'>
                            <h4 style={{ marginRight: '20px' }}>{bSwitchPhoneEmail ? '¿Cuál es el número de teléfono?' : '¿Cuál es el correo electrónico?'}</h4>
                            <input type="tel" placeholder="Número de teléfono" value={phone} onChange={handleChangePhone} required />
                            {errorPhone != '' ? <label htmlFor="" style={{ color: 'red' }}>{errorPhone}</label> : <></>}
                            <span>En este número de teléfono recibirá un recordatorio de su vista.</span>
                        </div> :
                        <></>
                    }

                    {!bSwitchPhoneEmail ?
                        <div className='AddressForm-group'>
                            <h4 style={{ marginRight: '20px' }}>{bSwitchPhoneEmail ? '¿Cuál es el número de teléfono?' : '¿Cuál es el correo electrónico?'}</h4>
                            <input type="email" placeholder='Correo electrónico' value={correo} onChange={handleChangeEmail} required />
                            {errorCorreo != '' ? <label htmlFor="" style={{ color: 'red' }}>{errorCorreo}</label> : <></>}
                            <span>En este correo electrónico recibirá un recordatorio de su vista.</span>
                        </div>
                        :
                        <></>
                    }


                </div>


            </div>
            <div className='businessContainer_Divider'></div>
            <div className='businessTitle'>
                <h4>Agendar</h4>
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
                {cita[0] &&
                    cita[0].map(({ APPOINTMENT_TIME, STATUS }, index) =>
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

            <div className='businessBtn'><button onClick={() => {
                if (selectedTime !== '') {
                    if (bSwitchPhoneEmail) {
                        if (!nombre || !phone) {
                            setErrorMsg('Completa todos los campos.');
                            setShowAlert(true);
                            setTimeout(() => setShowAlert(false), 3000); // ocultar alerta
                            return;
                        }
                    } else {
                        if (!nombre || !correo) {
                            setErrorMsg('Completa todos los campos.');
                            setShowAlert(true);
                            setTimeout(() => setShowAlert(false), 3000); // ocultar alerta
                            return;
                        }
                    }
                    setIsOpen(true);
                }
            }}>Guardar</button></div>
            {
                isOpen ?
                    <>
                        <div className="backdropDialog" ></div>
                        <div className="dialogDialog">
                            <h2>Confirmar</h2>
                            <span>¿Deseas guardar tu cita?</span>
                            <label>Motivo de la visita/Servicio</label>
                            <textarea type="text" placeholder='Opcional' rows="4" cols="50" onChange={handleChangeMessage}></textarea>
                            <div className='buttonDialog'>
                                <button className='primaryBkg' onClick={() => { setIsOpen(false); setMessage(''); }}>Cancelar</button>
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

export default AddAppoinBusinesssAnon;