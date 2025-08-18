// rrd imports
import { useLoaderData, useNavigate } from 'react-router-dom';
import { fetchData } from "../../Wrapper.js";
import { useEffect, useState } from "react";
// assets
import '../register_user/View_update_user.css';
import Loaging from '../../components/Loading.jsx';
import { urlApi } from "../../styles/Constants.jsx";
import PersonIcon from "../../assets/business.png";

import { BuildingOfficeIcon, ChevronDownIcon, ChevronUpIcon, ClockIcon, MapPinIcon, Squares2X2Icon, UserCircleIcon, CameraIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
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
    const [subCategorias, setsubCategorias] = useState([]);
    const [categoriaId, setCategoriaId] = useState('');
    const [sCategoriaName, setCategoriaName] = useState('');
    const [sSubCategoriaName, setSubCategoriaName] = useState('');

    const [showAlertConfirmation, setshowAlertConfirmation] = useState(false);
    const [imagen, setImagen] = useState(null);
    const [imagenFile, setImagenFile] = useState(null);
    const [bimagen, setbImagen] = useState(true);
    const [bAcceder, setbAcceder] = useState(true);


    const arrayBufferToBase64 = (buffer) => {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return btoa(binary);
    };

    const toggle = (setter) => setter((prev) => !prev);

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
        for (var filName in categorias) {
            if (categorias[filName].name.toLowerCase() == value.toLowerCase()) {
                setsubCategorias(categorias[filName].subcategoria);
            }
        }
    };

    const handleChangeSubCategoria = evt => {
        const value = evt.target.value;
        setSubCategoriaName(value);
    };

    const searchIdCategoria = () => {
        for (var filName in subCategorias) {
            if (subCategorias[filName].subname.toLowerCase() == sSubCategoriaName.toLowerCase()) {
                setSubCategoriaName(subCategorias[filName].subname);
                setCategoriaId(subCategorias[filName].id);
            }
        }
    }

    const handleChangeImagen = evt => {
        const file = evt.target.files[0];
        if (file) {
            setImagenFile(file);
            setImagen(URL.createObjectURL(file));
            setbImagen(false);
        }
    }

    const handleSendImagen = async evt => {
        if (bAcceder) {
            setbAcceder(false);
            //Enviar al backend
            var options = new FormData();
            options.append('bussiness_id', bussiness.BUSSINESS_ID);
            options.append('image', imagenFile);
            try {
                const response = await fetch(`${urlApi}photoBussiness`, {
                    method: "PUT",
                    body: options,
                });
                const json = await response.json();
                if (json['sucess'] == false) {
                    setbAcceder(true);
                    setbImagen(true);
                    setImagenFile(null);
                    setImagen(null);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                else {
                    setbAcceder(true);
                    setbImagen(true);
                }
            }
            catch (e) {
                setbAcceder(true);
                setbImagen(true);
                setImagenFile(null);
                setImagen(null);
                return;
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
                    setSubCategoriaName(json['data']['SUBCATEGORY']);
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
                                var tempCategoria = [];
                                for (const key in json['data']) {
                                    if (json['data'].hasOwnProperty(key)) {
                                        const element = json['data'][key];
                                        const values = Object.values(element.subcategoria);
                                        var tempSub = [];
                                        values.map((subCat) => {
                                            tempSub.push({
                                                id: subCat.id,
                                                subname: subCat.subname ?? ''
                                            });
                                        });
                                        tempCategoria.push({
                                            name: element.name,
                                            subcategoria: tempSub
                                        });
                                    }
                                }
                                setCategorias(tempCategoria);
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
            <div className="max-w-3xl mx-auto mt-20 p-6 space-y-6 text-gray-800">
                {/* Imagen usuario */}
                <div className="flex justify-center mb-6">
                    {bussiness.PHOTO == null ? (
                        <div className='relative inline-block'>
                            {imagen ? <img className="w-32 h-32 rounded-full object-cover border"
                                src={imagen} /> :
                                <img className="w-32 h-32 rounded-full object-cover border"
                                    src={PersonIcon} />}
                            {/* Icono de la imagen */}
                            {bimagen ?
                                <label className='absolute bottom-1 right-1 bg-orange-500 rounded-full p-2 cursor-pointer hover:bg-orange-600 transition'>
                                    <CameraIcon className="h-5 w-5 text-white" />
                                    <input type="file" accept="image/*" className='hidden' onChange={handleChangeImagen} />
                                </label> : bAcceder ?
                                    <label className='absolute bottom-1 right-1 bg-orange-500 rounded-full p-2 cursor-pointer hover:bg-orange-600 transition'
                                        onClick={handleSendImagen}>
                                        <CheckCircleIcon className="h-5 w-5 text-white" />
                                    </label> :
                                    <label className='absolute bottom-1 right-1 bg-orange-500 rounded-full p-2'>
                                        <div className='circlePh' ></div>
                                    </label>}
                        </div>
                    ) : (
                        <div className='relative inline-block'>
                            <img className="w-32 h-32 rounded-full object-cover border"
                                src={imagen || 'data:image/jpeg;base64,' + arrayBufferToBase64(bussiness.PHOTO['data'])} />
                            {/* Icono de la imagen */}
                            {bimagen ?
                                <label className='absolute bottom-1 right-1 bg-orange-500 rounded-full p-2 cursor-pointer hover:bg-orange-600 transition'>
                                    <CameraIcon className="h-5 w-5 text-white" />
                                    <input type="file" accept="image/*" className='hidden' onChange={handleChangeImagen} />
                                </label> : bAcceder ?
                                    <label className='absolute bottom-1 right-1 bg-orange-500 rounded-full p-2 cursor-pointer hover:bg-orange-600 transition'
                                        onClick={handleSendImagen}>
                                        <CheckCircleIcon className="h-5 w-5 text-white" />
                                    </label> :
                                    <label className='absolute bottom-1 right-1 bg-orange-500 rounded-full p-2'>
                                        <div className='circlePh' ></div>
                                    </label>}

                        </div>
                    )}
                </div>
                {/* Grupo Nombre */}
                <div className="bg-white text-black shadow rounded-xl p-4">
                    <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggle(setNameGroup)}
                    >
                        <div className="flex items-center gap-2">
                            <BuildingOfficeIcon className='w-5 h-5 text-orange-600' />
                            <span className="font-semibold">Nombre</span>
                        </div>
                        {nameGroup ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronUpIcon className="w-5 h-5" />}
                    </div>
                    {!nameGroup && (
                        <div className="mt-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nombre de la empresa</label>
                                <input className="w-full border px-4 py-2 rounded-md" type="text" placeholder='Ingresa el nuevo nombre de tu empresa' value={name} onChange={handleChangeName} required />
                            </div>
                            <button className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 disabled:border-gray-50 disabled:bg-gray-200 disabled:text-gray-500"
                                disabled={bussiness.DORSL != name ? false : true}
                                onClick={ModNameGroupOpen}>Guardar</button>
                        </div>
                    )}
                </div>
                {/* Grupo Categoria */}
                <div className="bg-white text-black shadow rounded-xl p-4">
                    <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggle(setCategoriaGroup)}
                    >
                        <div className="flex items-center gap-2">
                            <Squares2X2Icon className='w-5 h-5 text-orange-600' />
                            <span className="font-semibold">Categoria</span>
                        </div>
                        {categoriaGroup ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronUpIcon className="w-5 h-5" />}
                    </div>
                    {!categoriaGroup && (
                        <div className="mt-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Giro de tu empresa</label>
                                <input className="w-full border px-4 py-2 rounded-md" list="optionsListCat" type="text" placeholder='Giro de empresa'
                                    value={sCategoriaName} onChange={handleChangeCategoria} required ></input>
                                <datalist id="optionsListCat">
                                    {categorias.map((option, index) => (
                                        <option key={index} value={option.name} />
                                    ))}
                                </datalist>
                                <label className="block text-sm font-medium mb-1">Categoría comercial</label>
                                <input className="w-full border px-4 py-2 rounded-md" list="optionsListSubCat" type="text" placeholder='Categoría comercial'
                                    value={sSubCategoriaName} onChange={handleChangeSubCategoria} required ></input>
                                <datalist id="optionsListSubCat">
                                    {subCategorias.map((option, index) => (
                                        <option key={index} value={option.subname} />
                                    ))}
                                </datalist>
                                <span>Esto ayuda a que los clientes te encuentren si están buscando una empresa como la tuya.</span>
                            </div>
                            <button className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 disabled:border-gray-50 disabled:bg-gray-200 disabled:text-gray-500"
                                disabled={bussiness.CATEGORY != sCategoriaName ? false : true}
                                onClick={ModCategoriaGroupOpen}>Guardar</button>
                        </div>
                    )}
                </div>
                {/* Grupo Horario */}
                <div className="bg-white text-black shadow rounded-xl p-4">
                    <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggle(ModHorarioGroupOpen)}
                    >
                        <div className="flex items-center gap-2">
                            <ClockIcon className='w-5 h-5 text-orange-600' />
                            {horario.length == 0 ? <span className="font-semibold">Agrega tu horario</span> : <span className="font-semibold">Actualización de horario</span>}
                        </div>
                        {horarioGroup ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronUpIcon className="w-5 h-5" />}
                    </div>
                    {!horarioGroup && (
                        horario.length == 0 ?
                            <RegisterSchedule excludeTimes={_excludeTimes} businessId={bussiness.BUSSINESS_ID} setshowAlertConfirmation={setshowAlertConfirmation} /> :
                            <UpdateSchedule excludeTimes={_excludeTimes} horario={horario} businessId={bussiness.BUSSINESS_ID} setshowAlertConfirmation={setshowAlertConfirmation} />

                    )}
                </div>
                {/* Grupo Direccion */}
                <div className="bg-white text-black shadow rounded-xl p-4">
                    <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggle(setAddressGroup)}
                    >
                        <div className="flex items-center gap-2">
                            <MapPinIcon className='w-5 h-5 text-orange-600' />
                            <span className="font-semibold">Dirección</span>
                        </div>
                        {addressGroup ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronUpIcon className="w-5 h-5" />}
                    </div>
                    {!addressGroup && (
                        <div className="mt-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Código postal</label>
                                <input className="w-full border px-4 py-2 rounded-md" type="text" placeholder='Código postal' maxLength={5} value={codigoPostal} onChange={getCodigoPostal} />
                                <label className='sublabel' name="countCodigoPostal">{countCodigoPostal} / 5 </label>
                                <label className="block text-sm font-medium mb-1">Estado</label>
                                <input className="w-full border px-4 py-2 rounded-md --placeholder" type="text" placeholder='Estado' value={estado} disabled />
                                <label className="block text-sm font-medium mb-1">Municipio/Ciudad</label>
                                <input className="w-full border px-4 py-2 rounded-md --placeholder" type="text" placeholder='Municipio/Ciudad' value={ciudad} disabled />
                                <label className="block text-sm font-medium mb-1">Colonia</label>
                                <input className="w-full border px-4 py-2 rounded-md" list="optionsList" type="text" placeholder='Colonia'
                                    disabled={colonias.length == 0 ? true : false}
                                    onChange={handleChangeColonia} value={direccionDos} required ></input>
                                <datalist id="optionsList">
                                    {colonias.map((option, index) => (
                                        <option key={index} value={option} />
                                    ))}
                                </datalist>
                                <label className="block text-sm font-medium mb-1">Calle / Número externo</label>
                                <input className="w-full border px-4 py-2 rounded-md" type="text" placeholder='Calle / Número externo' value={direccionUno} onChange={handleChange} />
                            </div>

                            <button className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 disabled:border-gray-50 disabled:bg-gray-200 disabled:text-gray-500"
                                disabled={
                                    bussiness.ADDRESS_FIRST != direccionUno
                                        || bussiness.ADDRESS_SECOND != direccionDos
                                        || bussiness.POSTAL_CODE != codigoPostal
                                        || bussiness.CITY != ciudad
                                        || bussiness.STATE != estado ? false : true} onClick={ModAddressGroupOpen}>Guardar</button>
                        </div>
                    )}
                </div>
            </div>
        </div>);
}

export default ViewUpdateBusiness;