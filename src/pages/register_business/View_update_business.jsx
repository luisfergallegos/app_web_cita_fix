// rrd imports
import { useLoaderData, useNavigate } from 'react-router-dom';
import { fetchData } from "../../Wrapper.js";
import { useEffect, useState } from "react";
// assets
import '../register_user/View_update_user.css';
import Loaging from '../../components/Loading.jsx';
import { urlApi } from "../../styles/Constants.jsx";
import AutocompleteInput from '../../components/AutocompleteInput.jsx';

import { BuildingStorefrontIcon, ChevronDownIcon, ChevronUpIcon, ClockIcon, MapPinIcon, Squares2X2Icon, UserCircleIcon } from '@heroicons/react/24/solid';
import RegisterSchedule from '../schedule/register_schedule.jsx';
import UpdateSchedule from '../schedule/update_schedule.jsx';

// loader
export function viewUpdateBusinessLoader() {
    const sCorreo = fetchData("correo");
    const sPassword = fetchData("pwd");
    const sUserCitaFix = fetchData("UserCitaFix") ?? [];
    const dorsl = sUserCitaFix['DORSL'];
    const businessId = sUserCitaFix['BUSSINESS_ID'];
    return { sCorreo, sPassword, dorsl, businessId };
}


export function ViewUpdateBusiness() {
    const navigate = useNavigate();
    const { sCorreo, sPassword, dorsl, businessId } = useLoaderData();
    const [loading, setLoading] = useState(true);
    const [bussiness, setBussiness] = useState([]);
    const [horario, setHorario] = useState([]);
    const [_excludeTimes, setExcludeTimes] = useState([]);
    const [nameGroup, setNameGroup] = useState(true);
    const [categoriaGroup, setCategoriaGroup] = useState(true);
    const [horarioGroup, setHorarioGroup] = useState(true);
    const [addressGroup, setAddressGroup] = useState(true);
    const [codigoPostal, setCodigoPostal] = useState('');
    const [countCodigoPostal, setCountCodigoPostal] = useState(0);
    const [estado, setEstado] = useState();
    const [ciudad, setCiudad] = useState();
    const [colonias, setColonias] = useState([]);
    const [direccionDos, setDireccionDos] = useState('');
    const [direccionUno, setDireccionUno] = useState('');



    const arrayBufferToBase64 = (buffer) => {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return btoa(binary);
    };

    const ModNameGroupOpen = () => {
        setNameGroup(!nameGroup);
    };

    const ModCategoriaGroupOpen = () => {
        setCategoriaGroup(!categoriaGroup);
    };

    const ModHorarioGroupOpen = () => {
        setHorarioGroup(!horarioGroup);
    };

    const ModAddressGroupOpen = () => {
        setAddressGroup(!addressGroup);
    };

    const handleChange = evt => {
        const value = evt.target.value;
        setDireccionUno(value);
    };




    function selectableTimePredicate() {
        var _dia = new Date();
        var tempHoras = [];
        for (let index = 0; index < 24; index++) {
            if (index < 9) {
                var Aux = new Date(_dia.getFullYear(), _dia.getMonth(), _dia.getDay(), index, '00', '00');
                tempHoras.push(Aux);
            }
            else if (index > 18 && index < 24) {
                var Aux = new Date(_dia.getFullYear(), _dia.getMonth(), _dia.getDay(), index, '00', '00');
                tempHoras.push(Aux);
            }
        }
        return tempHoras;
    }

    const getCodigoPostal = async (evt) => {
        const value = evt.target.value;
        var tempcita = [];
        setCountCodigoPostal(evt.target.value.length);
        if (evt.target.value.length === 5) {
            setCodigoPostal(value);
            const json = fetchData("postalCode") ?? [];
            setEstado(json['data'][0].d_estado);
            setCiudad(json['data'][0].d_ciudad);
            var tempcita = [];
            for (let index = 0; index < json['data'][0].d_asentas.length; index++) {
                var element = json['data'][0].d_asentas[index];
                tempcita.push(element.d_asenta);
            }
            setColonias(tempcita);
        }
        else {
            setColonias(tempcita);
            setEstado('');
            setCiudad('');
        }
        //Solicitar por GET
        /* try {
            const response = await fetch(`${urlApi}postalCode?d_codigo=${value}`);
            if (!response.ok) {
                console.log(`Error getting getDaysInactive.`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const json = await response.json();
        }
        catch (e) {
            return;
        } */
    };

    useEffect(() => {
        const fData = async () => {
            //Solicitar por GET
            try {
                const response = await fetch(`${urlApi}bussinessId?bussiness_id=${businessId}`);
                if (response.status == 200) {
                    const json = await response.json();
                    setBussiness(json['data']);
                    //Solicitar por GET
                    try {
                        const response = await fetch(`${urlApi}schedule?bussinessId=${businessId}`);
                        if (response.status == 200) {
                            const json = await response.json();
                            setHorario(json['data']);
                            setExcludeTimes(selectableTimePredicate());
                        } else {
                            console.log(`Error getting schedule.`);
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        setLoading(false);
                    }
                    catch (e) {
                        setLoading(false);
                        return;
                    }
                } else {
                    console.log(`Error getting bussinessId.`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }
            catch (e) {
                setLoading(false);
                return;
            }

        };
        if (dorsl === '') {
            navigate("/");
        }
        else if (sCorreo === null && sPassword === null) {
            navigate("/");
        }
        fData();
    }, []);

    if (loading) {
        return <Loaging />;
    }

    return (
        <div className="ViewUpdateUserContainer">
            <div className='UpdateUserContainerPHOTO_bkg'>
                <div className='UpdateUserContainerPHOTO'>
                    {
                        bussiness.PHOTO === '' ? <UserCircleIcon /> :
                            <img id='imgPHOTO' src={'data:image/jpeg;base64,' + arrayBufferToBase64(bussiness.PHOTO['data'])} />
                    }
                </div>
            </div>
            <div className='UpdateUserContainerGroupClic'>
                <BuildingStorefrontIcon className='_color' />
                <label>Nombre</label>
                {nameGroup ? <ChevronDownIcon onClick={ModNameGroupOpen} /> :
                    <ChevronUpIcon onClick={ModNameGroupOpen} />}
            </div>
            <div className={nameGroup ? 'nameGroup active' : 'nameGroup'}>
                <div className='GroupLabel'>
                    <label>Nombre de la empresa</label>
                    <input type="text" placeholder='Ingresa el nuevo nombre de tu empresa' />
                    <div class="bt-btn">
                        <button>Guardar</button>
                    </div>
                </div>
            </div>
            <div className='UpdateUserContainerGroupClic'>
                <Squares2X2Icon className='_color' /><label>Categoria</label>
                {categoriaGroup ? <ChevronDownIcon onClick={ModCategoriaGroupOpen} /> :
                    <ChevronUpIcon onClick={ModCategoriaGroupOpen} />}
            </div>
            <div className={categoriaGroup ? 'nameGroup active' : 'nameGroup'}>
                <div className='GroupLabel'>
                    <label>Categoría comercial</label>
                    <input type="text" placeholder='Elige la categoría que describa mejor tu empresa' />
                    <span>Esto ayuda a que los clientes te encuentren si están buscando una empresa como la tuya.</span>
                    <div class="bt-btn">
                        <button>Guardar</button>
                    </div>
                </div>
            </div>
            <div className='UpdateUserContainerGroupClic'>
                <ClockIcon className='_color' />
                {horario.length == 0 ? <label>Agrega tu horario</label> : <label>Actualización de horario</label>}
                {horarioGroup ? <ChevronDownIcon onClick={ModHorarioGroupOpen} /> :
                    <ChevronUpIcon onClick={ModHorarioGroupOpen} />}
            </div>
            <div className={horarioGroup ? 'nameGroup active' : 'nameGroup'}>
                {
                    horario.length == 0 ?
                        <RegisterSchedule excludeTimes={_excludeTimes} /> :
                        <UpdateSchedule excludeTimes={_excludeTimes} horario={horario} />
                }
            </div>
            <div className='UpdateUserContainerGroupClic'>
                <MapPinIcon className='_color' /><label>Dirección</label>
                {addressGroup ? <ChevronDownIcon onClick={ModAddressGroupOpen} /> :
                    <ChevronUpIcon onClick={ModAddressGroupOpen} />}
            </div>
            <div className={addressGroup ? 'nameGroup active' : 'nameGroup'}>
                <div className='GroupLabel'>
                    <label>Código postal</label>
                    <input type="text" placeholder='Código postal' maxLength={5} onChange={getCodigoPostal} />
                    <label className='sublabel' name="countCodigoPostal">{countCodigoPostal} / 5 </label>
                    <label>Estado</label>
                    <input className='--placeholder' type="text" placeholder='Estado' value={estado} disabled />
                    <label>Municipio/Ciudad</label>
                    <input className='--placeholder' type="text" placeholder='Municipio/Ciudad' value={ciudad} disabled />
                    <label>Colonia</label>
                    <AutocompleteInput data={colonias} placeholder={'Colonia'} setDireccionDos={setDireccionDos} />
                    <label>Calle / Número externo</label>
                    <input type="text" placeholder='Calle / Número externo' onChange={handleChange} />
                    <div class="bt-btn">
                        <button>Guardar</button>
                    </div>
                </div>
            </div>

        </div>);
}

export default ViewUpdateBusiness;