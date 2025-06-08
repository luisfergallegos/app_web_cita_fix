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
import { CalendarDateRangeIcon } from '@heroicons/react/24/solid';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

// loader
export function AddAppoinBusinesssLoader() {
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


export function AddAppoinBusinesss() {
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

    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    const { USER_ID, first_name, last_name,
        PHOTO } = location.state.userCita;
    const businessId = location.state.businessId;
    const dorsl = location.state.dorsl;
    var _today = new Date();
    const initialDate = new Date(_today);
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
        setcita(tempcita);
    }

    const _buildConfirm = async () => {
        if (selectedTime !== '') {
            if (bAcceder) {
                setbAcceder(false);
                var dateFormat = startDate.getMonth() + 1;
                var _selectedDate = `${startDate.getFullYear()}-${('0' + dateFormat).slice(-2)}-${startDate.getDate()}`;
                //Enviar por POST
                var options = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(
                        {
                            'user_id': USER_ID,
                            'bussiness_id': businessId,
                            'usernotification_id': USER_ID,
                            'appointment_date': _selectedDate,
                            'appointment_time': selectedTime,
                            'anonimo': '',
                            'message': message,
                            'estatus': '0',
                            'dorsl': dorsl,
                            'for_who': 'Usr'
                        })
                }
                try {
                    const response = await fetch(`${urlApi}appoin`, options);
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
            <div className='businessTitleContainer'>
                <div className='businessTitleContainer--Name'>
                    <h4>{first_name} {last_name}</h4>
                    <p >Este usuario recibirá un recordatorio de su vista.</p>
                </div>
                <div >
                    {
                        PHOTO === null ? <img id='store' src={Store} /> :
                            <img src={'data:image/jpeg;base64,' + arrayBufferToBase64(PHOTO.data)} />
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

export default AddAppoinBusinesss;