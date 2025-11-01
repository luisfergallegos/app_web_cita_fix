// rrd imports
import { useLoaderData, useNavigate } from 'react-router-dom';
import { fetchData, dateSpanish } from "../../Wrapper.js";
import { forwardRef, useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
// assets
import './Add_appoin.css';
import '../../components/Loading.css';
import Loaging from '../../components/Loading.jsx';
import { urlApi } from "../../styles/Constants.jsx";
// Library
import { CalendarDateRangeIcon, UserCircleIcon, XMarkIcon as CloseIcon } from '@heroicons/react/24/solid';
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
        if (selectedTime !== '') {
            if (bAcceder) {
                setbAcceder(false);
                setIsOpen(false);

                var anonimo = bSwitchPhoneEmail ? `${nombre},+52 ${phone}` : `${nombre},${correo}`;
                var dateFormat = startDate.getMonth() + 1;
                var _selectedDate = `${startDate.getFullYear()}-${('0' + dateFormat).slice(-2)}-${startDate.getDate()}`;
                //Enviar por POST
                var options = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(
                        {
                            'user_id': '0',
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
                        setbAcceder(true);
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
        <div className="min-h-screen grid items-center justify-center bg-gradient-to-br from-gray-600 to-gray-800 px-4">
            <div className="relative bg-white rounded-3xl shadow-xl mt-20 mb-10 text-center animate-fade-in-up w-full max-w-md">
                {showAlert && (
                    <div className="absolute top-8 justify-center bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg text-sm animate-bounce z-50">
                        {errorMsg}
                    </div>
                )}
                <div className="flex justify-center mb-4">
                    <UserCircleIcon className="w-40 h-40 object-cover rounded-full border mt-8 bg-orange-600" width={200}
                        color={'#fff'
                        } />
                </div>
                <div>
                    <h4 className='text-2xl font-bold text-black mb-1'>Usuario no registrado.</h4>
                    <p className='ml-10 mr-10 text-gray-400 mb-4'>{dorsl}</p>
                </div>
                <hr className="mb-4 mt-4" />
                <div className='businessTitle'>
                    <h4>Información de contacto</h4>
                    <div className='block ms-4 mt-4 mr-5'>
                        <div>
                            <input
                                type="text"
                                placeholder="Ingresa el nombre"
                                className="w-full  px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                onChange={handleChangeName} required
                            />
                        </div>
                        <div className='flex items-center mt-4 mb-4'>
                            <h4>¿Deseas que sea por número de teléfono?</h4>
                            <label className="switch">
                                <input type="checkbox" onClick={ModSwitchPhoneEmail} />
                                <span class="slider round"></span>
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
                </div>
                <hr className="mb-4 mt-4" />
                <div className='businessTitle'>
                    <h4>Agendar</h4>
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
                <div className='grid grid-cols-4 gap-5 p-10' >
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

                {bAcceder ? <div className='businessBtn'>
                    <button className='mb-10' onClick={() => {
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
                    }}>Guardar</button>
                </div> : <div className='businessBtn'>
                    <button className='mb-10'><div className='circle' ></div></button>
                </div>}

                {/* Modal */}
                {isOpen && (
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
                                <p className="text-center text-yellow-500 mb-1">¿Deseas guardar tu cita?</p>
                                <p className="text-center text-gray-500 mb-4">Motivo de la visita/Servicio</p>
                                <hr className="mb-4" />
                                <textarea type="text" className='w-full text-black border px-4 py-2 rounded-md' placeholder='Opcional' rows="4" cols="50" onChange={handleChangeMessage}></textarea>
                                <div className='flex justify-end mt-2'>
                                    <button className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mx-2' onClick={() => { setIsOpen(false); setMessage(''); }}>Cancelar</button>
                                    <button className='bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600' onClick={() => {
                                        _buildConfirm();
                                    }}>Confirmar</button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default AddAppoinBusinesssAnon;