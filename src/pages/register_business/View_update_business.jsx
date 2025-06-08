// rrd imports
import { useLoaderData, useNavigate } from 'react-router-dom';
import { fetchData } from "../../Wrapper.js";
import { useEffect, useState } from "react";
// assets
import '../register_user/View_update_user.css';
import Loaging from '../../components/Loading.jsx';
import { urlApi } from "../../styles/Constants.jsx";

import { BuildingStorefrontIcon, ChevronDownIcon, ChevronUpIcon, ClockIcon, MapPinIcon, Squares2X2Icon, UserCircleIcon } from '@heroicons/react/24/solid';
import RegisterSchedule from '../schedule/register_schedule.jsx';
import UpdateSchedule from '../schedule/update_schedule.jsx';

// loader
export function viewUpdateBusinessLoader() {
    const sCorreo = fetchData("correo");
    const sPassword = fetchData("pwd");
    const sUserCitaFix = fetchData("UserCitaFix") ?? [];
    const dorsl = fetchData("dorsl");
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
    const [name, setName] = useState();
    const [categorias, setCategorias] = useState([]);
    const [categoriaId, setCategoriaId] = useState('');
    const [sCategoriaName, setCategoriaName] = useState('');

    const [showAlertConfirmation, setshowAlertConfirmation] = useState(false);


    const arrayBufferToBase64 = (buffer) => {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return btoa(binary);
    };

    const ModNameGroupOpen = async (e) => {
        e.stopPropagation();
        if (bussiness.DORSL != name) {
            //Enviar por PUT
            var options = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    {
                        'user_id': bussiness.USER_ID,
                        "bussiness_id": bussiness.BUSSINESS_ID,
                        'name': name,
                        'latitude': bussiness.LATITUDE,
                        'longitude': bussiness.LONGITUDE,
                        'bussiness_branch_id': bussiness.BUSSINESS_BRANCH_ID,
                        'address_first': bussiness.ADDRESS_FIRST,
                        'address_second': bussiness.ADDRESS_SECOND,
                        'postal_code': bussiness.POSTAL_CODE,
                        'city': bussiness.CITY,
                        'state': bussiness.STATE
                    })
            }
            try {
                const response = await fetch(`${urlApi}bussiness`, options);
                const json = await response.json();
                if (json['sucess']) {
                    localStorage.setItem("dorsl", JSON.stringify(name));
                    setshowAlertConfirmation(true);
                    setTimeout(() => setshowAlertConfirmation(false), 3000); // ocultar alerta
                    setTimeout(() => window.location.reload(), 3000); 
                    
                }
                else {
                    console.log(`No se pudo actulizar informacion de la empresa`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

            }
            catch (e) {
                return;
            }
        }
    };

    const ModCategoriaGroupOpen = async (e) => {
        e.stopPropagation();
        if (bussiness.CATEGORY != sCategoriaName) {
            var auxIdC = searchIdCategoria();
            //Enviar por PUT
            var options = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    {
                        'user_id': bussiness.USER_ID,
                        "bussiness_id": bussiness.BUSSINESS_ID,
                        'name': bussiness.DORSL,
                        'latitude': bussiness.LATITUDE,
                        'longitude': bussiness.LONGITUDE,
                        'bussiness_branch_id': auxIdC,
                        'address_first': bussiness.ADDRESS_FIRST,
                        'address_second': bussiness.ADDRESS_SECOND,
                        'postal_code': bussiness.POSTAL_CODE,
                        'city': bussiness.CITY,
                        'state': bussiness.STATE
                    })
            }
            try {
                const response = await fetch(`${urlApi}bussiness`, options);
                const json = await response.json();
                if (json['sucess']) {
                    setshowAlertConfirmation(true);
                    setTimeout(() => setshowAlertConfirmation(false), 3000); // ocultar alerta
                    setTimeout(() => window.location.reload(), 3000); 
                }
                else {
                    console.log(`No se pudo actulizar informacion de la empresa`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

            }
            catch (e) {
                return;
            }
        }
    };

    const ModHorarioGroupOpen = () => {
        setHorarioGroup(!horarioGroup);
    };

    const ModAddressGroupOpen = async (e) => {
        e.stopPropagation();

        if (bussiness.ADDRESS_FIRST != direccionUno
            || bussiness.ADDRESS_SECOND != direccionDos
            || bussiness.POSTAL_CODE != codigoPostal
            || bussiness.CITY != ciudad
            || bussiness.STATE != estado) {
            //Enviar por PUT
            var options = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    {
                        'user_id': bussiness.USER_ID,
                        "bussiness_id": bussiness.BUSSINESS_ID,
                        'name': bussiness.DORSL,
                        'latitude': bussiness.LATITUDE,
                        'longitude': bussiness.LONGITUDE,
                        'bussiness_branch_id': bussiness.BUSSINESS_BRANCH_ID,
                        'address_first': direccionUno,
                        'address_second': direccionDos,
                        'postal_code': codigoPostal,
                        'city': ciudad,
                        'state': estado
                    })
            }
            try {
                const response = await fetch(`${urlApi}bussiness`, options);
                const json = await response.json();
                if (json['sucess']) {
                    setshowAlertConfirmation(true);
                    setTimeout(() => setshowAlertConfirmation(false), 3000); // ocultar alerta
                    setTimeout(() => window.location.reload(), 3000); 
                }
                else {
                    console.log(`No se pudo actulizar informacion de la empresa`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

            }
            catch (e) {
                return;
            }
        }

    };

    const handleChange = evt => {
        const value = evt.target.value;
        setDireccionUno(value);
    };

    const handleChangeColonia = evt => {
        const value = evt.target.value;
        setDireccionDos(value);
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
            //Solicitar por GET
            try {
                const response = await fetch(`${urlApi}postalCode?d_codigo=${value}`);
                if (!response.ok) {
                    console.log(`Error getting getDaysInactive.`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const json = await response.json();
                console.log(json['data']);
                setEstado(json['data'][0].d_estado);
                setCiudad(json['data'][0].d_ciudad);
                var tempcita = [];
                for (let index = 0; index < json['data'][0].d_asentas.length; index++) {
                    var element = json['data'][0].d_asentas[index];
                    tempcita.push(element.d_asenta);
                }
                setColonias(tempcita);
            }
            catch (e) {
                return;
            }
            /* const json = fetchData("postalCode") ?? [];
            setEstado(json['data'][0].d_estado);
            setCiudad(json['data'][0].d_ciudad);
            var tempcita = [];
            for (let index = 0; index < json['data'][0].d_asentas.length; index++) {
                var element = json['data'][0].d_asentas[index];
                tempcita.push(element.d_asenta);
            }
            setColonias(tempcita); */
        }
        else {
            setCodigoPostal(value);
            setColonias(tempcita);
            setEstado('');
            setCiudad('');
        }
    };

    const handleChangeName = evt => {
        const value = evt.target.value;
        setName(value);
    };

    const handleChangeCategoria = evt => {
        const value = evt.target.value;
        setCategoriaName(value);
    };

    const searchIdCategoria = () => {
        for (var filName in categorias) {
            if (categorias[filName].NAME.toLowerCase() == sCategoriaName.toLowerCase()) {
                return categorias[filName].BUSSINESS_BRANCH_ID
            }
        }
    }

    useEffect(() => {
        const fData = async () => {
            //Solicitar por GET
            try {
                const response = await fetch(`${urlApi}bussinessId?bussiness_id=${businessId}`);
                if (response.status == 200) {
                    const json = await response.json();
                    setBussiness(json['data']);
                    setName(json['data']['DORSL']);
                    setCategoriaName(json['data']['CATEGORY']);
                    setCategoriaId(json['data']['BUSSINESS_BRANCH_ID']);
                    setDireccionUno(json['data']['ADDRESS_FIRST']);
                    setDireccionDos(json['data']['ADDRESS_SECOND']);
                    setCodigoPostal(json['data']['POSTAL_CODE']);
                    setCiudad(json['data']['CITY']);
                    setEstado(json['data']['STATE']);
                    //Solicitar por GET
                    try {
                        const response = await fetch(`${urlApi}schedule?bussinessId=${businessId}`);
                        if (response.status == 200) {
                            const json = await response.json();
                            setHorario(json['data']);
                            setExcludeTimes(selectableTimePredicate());
                            //Solicitar por GET
                            try {
                                const response = await fetch(`${urlApi}categoria`);
                                if (!response.ok) {
                                    console.log(`Error getting categoria.`);
                                    throw new Error(`HTTP error! status: ${response.status}`);
                                }
                                const json = await response.json();
                                setCategorias(json['data']);
                                setLoading(false);
                            }
                            catch (e) {
                                setLoading(false);
                                return;
                            }
                        } else {
                            console.log(`Error getting schedule.`);
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-600 to-orange-800 px-4">
            {showAlertConfirmation && (
                <div className="absolute top-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg text-sm animate-bounce z-50">
                    Es posible que este cambio tarde unos minutos en reflejarse en todos lados.
                </div>
            )}
            <div className="ViewUpdateUserContainer rounded-b-lg rounded-t-lg shadow-xl  w-full animate-fade-in-up">
                <div className='UpdateUserContainerPHOTO_bkg rounded-t-lg'>
                    <div className='UpdateUserContainerPHOTO'>
                        {
                            bussiness.PHOTO == null ? <UserCircleIcon /> :
                                <img id='imgPHOTO' src={'data:image/jpeg;base64,' + arrayBufferToBase64(bussiness.PHOTO['data'])} />
                        }
                    </div>
                </div>
                <div className='UpdateUserContainerGroupClic'>
                    <BuildingStorefrontIcon className='_color' />
                    <label>Nombre</label>
                    {nameGroup ? <ChevronDownIcon onClick={() => { setNameGroup(!nameGroup); }} /> :
                        <ChevronUpIcon onClick={() => { setNameGroup(!nameGroup); }} />}
                </div>
                <div className={nameGroup ? 'nameGroup active' : 'nameGroup'}>
                    <div className='GroupLabel'>
                        <label>Nombre de la empresa</label>
                        <input type="text" placeholder='Ingresa el nuevo nombre de tu empresa' value={name} onChange={handleChangeName} required />
                        <div class="bt-btn">
                            <button disabled={bussiness.DORSL != name ? false : true} onClick={ModNameGroupOpen}>Guardar</button>
                        </div>
                    </div>
                </div>
                <div className='UpdateUserContainerGroupClic'>
                    <Squares2X2Icon className='_color' /><label>Categoria</label>
                    {categoriaGroup ? <ChevronDownIcon onClick={() => { setCategoriaGroup(!categoriaGroup); }} /> :
                        <ChevronUpIcon onClick={() => { setCategoriaGroup(!categoriaGroup); }} />}
                </div>
                <div className={categoriaGroup ? 'nameGroup active' : 'nameGroup'}>
                    <div className='GroupLabel'>
                        <label>Categoría comercial</label>
                        <input list="optionsListCat" type="text" placeholder='Elige la categoría que describa mejor tu empresa' value={sCategoriaName} onChange={handleChangeCategoria} required />
                        <datalist id="optionsListCat">
                            {categorias.map((option, index) => (
                                <option key={index} value={option['NAME']} />
                            ))}
                        </datalist>
                        <span>Esto ayuda a que los clientes te encuentren si están buscando una empresa como la tuya.</span>
                        <div class="bt-btn">
                            <button disabled={bussiness.CATEGORY != sCategoriaName ? false : true} onClick={ModCategoriaGroupOpen}>Guardar</button>
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
                            <RegisterSchedule excludeTimes={_excludeTimes} businessId={bussiness.BUSSINESS_ID} setshowAlertConfirmation={setshowAlertConfirmation} /> :
                            <UpdateSchedule excludeTimes={_excludeTimes} horario={horario} businessId={bussiness.BUSSINESS_ID} setshowAlertConfirmation={setshowAlertConfirmation} />
                    }
                </div>
                <div className='UpdateUserContainerGroupClic'>
                    <MapPinIcon className='_color' /><label>Dirección</label>
                    {addressGroup ? <ChevronDownIcon onClick={() => { setAddressGroup(!addressGroup); }} /> :
                        <ChevronUpIcon onClick={() => { setAddressGroup(!addressGroup); }} />}
                </div>
                <div className={addressGroup ? 'nameGroup active' : 'nameGroup'}>
                    <div className='GroupLabel'>
                        <label>Código postal</label>
                        <input type="text" placeholder='Código postal' maxLength={5} value={codigoPostal} onChange={getCodigoPostal} />
                        <label className='sublabel' name="countCodigoPostal">{countCodigoPostal} / 5 </label>
                        <label>Estado</label>
                        <input className='--placeholder' type="text" placeholder='Estado' value={estado} disabled />
                        <label>Municipio/Ciudad</label>
                        <input className='--placeholder' type="text" placeholder='Municipio/Ciudad' value={ciudad} disabled />
                        <label>Colonia</label>
                        <input list="optionsList" type="text" placeholder='Colonia'
                            disabled={colonias.length == 0 ? true : false}
                            onChange={handleChangeColonia} value={direccionDos} required ></input>
                        <datalist id="optionsList">
                            {colonias.map((option, index) => (
                                <option key={index} value={option} />
                            ))}
                        </datalist>
                        <label>Calle / Número externo</label>
                        <input type="text" placeholder='Calle / Número externo' value={direccionUno} onChange={handleChange} />
                        <div class="bt-btn">
                            <button disabled={
                                bussiness.ADDRESS_FIRST != direccionUno
                                    || bussiness.ADDRESS_SECOND != direccionDos
                                    || bussiness.POSTAL_CODE != codigoPostal
                                    || bussiness.CITY != ciudad
                                    || bussiness.STATE != estado ? false : true} onClick={ModAddressGroupOpen}>Guardar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
}

export default ViewUpdateBusiness;