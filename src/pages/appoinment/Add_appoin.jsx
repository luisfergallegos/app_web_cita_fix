// rrd imports
import { useLoaderData, useNavigate } from 'react-router-dom';
import { fetchData } from "../../Wrapper.js";
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
    const _dias = fetchData("appoinBussDateDays") ?? [];
    const citas = fetchData("appoinBussDate") ?? [];
    return { sCorreo, sPassword, _dias, citas };
}


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
    const [startDate, setStartDate] = useState(new Date());
    const ExampleCustomInput = forwardRef(
        ({ value, onClick, className }, ref) => (
            <label className={className} onClick={onClick} ref={ref}>
                <p>{value} ‒ Selecciona una hora</p>
            </label>
        ),
    );
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
                <h2>Select a Date</h2>
                <DatePicker
                    dateFormat="dd/MM/yyyy"
                    excludeDates={[new Date(2025, 3, 20), new Date(2025, 3, 23)]}
                    selected={startDate} onChange={(date) => setStartDate(date)}
                    customInput={<ExampleCustomInput className="example-custom-input" />}
                />
                <div >-----------------------------</div>
                

            </div>
        </div>);
}

export default AddAppoin;