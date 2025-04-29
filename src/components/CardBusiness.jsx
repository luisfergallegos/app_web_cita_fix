// Library
import { BuildingStorefrontIcon, MapPinIcon, PhoneIcon, CalendarDaysIcon, StarIcon } from '@heroicons/react/24/solid';
import './CardBusiness.css';
// assents
import Store from "../assets/business.png";
// rrd imports
import { useNavigate } from 'react-router-dom';

function StarRating(maxRating) {
    const stars = [];
    var colors= 'grey_red_amber_orange_lightGreen_green'.split('_');
    for (let i = 1; i <= maxRating; i++) {
        stars.push(
          <StarIcon width={20} color={colors[maxRating-1]}/>);
      }
    return stars;
}

export function CardBusiness({ userId, userName, empresa }) {
    const navigate = useNavigate();
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

    const desplegarPantallaAddAppoin = () => {
        navigate("/addAppoin",{state: {userId:userId,userName:userName,business:empresa}});
    }

    return (
        <div className='CardContainer' onClick={desplegarPantallaAddAppoin}>
            <div className='CardContainer_Icon'>
                {
                    PHOTO === null ? <img id='store' src={Store} /> :
                        <img src={'data:image/jpeg;base64,' + arrayBufferToBase64(PHOTO.data)} />
                }

            </div>
            <div className='CardContainer_Titulo'>
                <h4><b>{DORSL}</b></h4>
                <p className='eighth'>{CATEGORY}</p>
                {StarRating(SERVICE_LEVEL)}
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