
// rrd imports
import { useLoaderData, useNavigate } from 'react-router-dom';
import { fetchData } from "../../Wrapper.js";
import { useEffect, useState } from "react";
// assets
import './Find_business.css';
import { urlApi } from "../../styles/Constants.jsx";
import illustration from "../../assets/search_grey.svg";
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import CardBusiness from '../../components/CardBusiness.jsx';
import Loaging from '../../components/Loading.jsx';

// loader
export function findBusinessLoader() {
    const sCorreo = fetchData("correo");
    const sPassword = fetchData("pwd");
    const sUserCitaFix = fetchData("UserCitaFix") ?? [];
    return { sCorreo, sPassword, sUserCitaFix };
}

/* const CloseIcon = () => (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M17.25 6.75L6.75 17.25"
        />
        <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M6.75 6.75L17.25 17.25"
        />
    </svg>
); */

export function FindBusiness() {
    const navigate = useNavigate();
    const { sCorreo, sPassword, sUserCitaFix } = useLoaderData();
    const [loading, setLoading] = useState(true);
    const [empresas, setEmpresas] = useState([]);
    const [index, setIndex] = useState();


    const userId = sUserCitaFix['USER_ID'];
    const userName = sUserCitaFix['first_name'] + ' ' + sUserCitaFix['last_name'];
    const [searchText, setsearchText] = useState('');
    const [filteredNames, setfilteredNames] = useState([]);

    /* const [isOpen, setIsOpen] = useState(false); */
    

    const handleChange = evt => {
        const tempList = [];
        const value = evt.target.value;
        setsearchText(value);
        for (var filName in empresas) {
            if (empresas[filName].DORSL.toLowerCase().startsWith(value.toLowerCase())) {
                tempList.push(empresas[filName]);
            } else if (empresas[filName].CATEGORY
                .toLowerCase()
                .startsWith(value.toLowerCase())) {
                tempList.push(empresas[filName]);
            }
        }
        setfilteredNames(tempList);
    };

    useEffect(() => {
        const fData = async () => {
            const userId = sUserCitaFix['USER_ID'];
            //Solicitar por GET
            var options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
            try {
                const response = await fetch(`${urlApi}bussiness?user_id=${userId}&latitude=4&longitude=5&radio=6`, options);
                if (!response.ok) {
                    console.log(`Error getting empresas.`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const json = await response.json();
                setEmpresas(json['data']);
                setIndex(Math.floor(Math.random() * empresas.length));
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
        return <Loaging/>;
    }

    
    return (
        <div className="FindBusinessContainer">
            <div className='searchContainer'>
                <div className="searchicon"><MagnifyingGlassIcon /></div>
                <input type="text" name="searchText" placeholder="Buscar en Planner Days" onChange={handleChange} />
            </div>
            {
                searchText !== '' ? (
                    <div className='empresas'>
                        {
                            empresas &&
                            filteredNames.map((empresa) => (<CardBusiness key={empresa.id} userId={userId} userName={userName} empresa={empresa} />))

                        }
                    </div>
                )
                    :
                    (
                        <div className='buildPageFindBusinessContainer'>
                            <img id='search_grey' src={illustration} alt="Planners Day" width={350} />
                            <p>¿Estás en busca de un servicio nó visita?</p>
                            <p>Dirígete a la parte superior para iniciar la búsqueda.</p>
                            <p>Al seleccionar alguna de las opciones podrás generar una cita la cuál será notificada al instante.</p>
                            <div className='buildListRandom'>
                                <p>Sugerencias para ti</p>
                                <div className='empresas'>
                                    <CardBusiness key={empresas[index]['BUSSINESS_ID']} userId={userId} userName={userName} empresa={empresas[index]} />
                                </div>
                            </div>
                        </div>
                    )
            }
            {/* {
                isOpen ?
                    <>
                        <div className="backdropDialog" ></div>
                        <div className="dialogDialog">
                        <button className="closeDialog" onClick={() => setIsOpen(false)}>
                                <CloseIcon />
                            </button>
                            <h2>Confirmar</h2>
                        </div>
                    </>
                    : null
            } */}
        </div>);
}

export default FindBusiness;