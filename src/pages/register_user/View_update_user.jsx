
// rrd imports
import { Form, useLoaderData, useNavigate } from 'react-router-dom';
import { fetchData } from "../../Wrapper.js";
import { useEffect, useState } from "react";
import { urlApi } from '../../styles/Constants.jsx';
import { toast } from "react-toastify";
// assets
import './View_update_user.css';
import UserIcon from "../../assets/e.png";
import PersonIcon from "../../assets/person.png";
import PhoneIcon from "../../assets/phone.png";
import MailIcon from "../../assets/mail.png";
import LockIcon from "../../assets/lock.png";
import CardMemberIcon from "../../assets/card_membership.png";
import Logout from "../../assets/exit.png";
import Loaging from '../../components/Loading.jsx';
import { ChevronDownIcon, ChevronUpIcon, EyeIcon, EyeSlashIcon, CameraIcon, CheckCircleIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/solid';

// loader
export function viewUpdateUserLoader() {
    const sCorreo = fetchData("correo");
    const sPassword = fetchData("pwd");
    return { sCorreo, sPassword };
}


export function ViewUpdateUser() {
    const navigate = useNavigate();
    const { sCorreo, sPassword } = useLoaderData();
    const [loading, setLoading] = useState(true);
    const [userRestApi, setUserRestApi] = useState();
    const [nameGroup, setNameGroup] = useState(true);
    const [infGroup, setInfGroup] = useState(true);
    const [mailGroup, setMailGroup] = useState(true);
    const [passGroup, setPassGroup] = useState(true);
    const [desAccGroup, setDesAccGroup] = useState(true);
    const [logoutGroup, setLogoutGroup] = useState(true);
    const [passView, setPassView] = useState(true);
    const [passType, setPassType] = useState('password');
    const [name, setName] = useState();
    const [lastname, setLastName] = useState();
    const [phone, setPhone] = useState();
    const [correo, setCorreo] = useState();
    const [contraseña, setContraseña] = useState();
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
    const togglePassView = () => {
        setPassView(!passView);
        setPassType(passView ? 'text' : 'password');
    };

    const ModNameGroupOpen = async (e) => {
        e.stopPropagation();
        if (userRestApi.first_name != name || userRestApi.last_name != lastname) {
            //Enviar por PUT
            var options = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    {
                        'email': userRestApi.email,
                        'first_name': name,
                        'last_name': lastname,
                        'session_type': userRestApi.session_type,
                        "phone": userRestApi.phone,
                        'password': userRestApi.password
                    })
            }
            try {
                const response = await fetch(`${urlApi}user?user_id=${userRestApi.USER_ID}`, options);
                const json = await response.json();
                if (json['sucess']) {
                    localStorage.removeItem('UserCitaFix');
                    getUser();
                    return toast.success(`Es posible que este cambio tarde unos minutos en reflejarse en todos lados`);
                }
                else {
                    console.log(`No se pudo actulizar informacion del usuario`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

            }
            catch (e) {
                return;
            }
        }
    };

    const handleChangeName = evt => {
        const value = evt.target.value;
        setName(value);
    };

    const handleChangeLastName = evt => {
        const value = evt.target.value;
        setLastName(value);
    };

    const ModInfGroupOpen = async (e) => {
        e.stopPropagation();
        if (userRestApi.phone != phone) {
            //Enviar por PUT
            var options = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    {
                        'email': userRestApi.email,
                        'first_name': userRestApi.first_name,
                        'last_name': userRestApi.last_name,
                        'session_type': userRestApi.session_type,
                        "phone": `+52 ${phone}`,
                        'password': userRestApi.password
                    })
            }
            try {
                const response = await fetch(`${urlApi}user?user_id=${userRestApi.USER_ID}`, options);
                const json = await response.json();
                if (json['sucess']) {
                    localStorage.removeItem('UserCitaFix');
                    getUser();
                    return toast.success(`Es posible que este cambio tarde unos minutos en reflejarse en todos lados`);
                }
                else {
                    console.log(`No se pudo actulizar informacion del usuario`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

            }
            catch (e) {
                return;
            }
        }
    };

    const handleChangePhone = evt => {
        const value = evt.target.value;
        if (!isNaN(+value)) {
            const isValidPhone = value.replace(/\D/g, '');
            if (isValidPhone.length < 10) {
                setPhone(value);
            }
            else {
                setPhone(`(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`);
            }
        }
        else {
            const isValidPhone = value.replace(/\D/g, '');
            setPhone(isValidPhone);
        }
    };

    const ModMailGroupOpen = async (e) => {
        e.stopPropagation();
        //ValidateEmail
        const isValidEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!isValidEmail.test(correo)) {
            setCorreo('');
        } else if (userRestApi.email != correo) {
            //Enviar por PUT
            var options = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    {
                        'email': correo,
                        'first_name': userRestApi.first_name,
                        'last_name': userRestApi.last_name,
                        'session_type': userRestApi.session_type,
                        "phone": userRestApi.phone,
                        'password': userRestApi.password
                    })
            }
            try {
                const response = await fetch(`${urlApi}user?user_id=${userRestApi.USER_ID}`, options);
                const json = await response.json();
                if (json['sucess']) {
                    localStorage.setItem("correo", JSON.stringify(correo));
                    localStorage.removeItem('UserCitaFix');
                    getUser();
                    return toast.success(`Es posible que este cambio tarde unos minutos en reflejarse en todos lados`);
                }
                else {
                    console.log(`No se pudo actulizar informacion del usuario`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

            }
            catch (e) {
                return;
            }
        }

    };

    const handleChangeCorreo = evt => {
        const value = evt.target.value;
        setCorreo(value);
    };

    const ModPassGroupOpen = async (e) => {
        e.stopPropagation();
        if (userRestApi.password != contraseña) {
            if (contraseña.length >= 6) {
                //Enviar por PUT
                var options = {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(
                        {
                            'email': userRestApi.email,
                            'first_name': userRestApi.first_name,
                            'last_name': userRestApi.last_name,
                            'session_type': userRestApi.session_type,
                            "phone": userRestApi.phone,
                            'password': contraseña
                        })
                }
                try {
                    const response = await fetch(`${urlApi}user?user_id=${userRestApi.USER_ID}`, options);
                    const json = await response.json();
                    if (json['sucess']) {
                        localStorage.setItem("pwd", JSON.stringify(contraseña));
                        localStorage.removeItem('UserCitaFix');
                        getUser();
                        return toast.success(`Es posible que este cambio tarde unos minutos en reflejarse en todos lados`);
                    }
                    else {
                        console.log(`No se pudo actulizar informacion del usuario`);
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                }
                catch (e) {
                    return;
                }
            }
        }
    };

    const handleChangeContraseña = evt => {
        const value = evt.target.value;
        setContraseña(value);
    };

    const getUser = async () => {
        const auxCorreo = fetchData("correo");
        const auxPassword = fetchData("pwd");
        //Solicitar por GET
        var options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-citafix-ps': auxPassword
            }
        }
        try {
            const response = await fetch(`${urlApi}usr?email=${auxCorreo}`, options);
            if (!response.ok) {
                console.log(`No se pudo obtener informacion del usuario`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const json = await response.json();
            localStorage.setItem("UserCitaFix", JSON.stringify(json['data']));
        }
        catch (e) {
            return;
        }
    };

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
            options.append('user_id', userRestApi.USER_ID);
            options.append('image', imagenFile);
            try {
                const response = await fetch(`${urlApi}photo`, {
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
            var options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'x-citafix-ps': sPassword
                }
            }
            try {
                const response = await fetch(`${urlApi}usr?email=${sCorreo}`, options);
                if (!response.ok) {
                    console.log(`No se pudo obtener informacion del usuario`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const json = await response.json();
                setUserRestApi(json['data']);
                setName(json['data']['first_name']);
                setLastName(json['data']['last_name']);
                setPhone(json['data']['phone']);
                setCorreo(json['data']['email']);
                setContraseña(json['data']['password']);
                setLoading(false);
            }
            catch (e) {
                setLoading(false);
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-600 to-orange-800 px-4">
            <div className="max-w-3xl mx-auto p-6 space-y-6 text-gray-800">
                {/* Imagen usuario */}
                <div className="flex justify-center mb-6">
                    {userRestApi.PHOTO.data.length == 0 ? (
                        <div className='relative inline-block'>
                            {imagen ? <img className="w-32 h-32 rounded-full object-cover border"
                                    src={imagen} /> :
                                <img className="w-32 h-32 rounded-full object-cover border bg-white"
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
                                src={imagen || 'data:image/jpeg;base64,' + arrayBufferToBase64(userRestApi.PHOTO.data)} />
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
                            <img src={UserIcon} alt="icon" className="w-5 h-5" />
                            <span className="font-semibold">Nombre</span>
                        </div>
                        {nameGroup ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronUpIcon className="w-5 h-5" />}
                    </div>
                    {!nameGroup && (
                        <div className="mt-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nombre</label>
                                <input className="w-full border px-4 py-2 rounded-md" type="text" placeholder='Ingresa tu nombre' value={name} onChange={handleChangeName} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Apellido</label>
                                <input className="w-full border px-4 py-2 rounded-md" type="text" placeholder='Ingresa tu apellido' value={lastname} onChange={handleChangeLastName} required />
                            </div>
                            <button className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 disabled:border-gray-50 disabled:bg-gray-200 disabled:text-gray-500"
                                disabled={userRestApi.first_name != name || userRestApi.last_name != lastname ? false : true}
                                onClick={ModNameGroupOpen}>Guardar</button>
                        </div>
                    )}
                </div>
                {/* Grupo Teléfono */}
                <div className="bg-white text-black shadow rounded-xl p-4">
                    <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggle(setInfGroup)}
                    >
                        <div className="flex items-center gap-2">
                            <img src={PhoneIcon} alt="icon" className="w-5 h-5" />
                            <span className="font-semibold">Información de contacto</span>
                        </div>
                        {infGroup ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronUpIcon className="w-5 h-5" />}
                    </div>
                    {!infGroup && (
                        <div className="mt-4 space-y-4">
                            <label className="block text-sm font-medium mb-1">Número celular</label>
                            <input type="tel" className="w-full border px-4 py-2 rounded-md" placeholder='+52...' pattern="([0-9]{3}) [0-9]{3}-[0-9]{4}" value={phone} onChange={handleChangePhone} />
                            <button className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 disabled:border-gray-50 disabled:bg-gray-200 disabled:text-gray-500"
                                disabled={userRestApi.phone != phone ? false : true} onClick={ModInfGroupOpen}>Guardar</button>
                        </div>
                    )}
                </div>
                {/* Grupo Correo */}
                <div className="bg-white text-black shadow rounded-xl p-4">
                    <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggle(setMailGroup)}
                    >
                        <div className="flex items-center gap-2">
                            <img src={MailIcon} alt="icon" className="w-5 h-5" />
                            <span className="font-semibold">Correo electrónico</span>
                        </div>
                        {mailGroup ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronUpIcon className="w-5 h-5" />}
                    </div>
                    {!mailGroup && (
                        <div className="mt-4">
                            <label className="block text-sm font-medium mb-1">Confirma tu correo</label>
                            <input type="email" className="w-full border px-4 py-2 rounded-md" placeholder='Usarás este dato cuando entres' value={correo} onChange={handleChangeCorreo} required />
                            <button className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 disabled:border-gray-50 disabled:bg-gray-200 disabled:text-gray-500"
                                disabled={userRestApi.email != correo ? false : true} onClick={ModMailGroupOpen}>Guardar</button>
                        </div>
                    )}
                </div>
                {/* Grupo Contraseña */}
                <div className="bg-white text-black shadow rounded-xl p-4">
                    <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggle(setPassGroup)}
                    >
                        <div className="flex items-center gap-2">
                            <img src={LockIcon} alt="icon" className="w-5 h-5" />
                            <span className="font-semibold">Contraseña</span>
                        </div>
                        {passGroup ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronUpIcon className="w-5 h-5" />}
                    </div>
                    {!passGroup && (
                        <div className="mt-4">
                            <label className="block text-sm font-medium mb-1">Confirma tu contraseña</label>
                            <div className="flex items-center border rounded-md px-2 py-1">
                                <input type={passType} className="flex-grow px-2 py-1 outline-none" placeholder='La contraseña debe tener al menos 6 caracteres' value={contraseña} onChange={handleChangeContraseña} required />
                                {passView ? (
                                    <EyeSlashIcon className="w-5 h-5 text-gray-500 cursor-pointer" onClick={togglePassView} />
                                ) : (
                                    <EyeIcon className="w-5 h-5 text-gray-500 cursor-pointer" onClick={togglePassView} />
                                )}
                            </div>
                            <button className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 disabled:border-gray-50 disabled:bg-gray-200 disabled:text-gray-500"
                                disabled={userRestApi.password != contraseña && contraseña.length >= 6 ? false : true} onClick={ModPassGroupOpen}>Guardar</button>
                        </div>
                    )}
                </div>
                {/* Grupo Desactivación */}
                <div className="bg-white text-black shadow rounded-xl p-4">
                    <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggle(setDesAccGroup)}
                    >
                        <div className="flex items-center gap-2">
                            <img src={CardMemberIcon} alt="icon" className="w-5 h-5" />
                            <span className="font-semibold">Desactivación</span>
                        </div>
                        {desAccGroup ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronUpIcon className="w-5 h-5" />}
                    </div>
                    {!desAccGroup && (
                        <div className="mt-4">
                            <label className="block text-sm text-red-600">Tu cuenta ha sido marcada para desactivarse temporalmente.</label>
                            <button className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                onClick={() => navigate("/deleteUser", { state: { userId: userRestApi.USER_ID } })} >Confirmar</button>
                        </div>
                    )}
                </div>
                {/* Grupo Cerrar sesión */}
                <div className="bg-white text-black shadow rounded-xl p-4">
                    <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggle(setLogoutGroup)}
                    >
                        <div className="flex items-center gap-2">
                            {/* <img src={Logout} alt="icon" className="w-5 h-5" /> */}
                            <ArrowRightStartOnRectangleIcon className='w-5 h-5 text-orange-600' />
                            <span className="font-semibold">Cerrar sesión</span>
                        </div>
                        {logoutGroup ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronUpIcon className="w-5 h-5" />}
                    </div>
                    {!logoutGroup && (
                        <div className="mt-4">
                            <Form method="post" action="/logout" >
                                <button type="submit" className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">
                                    Confirmar
                                </button>
                            </Form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ViewUpdateUser;