
// rrd imports
import { useLoaderData, useNavigate } from 'react-router-dom';
import { fetchData } from "../../Wrapper.js";
import { useEffect, useState } from "react";
// assets
import './View_update_user.css';
import UserIcon from "../../assets/e.png";
import PhoneIcon from "../../assets/phone.png";
import MailIcon from "../../assets/mail.png";
import LockIcon from "../../assets/lock.png";
import CardMemberIcon from "../../assets/card_membership.png";
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

    const [indexEmp, setIndexEmp] = useState('');
    const [nameGroup, setNameGroup] = useState(true);
    const [infGroup, setInfGroup] = useState(true);
    const [mailGroup, setMailGroup] = useState(true);
    const [passGroup, setPassGroup] = useState(true);
    const [desAccGroup, setDesAccGroup] = useState(true);
    const [passView, setPassView] = useState(true);
    const [passType, setPassType] = useState('password');

    const arrayBufferToBase64 = (buffer) => {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return btoa(binary);
    };

    const ModNameGroupOpen = () => {
        setNameGroup(!nameGroup);
    };

    const ModInfGroupOpen = () => {
        setInfGroup(!infGroup);
    };

    const ModMailGroupOpen = () => {
        setMailGroup(!mailGroup);
    };

    const ModPassGroupOpen = () => {
        setPassGroup(!passGroup);
    };

    const ModDesAccGroupOpen = () => {
        if (confirm('Quitar cuenta')) {
            setDesAccGroup(true);
        }
        else {
            setDesAccGroup(false);
        }
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


    useEffect(() => {
        if (sCorreo === null && sPassword === null) {
            navigate("/");
        }
    }, []);
    return (
        <div className="ViewUpdateUserContainer">
            <div className='UpdateUserContainerPHOTO_bkg'>
                <div className='UpdateUserContainerPHOTO'>
                    {
                        indexEmp === '' ? <UserCircleIcon /> :
                            <img src={'data:image/jpeg;base64,' + arrayBufferToBase64(indexEmp.data)} />
                    }
                </div>
            </div>
            <div className='UpdateUserContainerGroupClic'>
                <img src={UserIcon} /><label>Nombre</label>
                {nameGroup ? <ChevronDownIcon onClick={ModNameGroupOpen} /> :
                    <ChevronUpIcon onClick={ModNameGroupOpen} />}
            </div>
            <div className={nameGroup ? 'nameGroup active' : 'nameGroup'}>
                <div className='GroupLabel'>
                    <label>Nombre</label>
                    <input type="text" />
                </div>
                <div className='GroupLabel'>
                    <label>Apellido</label>
                    <input type="text" />
                    <div class="bt-btn">
                        <button>Guardar</button>
                    </div>
                </div>

            </div>
            <div className='UpdateUserContainerGroupClic'>
                <img src={PhoneIcon} />
                <label>Información de contacto</label>
                {infGroup ? <ChevronDownIcon onClick={ModInfGroupOpen} /> :
                    <ChevronUpIcon onClick={ModInfGroupOpen} />}
            </div>
            <div className={infGroup ? 'infGroup active' : 'infGroup'}>
                <div className='GroupLabel'>
                    <label>Agrega un número de celular</label>
                    <input type="tel" />
                    <span>{`Mexico (+52)`}</span>
                    <div class="bt-btn">
                        <button>Guardar</button>
                    </div>
                </div>
            </div>
            <div className='UpdateUserContainerGroupClic'>
                <img src={MailIcon} />
                <label>Correo electrónico</label>
                {mailGroup ? <ChevronDownIcon onClick={ModMailGroupOpen} /> :
                    <ChevronUpIcon onClick={ModMailGroupOpen} />}
            </div>
            <div className={mailGroup ? 'mailGroup active' : 'mailGroup'}>
                <div className='GroupLabel'>
                    <label>Confirma tu correo electrónico</label>
                    <input type="mail" />
                    <div class="bt-btn">
                        <button>Guardar</button>
                    </div>
                </div>
            </div>
            <div className='UpdateUserContainerGroupClic'>
                <img src={LockIcon} />
                <label>Contraseña</label>
                {passGroup ? <ChevronDownIcon onClick={ModPassGroupOpen} /> :
                    <ChevronUpIcon onClick={ModPassGroupOpen} />}
            </div>
            <div className={passGroup ? 'passGroup active' : 'passGroup'}>
                <div className='GroupLabel'>
                    <label>Confirma tu contraseña</label>
                    <div className="searchicon">
                        <input type={passType} />
                        {passView ? <EyeSlashIcon onClick={ModPassViewOpen} /> :
                            <EyeIcon onClick={ModPassViewOpen} />}
                    </div>
                    
                    <div class="bt-btn">
                        <button>Guardar</button>
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
                </div>
            </div>
        </div>);
}

export default ViewUpdateUser;
