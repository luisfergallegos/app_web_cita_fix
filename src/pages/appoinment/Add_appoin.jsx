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
import { MapPinIcon, PhoneIcon, CalendarDaysIcon, CalendarDateRangeIcon } from '@heroicons/react/24/solid';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
//import moment from 'moment';

// loader
export function AddAppoinLoader() {
    const sCorreo = fetchData("correo");
    const sPassword = fetchData("pwd");
    return { sCorreo, sPassword };
}

/* function defineInitialDate() {
    var tempdias = [];
    var _today = new Date();
    var Aux = new Date(_today.getFullYear(), _today.getMonth(), _today.getDate());
    //console.log(`Aux : ${Aux}`);
    tempdias.push(Aux);

    var lasttoday = new Date(_today.getFullYear(), _today.getMonth() + 2, 0);
    var AñoAux = parseInt(lasttoday.getFullYear());
    var MesAux = parseInt(lasttoday.getMonth());
    var diaAux = parseInt(lasttoday.getDate());
    var Aux = new Date(AñoAux, MesAux, diaAux);

    //console.log(`Aux : ${Aux}`);
    tempdias.push(Aux);

    return tempdias;
} */

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
    /* var _tempdias = [];
    var _initialDate = _dias[0];
    var _lastDate = _dias[_dias.length - 1];
    var formattedDate = _initialDate;
    while (formattedDate <= _lastDate) {       
        var bformattedDate = bBuscar(formattedDate, _dias);       
        if (bformattedDate === true) {
            _tempdias.push(new Date(formattedDate.getFullYear(), formattedDate.getMonth(), formattedDate.getDate()));
        }
        // Increment the date
        var newDate = formattedDate.setDate(formattedDate.getDate() + 1);
        formattedDate = new Date(newDate);
    }

    return _tempdias; */
}

