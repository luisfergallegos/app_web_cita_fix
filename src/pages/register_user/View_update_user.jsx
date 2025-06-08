
// rrd imports
import { useLoaderData, useNavigate } from 'react-router-dom';
import { fetchData } from "../../Wrapper.js";
import { useEffect, useState } from "react";
import { urlApi } from '../../styles/Constants.jsx';
import { toast } from "react-toastify";
// assets
import './View_update_user.css';
import UserIcon from "../../assets/e.png";
import PhoneIcon from "../../assets/phone.png";
import MailIcon from "../../assets/mail.png";
import LockIcon from "../../assets/lock.png";
import CardMemberIcon from "../../assets/card_membership.png";
import Loaging from '../../components/Loading.jsx';
import { ChevronDownIcon, ChevronUpIcon, EyeIcon, EyeSlashIcon, UserCircleIcon } from '@heroicons/react/24/solid';

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
    const [indexEmp, setIndexEmp] = useState('');
    const [nameGroup, setNameGroup] = useState(true);
    const [infGroup, setInfGroup] = useState(true);
    const [mailGroup, setMailGroup] = useState(true);
    const [passGroup, setPassGroup] = useState(true);
    const [desAccGroup, setDesAccGroup] = useState(true);
    const [passView, setPassView] = useState(true);
    const [passType, setPassType] = useState('password');
    const [name, setName] = useState();
    const [lastname, setLastName] = useState();
    const [phone, setPhone] = useState();
    const [correo, setCorreo] = useState();
    const [contraseña, setContraseña] = useState();

    const arrayBufferToBase64 = (buffer) => {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return btoa(binary);
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

    const ModDesAccGroupOpen = () => {
        setDesAccGroup(!desAccGroup);
    };

    const ModPassViewOpen = () => {
        if (passView) {
            setPassView(false);
            setPassType('text');
        }
        else {
            setPassView(true);
            setPassType('password');
        }
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
            <div className="ViewUpdateUserContainer rounded-b-lg rounded-t-lg shadow-xl  w-full animate-fade-in-up">
                <div className='UpdateUserContainerPHOTO_bkg rounded-t-lg'>
                    <div className='UpdateUserContainerPHOTO'>
                        {
                            userRestApi.PHOTO.data.length == 0 ? <UserCircleIcon /> :
                                <img src={'data:image/jpeg;base64,' + arrayBufferToBase64(userRestApi.PHOTO.data)} />
                        }
                    </div>
                </div>
                <div className='UpdateUserContainerGroupClic'>
                    <img src={UserIcon} /><label>Nombre</label>
                    {nameGroup ? <ChevronDownIcon onClick={() => { setNameGroup(!nameGroup); }} /> :
                        <ChevronUpIcon onClick={() => { setNameGroup(!nameGroup); }} />}
                </div>
                <div className={nameGroup ? 'nameGroup active' : 'nameGroup'}>
                    <div className='GroupLabel'>
                        <label>Nombre</label>
                        <input type="text" placeholder='Ingresa tu nombre' value={name} onChange={handleChangeName} required />
                    </div>
                    <div className='GroupLabel'>
                        <label>Apellido</label>
                        <input type="text" placeholder='Ingresa tu apellido' value={lastname} onChange={handleChangeLastName} required />
                        <div class="bt-btn">
                            <button disabled={userRestApi.first_name != name || userRestApi.last_name != lastname ? false : true} onClick={ModNameGroupOpen}>Guardar</button>
                        </div>
                    </div>

                </div>
                <div className='UpdateUserContainerGroupClic'>
                    <img src={PhoneIcon} />
                    <label>Información de contacto</label>
                    {infGroup ? <ChevronDownIcon onClick={() => { setInfGroup(!infGroup); }} /> :
                        <ChevronUpIcon onClick={() => { setInfGroup(!infGroup); }} />}
                </div>
                <div className={infGroup ? 'infGroup active' : 'infGroup'}>
                    <div className='GroupLabel'>
                        <label>Agrega un número de celular</label>
                        <input type="tel" placeholder='Ingresa tu número de teléfono' pattern="([0-9]{3}) [0-9]{3}-[0-9]{4}" value={phone} onChange={handleChangePhone} />
                        <span>{`Mexico (+52)`}</span>
                        <div class="bt-btn">
                            <button disabled={userRestApi.phone != phone ? false : true} onClick={ModInfGroupOpen}>Guardar</button>
                        </div>
                    </div>
                </div>
                <div className='UpdateUserContainerGroupClic'>
                    <img src={MailIcon} />
                    <label>Correo electrónico</label>
                    {mailGroup ? <ChevronDownIcon onClick={() => { setMailGroup(!mailGroup); }} /> :
                        <ChevronUpIcon onClick={() => { setMailGroup(!mailGroup); }} />}
                </div>
                <div className={mailGroup ? 'mailGroup active' : 'mailGroup'}>
                    <div className='GroupLabel'>
                        <label>Confirma tu correo electrónico</label>
                        <input type="mail" placeholder='Usarás este dato cuando entres' value={correo} onChange={handleChangeCorreo} required />
                        <div class="bt-btn">
                            <button disabled={userRestApi.email != correo ? false : true} onClick={ModMailGroupOpen}>Guardar</button>
                        </div>
                    </div>
                </div>
                <div className='UpdateUserContainerGroupClic'>
                    <img src={LockIcon} />
                    <label>Contraseña</label>
                    {passGroup ? <ChevronDownIcon onClick={() => { setPassGroup(!passGroup); }} /> :
                        <ChevronUpIcon onClick={() => { setPassGroup(!passGroup); }} />}
                </div>
                <div className={passGroup ? 'passGroup active' : 'passGroup'}>
                    <div className='GroupLabel'>
                        <label>Confirma tu contraseña</label>
                        <div className="searchicon">
                            <input type={passType} placeholder='La contraseña debe tener al menos 6 caracteres' value={contraseña} onChange={handleChangeContraseña} required />
                            {passView ? <EyeSlashIcon onClick={ModPassViewOpen} /> :
                                <EyeIcon onClick={ModPassViewOpen} />}
                        </div>
                        <div class="bt-btn">
                            <button disabled={userRestApi.password != contraseña && contraseña.length >= 6 ? false : true} onClick={ModPassGroupOpen}>Guardar</button>
                        </div>
                    </div>
                </div>
                <div className='UpdateUserContainerGroupClic'>
                    <img src={CardMemberIcon} />
                    <label>Desactivación</label>
                    {desAccGroup ? <ChevronDownIcon onClick={ModDesAccGroupOpen} /> :
                        <ChevronUpIcon onClick={ModDesAccGroupOpen} />}
                </div>
                <div className={desAccGroup ? 'desAccGroup active' : 'desAccGroup'}>
                    <div className='GroupLabel'>
                        <label>Desactiva tu cuenta durante un tiempo</label>
                        <div class="bt-btn">
                            <button onClick={() => {
                                localStorage.removeItem("correo");
                                localStorage.removeItem("pwd");
                                window.open('https://www.plannersday.com/borrar-cuenta');
                                window.location.reload();
                            }} >Borrar</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>);
}

export default ViewUpdateUser;