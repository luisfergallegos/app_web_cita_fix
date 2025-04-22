// rrd imports
import { useLoaderData, useNavigate } from 'react-router-dom';
import { fetchData, dateSpanish } from "../../Wrapper.js";
import { forwardRef, useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
// assets
import './Add_appoin.css';
import Store from "../../assets/business.png";
// Library
import { MapPinIcon, PhoneIcon, CalendarDaysIcon, CalendarDateRangeIcon } from '@heroicons/react/24/solid';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
//import moment from 'moment';

// loader
export function AddAppoinLoader() {
    const sCorreo = fetchData("correo");
    const sPassword = fetchData("pwd");
    //Solicitar por GET
    const tempListDias = fetchData("appoinBussDateDays") ?? [];
    const citas = fetchData("appoinBussDate") ?? [];
    const _dias = defineInitialDate(tempListDias);
    /* const _excludeDates = selectableDayPredicate(_dias); */
    return { sCorreo, sPassword, _dias, citas };
}

function defineInitialDate(_dias) {
    var tempdias = [];
    //Convert String to Date
    for (let index = 0; index < _dias.length; index++) {
        //console.log(_dias[index]);
        var diaAux = parseInt(_dias[index].substring(0, 2));
        var MesAux = parseInt(_dias[index].substring(3, 5)) - 1;
        var AñoAux = parseInt(_dias[index].substring(6, 10));
        //console.log(diaAux+'_'+MesAux+'_'+AñoAux);
        var Aux = new Date(AñoAux, MesAux, diaAux);
        tempdias.push(Aux);
    }
    return tempdias;
}

/* function selectableDayPredicate(_dias) {
    var _tempdias = [];
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

    return _tempdias;
} */

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
    const { sCorreo, sPassword, _dias, citas } = useLoaderData();

    useEffect(() => {
        if (sCorreo === null && sPassword === null) {
            navigate("/");
        }
    }, []);
    /* const [bAccederUnaVezFecha, setbAccederUnaVezFecha] = useState(true); */

    /* moment.defineLocale('es', {
        months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
        monthsShort: 'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
        weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
        weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
        weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_')
  }); 
    let _selectedDate = moment(new Date()).format('dddd, d MMMM y'); */

    const { BUSSINESS_ID, USER_ID, DORSL, PHOTO, CATEGORY, SERVICE_LEVEL,
        ADDRESS_FIRST, ADDRESS_SECOND, POSTAL_CODE, CITY, STATE,
        phone, Horario } = location.state.business;
    const initialDate = _dias[0];
    const lastDate = _dias[_dias.length - 1];
    // Function to convert Base64 string to binary data
    const arrayBufferToBase64 = (buffer) => {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return btoa(binary);
    };
    /* const ModbAccederUnaVezFecha = () => {
        setbAccederUnaVezFecha(!bAccederUnaVezFecha);
    }; */
    const [startDate, setStartDate] = useState();
    const [selectedTime, setselectedTime] = useState();
    const [cita, setcita] = useState([]);
    const ExampleCustomInput = forwardRef(
        ({ value, onClick, className }, ref) => (
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
    return (
        <div className="AddAppoinContainer">
            <div>
                <h4><b>{DORSL}</b></h4>
                <p >{CATEGORY}</p>
            </div>
            <div >
                {
                    PHOTO === null ? <img id='store' src={Store} /> :
                        <img src={'data:image/jpeg;base64,' + arrayBufferToBase64(PHOTO.data)} width={100} />
                }
            </div>
            <div>
                <div>
                    <MapPinIcon width={30} />
                </div>
                <div>
                    <p>{ADDRESS_FIRST} {ADDRESS_SECOND} CP {POSTAL_CODE} {CITY}, {STATE}</p>
                </div>
            </div>
            {phone && <div >
                <div >
                    <PhoneIcon width={30} />
                </div>

                {phone}
            </div>}

            <div >
                <div>
                    <CalendarDaysIcon width={30} />
                </div>
                {Horario}
            </div>
            <div >-----------------------------</div>
            <div >
                Información de contacto
                <h1>{location.state.userName}</h1>
            </div>
            <div >-----------------------------</div>
            <div >Agendar</div>
            <div >
                <div>
                    <CalendarDateRangeIcon width={30} />
                </div>
                <DatePicker
                    dateFormat="dd/MM/yyyy"
                    excludeDates={_dias}
                    selected={startDate}
                    onChange={(date) => { setStartDate(date); SelectDateTime(date); setselectedTime() }}
                    minDate={initialDate}
                    maxDate={lastDate}
                    customInput={<ExampleCustomInput className="example-custom-input" />}
                />
                {cita[0] &&
                    cita[0].map(({ APPOINTMENT_TIME, STATUS }, index) =>
                    (
                        <div key={APPOINTMENT_TIME}
                            style={STATUS === 'No' ?
                                { background: 'grey' } :
                                { background: '#e0e0e0' }
                            }
                            onClick={() =>
                                setselectedTime(APPOINTMENT_TIME)

                            }  >
                            <label>{APPOINTMENT_TIME} </label>
                        </div>
                    ))
                }
                <div >-----------------------------</div>


            </div>
        </div>);
}

export default AddAppoin;