/* function bBuscar(sDay, _dias) {
    var bAux = true;
    for (let index = 0; index < _dias.length; index++) {
        var element = _dias[index];
        if (element.toLocaleDateString() === sDay.toLocaleDateString()) {
            bAux = false;
            break;
        }
    }
    return bAux;
} */

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
    const [bAcceder, setbAcceder] = useState(true);
    const [direccionUno, setDireccionUno] = useState('');
    const [direccionDos, setDireccionDos] = useState('');
    const [codigoPostal, setCodigoPostal] = useState('');
    const [message, setMessage] = useState('');

    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    const { BUSSINESS_ID, USER_ID, DORSL, PHOTO, CATEGORY, SERVICE_LEVEL,
        ADDRESS_FIRST, ADDRESS_SECOND, POSTAL_CODE, CITY, STATE,
        phone, Horario } = location.state.business;
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

    const ModMostrarAddres = () => {
        setbMostrarAddress(!bMostrarAddress);
    };

    const _buildConfirm = async () => {
        if (selectedTime !== '') {
            if (bAcceder) {
                setbAcceder(false);
                if (bMostrarAddress) {
                    var dateFormat = startDate.getMonth() + 1;
                    var _selectedDate = `${startDate.getFullYear()}-${('0' + dateFormat).slice(-2)}-${startDate.getDate()}`;
                    setbAcceder(true);
                    //Enviar por POST
                    var options = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(
                            {
                                'user_id': location.state.userId,
                                'bussiness_id': BUSSINESS_ID,
                                'usernotification_id': USER_ID,
                                'appointment_date': _selectedDate,
                                'appointment_time': selectedTime,
                                'anonimo': '',
                                'message': message,
                                'estatus': '0',
                                'dorsl': location.state.userName,
                                'for_who': 'Bus',
                                "address_first": direccionUno,
                                "address_second": direccionDos,
                                "postal_code": codigoPostal,
                                "city": ciudad,
                                "state": estado
                            })
                    }
                    try {
                        const response = await fetch(`${urlApi}appoinAddress`, options);
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
                }
                else {
                    var dateFormat = startDate.getMonth() + 1;
                    var _selectedDate = `${startDate.getFullYear()}-${('0' + dateFormat).slice(-2)}-${startDate.getDate()}`;
                    setbAcceder(true);
                    //Enviar por POST
                    var options = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(
                            {
                                'user_id': location.state.userId,
                                'bussiness_id': BUSSINESS_ID,
                                'usernotification_id': USER_ID,
                                'appointment_date': _selectedDate,
                                'appointment_time': selectedTime,
                                'anonimo': '',
                                'message': message,
                                'estatus': '0',
                                'dorsl': location.state.userName,
                                'for_who': 'Bus'
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
                }
            }
        }



    };

    const getCodigoPostal = async (evt) => {
        const value = evt.target.value;
        var tempcita = [];
        if (evt.target.value.length === 5) {
            setCodigoPostal(value);
            //Solicitar por GET
            try {
                const response = await fetch(`${urlApi}postalCode?d_codigo=${value}`);
                if (!response.ok) {
                    console.log(`Error getting getDaysInactive.`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const json = await response.json();
                console.log(json['data']);
                setEstado(json['data'][0].d_estado);
                setCiudad(json['data'][0].d_ciudad);
                var tempcita = [];
                for (let index = 0; index < json['data'][0].d_asentas.length; index++) {
                    var element = json['data'][0].d_asentas[index];
                    tempcita.push(element.d_asenta);
                }
                setColonias(tempcita);
            }
            catch (e) {
                return;
            }
            /* const json = fetchData("postalCode") ?? [];
            setEstado(json['data'][0].d_estado);
            setCiudad(json['data'][0].d_ciudad);
            var tempcita = [];
            for (let index = 0; index < json['data'][0].d_asentas.length; index++) {
                var element = json['data'][0].d_asentas[index];
                tempcita.push(element.d_asenta);
            }
            setColonias(tempcita); */
        }
        else {
            setColonias(tempcita);
            setEstado('');
            setCiudad('');
        }
    };

    const handleChange = evt => {
        const value = evt.target.value;
        setDireccionUno(value);
    };

    const handleChangeColonia = evt => {
        const value = evt.target.value;
        setDireccionDos(value);
    };

    const handleChangeMessage = evt => {
        const value = evt.target.value;
        setMessage(value);
    };



    useEffect(() => {
        const fData = async () => {
            //Solicitar por GET
            try {
                const response = await fetch(`${urlApi}appoinBussDateDays?bussiness_id=${BUSSINESS_ID}`);
                if (!response.ok) {
                    console.log(`Error getting getDaysInactive.`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const json = await response.json();
                setExcludeDates(selectableDayPredicate(json['data']));

                //Solicitar por GET
                try {
                    const response = await fetch(`${urlApi}appoinBussDate?bussiness_id=${BUSSINESS_ID}`);
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


    /* moment.defineLocale('es', {
        months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
        monthsShort: 'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
        weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
        weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
        weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_')
  }); 
    let _selectedDate = moment(new Date()).format('dddd, d MMMM y'); */




    if (loading) {
        return <Loaging />;
    }

    return (
        <div className="min-h-screen grid items-center justify-center bg-gradient-to-br from-orange-600 to-orange-800 px-4">
        <div className="bg-white rounded-3xl shadow-xl mt-10 mb-10 animate-fade-in-up">
            <div className='businessTitleContainer'>
                <div className='businessTitleContainer--Name'>
                    <h4>{DORSL}</h4>
                    <p >{CATEGORY}</p>
                </div>
                <div >
                    {
                        PHOTO === null ? <img id='store' src={Store} /> :
                            <img src={'data:image/jpeg;base64,' + arrayBufferToBase64(PHOTO.data)} />
                    }
                </div>
            </div>

            <div className='businessSubTitle'>
                <div className='businessSubTitleContainer'>
                    <div className='businessSubTitleIcon'>
                        <MapPinIcon />
                    </div>
                    <p>{ADDRESS_FIRST} {ADDRESS_SECOND} CP {POSTAL_CODE} {CITY}, {STATE}</p>
                </div>

                {phone &&
                    <div className='businessSubTitleContainer'>
                        <div className='businessSubTitleIcon'>
                            <PhoneIcon />
                        </div>
                        <p>{phone}</p>
                    </div>
                }

                <div className='businessSubTitleContainer'>
                    <div className='businessSubTitleIcon'>
                        <CalendarDaysIcon />
                    </div>
                    <p>{Horario}</p>
                </div>
            </div>

            <div className='businessContainer_Divider'></div>
            <div className='businessTitle'>
                <h4>Información de contacto</h4>
                <p>{location.state.userName}</p>
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

            <div className='businessContainer_Divider'></div>

            <div className='businessTitle'>
                <div style={{ display: 'flex', justifyItems: 'center', alignItems: 'center', marginRight: '20px' }}>
                    <h4 style={{ marginRight: '20px' }}>{bMostrarAddress ? '¿Cuál es la dirección?' : 'Visita a domicilio'}</h4>
                    <label className="switch">
                        <input type="checkbox" onClick={ModMostrarAddres} />
                        <span class="slider round"></span>
                    </label>
                </div>
                <div className={bMostrarAddress ? 'businessContainer_Address' : 'businessContainer_Address active'} >
                    <div className='AddressForm-group'>
                        <label>Código postal</label>
                        <input type="text" placeholder='Código postal' maxLength={5} onChange={getCodigoPostal} />
                    </div>
                    <div className='AddressForm-group'>
                        <label>Estado</label>
                        <input type="text" placeholder='Estado' value={estado} disabled />
                    </div>
                    <div className='AddressForm-group'>
                        <label>Municipio/Ciudad</label>
                        <input type="text" placeholder='Municipio/Ciudad' value={ciudad} disabled />
                    </div>
                    <div className='AddressForm-group'>
                        <label>Colonia</label>
                        <input list="optionsList" type="text" placeholder='Colonia'
                            disabled={colonias.length == 0 ? true : false}
                            onChange={handleChangeColonia} required ></input>
                        <datalist id="optionsList">
                            {colonias.map((option, index) => (
                                <option key={index} value={option} />
                            ))}
                        </datalist>
                    </div>
                    <div className='AddressForm-group'>
                        <label>Calle / Número externo</label>
                        <input type="text" placeholder='Calle / Número externo'
                            onChange={handleChange} />
                    </div>
                </div>
            </div>
            <div className='businessBtn'><button className='mb-10' onClick={() => {
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

        </div>
    </div>);
}

export default AddAppoin;