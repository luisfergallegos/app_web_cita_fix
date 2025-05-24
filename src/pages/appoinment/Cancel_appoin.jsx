// rrd imports
import { useLoaderData, useNavigate } from 'react-router-dom';
import { dateSpanish, fetchData } from "../../Wrapper.js";
import { useEffect, useState } from "react";
// assets
import './Add_appoin.css';
import Loaging from '../../components/Loading.jsx';
import { urlApi } from "../../styles/Constants.jsx";
import User from "../../assets/e.png";
import { BuildingStorefrontIcon, EnvelopeIcon, InformationCircleIcon, MapPinIcon } from '@heroicons/react/24/solid';

// loader
export async function CancelarAppoinLoader({ params }) {
    const sCorreo = fetchData("correo");
    const sPassword = fetchData("pwd");
    const citaId = params.id;
    return { sCorreo, sPassword, citaId };
}

export function CancelarAppoin() {
    const navigate = useNavigate();
    const { sCorreo, sPassword, citaId } = useLoaderData();
    const [loading, setLoading] = useState(true);
    const [cita, setCita] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenC, setIsOpenC] = useState(false);
    const [comentario, setComentario] = useState('');

    // Function to convert Base64 string to binary data
    const arrayBufferToBase64 = (buffer) => {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return btoa(binary);
    };

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

    const _buildConfirm = () => {
        console.log('_buildConfirm');
        setIsOpen(false);
    };

    const _buildCalif = () => {
        console.log('buildCalif');
        console.log(comentario);
        setIsOpenC(false);
    };

    const handleChangeComentario= evt => {
        const value = evt.target.value;
        setComentario(value);
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
                setCita(json['data']);

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
            <h1>Resumen de la cita</h1>
            <div className='businessTitleContainer'>
                <div className='businessTitleContainer--Name'>

                    <h4>{cita.DORSL}</h4>
                    <p >{ConvertDateTime(cita.APPOINTMENT_DATE, cita.APPOINTMENT_TIME, 1)} -
                        {ConvertDateTime(cita.APPOINTMENT_DATE, cita.APPOINTMENT_TIME, 0)}</p>

                    {cita.BUS_USER_PHONE &&
                        <div className='businessSubTitleContainer'
                            style={{
                                cursor: 'pointer'
                            }}
                            onClick={() => {
                                const cleanNumber = cita.BUS_USER_PHONE.replace(/\D/g, '');
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
                            <p>{cita.BUS_USER_PHONE}</p>
                        </div>
                    }
                    {cita.FLAG_ADDRESS != '0' ?
                        <p>Visita a domicilio</p> :
                        <div></div>
                    }
                </div>
                <div>
                    {
                        cita.BUS_PHOTO === null ?
                            <img id='store' src={User} /> :
                            <img src={'data:image/jpeg;base64,' + arrayBufferToBase64(cita.BUS_PHOTO.data)} />
                    }
                </div>

            </div>
            <div className='businessContainer_Divider'></div>
            <div className='businessTitle'>
                <h4>Información de la cita</h4>
                <div className='businessSubTitleContainer'>
                    <div className='businessSubTitleIcon'>
                        <InformationCircleIcon color='orange' />
                    </div>
                    <p>Cita reservada</p>
                </div>
                {
                    cita.ESTATUS == '1' ? <div className='businessSubTitleContainer'>
                        <div className='businessSubTitleIcon'>
                            <InformationCircleIcon color='orange' />
                        </div>
                        <p>Cita modificada por la empresa</p>
                    </div> : <div></div>
                }
                {
                    cita.ESTATUS == '-1' ? <div className='businessSubTitleContainer'>
                        <div className='businessSubTitleIcon'>
                            <InformationCircleIcon color='red' />
                        </div>
                        <p>Cita cancelada</p>
                    </div> :
                        cita.ESTATUS == '3' ? <div className='businessSubTitleContainer'>
                            <div className='businessSubTitleIcon'>
                                <InformationCircleIcon color='blueAccent' />
                            </div>
                            <p>En cita</p>
                        </div> :
                            cita.ESTATUS == '0' || cita.ESTATUS == '1' ? <div className='businessSubTitleContainer'>
                                <div className='businessSubTitleIcon'>
                                    <InformationCircleIcon color='grey' />
                                </div>
                                <p>Cita pendiente</p>
                            </div> : <div className='businessSubTitleContainer'>
                                <div className='businessSubTitleIcon'>
                                    <InformationCircleIcon color='orange' />
                                </div>
                                <p>Cita finalizada</p>
                            </div>


                }
            </div>
            <div className='businessContainer_Divider'></div>
            <div className='businessSubTitle'>
                <div className='businessSubTitleContainer'>
                    <div className='businessSubTitleIcon'>
                        <BuildingStorefrontIcon />
                    </div>
                    <p>{cita.CATEGORIA}</p>
                </div>
            </div>
            <div className='businessContainer_Divider'></div>
            <div className='businessTitle'>
                <h4>Ubicación</h4>
            </div>
            <div className='businessSubTitle'>
                <div className='businessSubTitleContainer'
                    style={{
                        cursor: 'pointer'
                    }}
                    onClick={() => {
                        if (navigator.platform.indexOf('iPhone') !== -1 || navigator.platform.indexOf('iPad') !== -1 || navigator.platform.indexOf('iPod') !== -1) {
                            window.open(`maps://maps.google.com/?q=${cita.ADDRESS_FIRST} ${cita.ADDRESS_SECOND} CP ${cita.POSTAL_CODE} ${cita.CITY}, ${cita.STATE} Mexico`);
                        } else {
                            window.open(`https://maps.google.com?q=${cita.ADDRESS_FIRST} ${cita.ADDRESS_SECOND} CP ${cita.POSTAL_CODE} ${cita.CITY}, ${cita.STATE} Mexico`);
                        }
                    }}>
                    <div className='businessSubTitleIcon'>
                        <MapPinIcon />
                    </div>
                    <div >
                        <p >{cita.ADDRESS_FIRST}, {cita.ADDRESS_SECOND}, {cita.POSTAL_CODE} {cita.CITY}, {cita.STATE}, Mexico</p>
                    </div>
                </div>
            </div>
            <div className='businessContainer_Divider'></div>
            <div className='businessBtn'>
                <button onClick={() => {
                    if(cita.ESTATUS == '0' && cita.FLAG_SERVICE_LEVEL == '0'){
                        setIsOpenC(true);
                    }else{
                        setIsOpen(true);
                    }
                    
                }}>{cita.ESTATUS == '2' && cita.FLAG_SERVICE_LEVEL == '0' ? 'Calificar'
                    : 'Cancelar'}</button>
            </div>
            {
                isOpen ?
                    <>
                        <div className="backdropDialog" ></div>
                        <div className="dialogDialog">
                            <h2>Confirmar</h2>
                            <span>¿Seguro que quieres cancelar esta cita?</span>
                            <div className='buttonDialog'>
                                <button className='primaryBkg' onClick={() => { setIsOpen(false); }}>Cancelar</button>
                                <button className='secondBkg' onClick={() => {
                                    if (cita.ESTATUS == '3' ||
                                        cita.ESTATUS == '2' ||
                                        cita.ESTATUS == '-1') {
                                        if (cita.ESTATUS == '3') {
                                            alert('No se puede cancelar la cita (Actual)');
                                          } else if (cita.ESTATUS == '-1') {
                                            alert('No se puede cancelar la cita (Cancelada)');
                                          } else if (cita.FLAG_SERVICE_LEVEL ==
                                              '0') {
                                            _buildCalif();
                                          }
                                    }
                                    else {
                                        _buildConfirm();
                                    }

                                }}>Confirmar</button>
                            </div>

                        </div>
                    </>
                    : isOpenC ?
                    <>
                        <div className="backdropDialog" ></div>
                        <div className="dialogDialog">
                            <h2>Calificación</h2>
                            <span>Comparte tu calificación con otros usuarios</span>

                            <label>Comentario para el lugar (Opcional)</label>
                            <input type="text" placeholder='Puedes añadir cualquier comentario que sea de interés para el lugar' onChange={handleChangeComentario}/>
                            <div className='buttonDialog'>
                                <button className='primaryBkg' onClick={() => { setIsOpenC(false); }}>Cancelar</button>
                                <button className='secondBkg' onClick={() => {
                                    _buildCalif();
                                }}>Calificar</button>
                            </div>

                        </div>
                    </>
                    : null
            }

        </div>);
}

export default CancelarAppoin;