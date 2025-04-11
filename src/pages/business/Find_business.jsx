
// rrd imports
import { useLoaderData, useNavigate } from 'react-router-dom';
import { fetchData } from "../../Wrapper.js";
import { useEffect, useState } from "react";
// assets
import './Find_business.css';
import illustration from "../../assets/search_grey.png";
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import CardBusiness from '../../components/CardBusiness.jsx';

// loader
export function findBusinessLoader() {
    const sCorreo = fetchData("correo");
    const sPassword = fetchData("pwd");
    const empresas = fetchData("test") ?? [];
    return { sCorreo, sPassword, empresas };
}

export function FindBusiness() {
    const navigate = useNavigate();
    const { sCorreo, sPassword, empresas } = useLoaderData();
    useEffect(() => {
        if (sCorreo === null && sPassword === null) {
            navigate("/");
        }
    }, []);
    const [searchText, setsearchText] = useState('');
    const [filteredNames, setfilteredNames] = useState([]);
    const index = Math.floor(Math.random() * empresas.length);
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
                            filteredNames.map((empresa) => (<CardBusiness key={empresa.id} empresa={empresa} />))
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
                                    <CardBusiness key={empresas[index].id} empresa={empresas[index]} />
                                </div>

                            </div>
                        </div>
                    )
            }
        </div>);
}

export default FindBusiness;