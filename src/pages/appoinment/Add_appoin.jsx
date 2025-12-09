// rrd imports
import { useLoaderData, useNavigate } from 'react-router-dom';
import { fetchData, dateSpanish } from "../../Wrapper.js";
import { forwardRef, useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { toast } from "react-toastify";
// assets
// import './Add_appoin.css';
import '../../components/Loading.css';
import Store from "../../assets/business.png";
import Loaging from '../../components/Loading.jsx';
import { urlApi } from "../../styles/Constants.jsx";
// Library
import { MapPinIcon, PhoneIcon, CalendarDaysIcon, CalendarDateRangeIcon, XMarkIcon as CloseIcon } from '@heroicons/react/24/solid';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
//import moment from 'moment';

// loader
export function AddAppoinLoader() {
    const sCorreo = fetchData("correo");
    const sPassword = fetchData("pwd");
    return { sCorreo, sPassword };
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
    const [canSubmit, setCanSubmit] = useState(true);
    // const [direccionUno, setDireccionUno] = useState('');
    // const [direccionDos, setDireccionDos] = useState('');
    const [codigoPostal, setCodigoPostal] = useState('');
    const [address, setAddress] = useState({
        address_first: '',
        address_second: "",
        postal_code: "",
        city: "",
        state: ""
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    const { BUSSINESS_ID, USER_ID, DORSL, PHOTO, CATEGORY, SERVICE_LEVEL,
        ADDRESS_FIRST, ADDRESS_SECOND, POSTAL_CODE, CITY, STATE,
        phone, Horario, HOME_SERVICE } = location.state?.business ?? {};
    const userId = location.state?.userId ?? '';
    var _today = new Date();
    const initialDate = new Date(_today);
    const lastDate = new Date(_today.setDate(_today.getDate() + 31));

    const toggleAddress = () => setbMostrarAddress((v) => !v);

    function validate() {
        const e = {};
        if (!address.postal_code.trim())
            e.postal_code = "El Código postal es obligatorio.";
        if (!address.state.trim())
            e.state = "El Estado es obligatorio.";
        if (!address.city.trim())
            e.city = "El Municipio/Ciudad es obligatorio.";
        if (!address.address_second.trim())
            e.address_second = "La Colonia es obligatorio.";
        if (!address.address_first.trim())
            e.address_first = "La Calle / Número externo es obligatorio.";

        return e;
    }

    

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
        setcita(tempcita);
    }

    const _buildConfirm = async (e) => {
        if (!selectedTime || !startDate) {
            return toast.error(`Selecciona fecha y hora.`);
        }

        if (!canSubmit) return;

        setCanSubmit(false);
        setIsOpen(false);

        const month = (`0` + (startDate.getMonth() + 1)).slice(-2);
        const day = (`0` + startDate.getDate()).slice(-2);
        const selectedDate = `${startDate.getFullYear()}-${month}-${day}`;

        const bodyBase = {
            user_id: userId,
            bussiness_id: BUSSINESS_ID,
            usernotification_id: USER_ID,
            appointment_date: selectedDate,
            appointment_time: selectedTime,
            anonimo: '',
            message,
            estatus: '0',
            dorsl: location.state.userName,
            for_who: 'Bus'
        };

        const endpoint = bMostrarAddress ? 'appoinAddress' : 'appoin';
        const body = bMostrarAddress
            ? { ...bodyBase, address_first: address.address_first, address_second: address.address_second, postal_code: address.postal_code, city: address.city, state: address.state }
            : bodyBase;

        try {
            const resp = await fetch(`${urlApi}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const json = await resp.json();
            if (json.sucess === false) {
                toast.error(`Fecha ${selectedDate} / Hora ${selectedTime} ya no está disponible.`);
                setCanSubmit(true);
                return;
            }
            navigate('/home');
        } catch (e) {
            console.error(e);
            toast.error('Ocurrió un error al guardar la cita. Intenta de nuevo.');
            setCanSubmit(true);
        }
    };

    const getCodigoPostal = async (evt) => {
        const value = evt.target.value;
        setCodigoPostal(value);
        if (value.length !== 5) {
            setColonias([]);
            setEstado('');
            setCiudad('');
            return;
        }
        try {
            const resp = await fetch(`${urlApi}postalCode?d_codigo=${value}`);
            if (!resp.ok) throw new Error('Postal fetch error');
            const json = await resp.json();
            const data = json.data?.[0];
            if (!data) return;
            setEstado(data.d_estado || '');
            setCiudad(data.d_ciudad || '');
            setColonias((data.d_asentas || []).map((a) => a.d_asenta));
            address.postal_code = value;
            address.state = data.d_estado || '';
            address.city = data.d_ciudad || '';
        } catch (e) {
            console.error(e);
        }
    };

    function handleChange(e){
        const { name, value } = e.target;
        setAddress((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };


    useEffect(() => {
        const fData = async () => {
            if (userId === '') {
                navigate("/");
            }
            else if (sCorreo === null && sPassword === null) {
                navigate("/");
            }
            //Solicitar por GET
            try {
                const response = await fetch(`${urlApi}appoinBussDateDays?bussiness_id=${BUSSINESS_ID}`);
                if (!response.ok) {
                    console.log(`Error getting getDaysInactive.`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const json = await response.json();
                setExcludeDates(selectableDayPredicate(json.data || []));

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
        fData();
    }, []);




    if (loading) {
        return <Loaging />;
    }

    const photoBase64 = arrayBufferToBase64(PHOTO == null ? PHOTO : PHOTO.data);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-600 to-orange-800 p-4">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-6 text-center mt-20">
                <div className="flex flex-col items-center">
                    {photoBase64 ? (
                        <img className="w-36 h-36 rounded-full object-cover border mt-4" src={`data:image/jpeg;base64,${photoBase64}`} alt="business" />
                    ) : (
                        <img className="w-36 h-36 rounded-full object-cover border mt-4 bg-gray-200" src={Store} alt="default" />
                    )}
                    <h3 className="text-2xl font-bold mt-4 text-black">{DORSL}</h3>
                    <p className="text-gray-500 mb-3">{CATEGORY}</p>
                    <div className="w-full flex items-center gap-3 px-4 mt-2">
                        <MapPinIcon className="w-6 h-6 text-orange-500" />
                        <div className="text-left">
                            <p className="text-gray-500">{ADDRESS_FIRST} {ADDRESS_SECOND} CP {POSTAL_CODE}</p>
                            <p className="text-gray-500">{CITY}, {STATE}</p>
                        </div>
                    </div>
                    <div className="w-full flex items-center gap-3 px-4 mt-2">
                        <PhoneIcon className="w-6 h-6 text-orange-500" />
                        <div className="text-left">
                            <p className="text-gray-500">{phone || 'Este negocio aún no ha agregado información de contacto.'}</p>
                        </div>
                    </div>
                    <div className="w-full flex items-center gap-3 px-4 mt-2 mb-2">
                        <CalendarDaysIcon className="w-6 h-6 text-orange-500" />
                        <div className="text-left">
                            <p className="text-gray-500">{Horario}</p>
                        </div>
                    </div>
                </div>

                <hr className="my-4" />

                <div className="text-left px-4">
                    <h4 className="text-lg font-semibold">Agendar</h4>
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
                    {cita[0] && cita[0].map(({ APPOINTMENT_TIME, STATUS }, idx) => {
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
                {HOME_SERVICE == '1' && (
                    <div className="px-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-lg font-semibold">{bMostrarAddress ? '¿Cuál es la dirección?' : 'Visita a domicilio'}</h4>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={bMostrarAddress} onChange={toggleAddress} className="hidden" />
                                <div className={`w-10 h-6 rounded-full p-1 flex items-center ${bMostrarAddress ? 'bg-orange-500' : 'bg-gray-300'}`}>
                                    <div className={`bg-white w-4 h-4 rounded-full transform ${bMostrarAddress ? 'translate-x-4' : 'translate-x-0'} transition-transform`} />
                                </div>
                            </label>
                        </div>

                        <div className={`${bMostrarAddress ? 'grid' : 'hidden'} gap-3 grid-cols-2 mt-4`}>
                            <div>
                                <label className="text-xs font-medium">Código postal</label>
                                <input maxLength={5} value={codigoPostal} onChange={getCodigoPostal} className="mt-1 w-full border rounded-md p-2" placeholder="Código postal" />
                                {errors.postal_code && <p className="mt-1 text-xs text-red-600">{errors.postal_code}</p>}
                            </div>
                            <div>
                                <label className="text-xs font-medium">Estado</label>
                                <input value={estado} disabled className="mt-1 w-full border rounded-md p-2 bg-gray-50" placeholder="Estado" />
                                {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state}</p>}
                            </div>
                            <div>
                                <label className="text-xs font-medium">Municipio/Ciudad</label>
                                <input value={ciudad} disabled className="mt-1 w-full border rounded-md p-2 bg-gray-50" placeholder="Municipio/Ciudad" />
                                {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
                            </div>
                            <div>
                                <label className="text-xs font-medium">Colonia</label>
                                <input list="optionsList" value={address.address_second}
                                    // onChange={handleChange} 
                                    onChange={(e) => {
                                        const raw = e.target.value;
                                        setAddress(prev => ({ ...prev, address_second: raw }));
                                    }}
                                    disabled={colonias.length === 0} className="mt-1 w-full border rounded-md p-2" placeholder="Colonia" />
                                <datalist id="optionsList">
                                    {colonias.map((c, i) => <option key={i} value={c} />)}
                                </datalist>
                                {errors.address_second && <p className="mt-1 text-xs text-red-600">{errors.address_second}</p>}
                            </div>
                            <div className="col-span-2">
                                <label className="text-xs font-medium">Calle / Número externo</label>
                                <input name="address_first" value={address.address_first} onChange={handleChange} className="mt-1 w-full border rounded-md p-2" placeholder="Calle / Número externo" />
                                {errors.address_first && <p className="mt-1 text-xs text-red-600">{errors.address_first}</p>}
                            </div>
                        </div>
                    </div>
                )}
                <div className="mt-6 px-4 mb-6">
                    {canSubmit ? (
                        <button
                            onClick={(e) => {
                                if (bMostrarAddress) {
                                    e.preventDefault();
                                    const eobj = validate();
                                    setErrors(eobj);
                                    if (Object.keys(eobj).length > 0) return;
                                }
                                if (selectedTime) setIsOpen(true);
                                else
                                    toast.error('Selecciona una hora.');
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

                {/* Modal confirm */}
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black opacity-40" />
                        <div className="bg-white rounded-2xl shadow-xl p-6 z-10 w-full max-w-md">
                            <button className="absolute top-4 right-4" onClick={() => setIsOpen(false)}>
                                <CloseIcon className="w-6 h-6 text-gray-700" />
                            </button>
                            <h4 className="text-xl font-bold text-center">Confirmar</h4>
                            <p className="text-center text-yellow-500 mt-1">¿Deseas guardar tu cita?</p>
                            <p className="text-center text-gray-500 mt-1">Motivo de la visita/Servicio</p>
                            <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full mt-3 border rounded-md p-2" rows={4} placeholder="Opcional" />
                            <div className="flex justify-end gap-3 mt-4">
                                <button onClick={() => { setIsOpen(false); setMessage(''); }} className="px-4 py-2 rounded-md bg-gray-500 text-white">Cancelar</button>
                                <button onClick={_buildConfirm} className="px-4 py-2 rounded-md bg-orange-500 text-white">Confirmar</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AddAppoin;