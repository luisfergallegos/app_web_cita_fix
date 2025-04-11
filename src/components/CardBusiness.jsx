// Library
import { BuildingStorefrontIcon, MapPinIcon, PhoneIcon, CalendarDaysIcon } from '@heroicons/react/24/solid';
import './CardBusiness.css';
// assents
import Store from "../assets/business.png";


export function CardBusiness({ empresa }) {
    // Function to convert Base64 string to binary data
    const arrayBufferToBase64 = (buffer) => {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return btoa(binary);
    };

    const { BUSSINESS_ID, USER_ID, DORSL, PHOTO, CATEGORY, SERVICE_LEVEL,
        ADDRESS_FIRST, ADDRESS_SECOND, POSTAL_CODE, CITY, STATE,
        phone, Horario } = empresa;
    //console.log(PHOTO.data);

    const TestClic = () => {
        console.log('Nueva Cita Id_Business :'+BUSSINESS_ID);
        console.log('           id_User :'+USER_ID);
    }
    
    return (
        <div className='CardContainer' onClick={TestClic}>
            <div className='CardContainer_Icon'>
                {
                    PHOTO === null ? <img id='store' src={Store} /> :
                        <img src={'data:image/jpeg;base64,' + arrayBufferToBase64(PHOTO.data)} />
                }

            </div>
            <div className='CardContainer_Titulo'>
                <h4><b>{DORSL}</b></h4>
                <p className='eighth'>{CATEGORY}</p>
                <span> Estrellas : {SERVICE_LEVEL}</span>
            </div>
            <div className='CardContainer_Divider' ></div>
            <div className='CardContainer_Detalle'>
                <div className='CardContainer_DetalleIcon'>
                    <MapPinIcon />
                </div>
                <div>
                    <p>{ADDRESS_FIRST} {ADDRESS_SECOND} CP {POSTAL_CODE} {CITY}, {STATE}</p>
                </div>


            </div>
            {phone && <div className='CardContainer_Detalle'>
                <div className='CardContainer_DetalleIcon'>
                    <PhoneIcon />
                </div>

                {phone}
            </div>}

            <div className='CardContainer_Detalle'>
                <div className='CardContainer_DetalleIcon'>
                    <CalendarDaysIcon />
                </div>
                {Horario}
            </div>
        </div>
    );
}

export default CardBusiness;