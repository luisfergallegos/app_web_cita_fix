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
    const citas = fetchData("appoinBussDate") ?? [];
    return { sCorreo, sPassword, citas };
}

function defineInitialDate() {
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
    const { sCorreo, sPassword, citas } = useLoaderData();

    const [startDate, setStartDate] = useState();
    const [selectedTime, setselectedTime] = useState();
    const [cita, setcita] = useState([]);
    const [_excludeDates, setExcludeDates] = useState([]);
    const [_dias, setDias] = useState([]);

    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        const fData = async () => {
            //Solicitar por GET
            var options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
            try {
                const response = await fetch(`${urlApi}appoinBussDateDays?bussiness_id=${BUSSINESS_ID}`);
                if (!response.ok) {
                    console.log(`Error getting getDaysInactive.`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const json = await response.json();
                setExcludeDates(selectableDayPredicate(json['data']));
                if (_excludeDates.length === 0) {
                    setDias(defineInitialDate());
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
    /* const [bAccederUnaVezFecha, setbAccederUnaVezFecha] = useState(true); */

    /* moment.defineLocale('es', {
        months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
        monthsShort: 'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
        weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
        weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
        weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_')
  }); 
    let _selectedDate = moment(new Date()).format('dddd, d MMMM y'); */


    /* const ModbAccederUnaVezFecha = () => {
        setbAccederUnaVezFecha(!bAccederUnaVezFecha);
    }; */

    if (loading) {
        return <Loaging />;
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
                    excludeDates={_excludeDates}
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