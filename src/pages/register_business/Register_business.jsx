// rrd imports
import { useLoaderData, useNavigate } from 'react-router-dom';
import { fetchData } from "../../Wrapper.js";
import { useEffect, useState } from "react";
// assets
import './Register_business.css';
import AutocompleteInput from '../../components/AutocompleteInput.jsx';

// loader
export function registerBusinessLoader() {
    const sCorreo = fetchData("correo");
    const sPassword = fetchData("pwd");
    return { sCorreo, sPassword };
}


export function RegisterBusiness() {
    const navigate = useNavigate();
    const { sCorreo, sPassword } = useLoaderData();

    const [sName, setName] = useState('');
    const [sNameError, setsNameError] = useState();
    const [sCategoriaName, setCategoriaName] = useState('');
    const [sCategoriaNameError, setCategoriaNameError] = useState();
    const [codigoPostal, setCodigoPostal] = useState('');
    const [estado, setEstado] = useState();
    const [ciudad, setCiudad] = useState();
    const [colonias, setColonias] = useState([]);
    const [direccionUno, setDireccionUno] = useState('');
    const [direccionDos, setDireccionDos] = useState('');
    const [countCodigoPostal, setCountCodigoPostal] = useState(0);

    function register(e) {
        //ValidateName
        if (sName === "") {
            setsNameError("Ingresa el nombre de tu empresa");
            return;
        }
        else {
            setsNameError("");
        }

        //ValidateLastName
        if (sCategoriaName === "") {
            setCategoriaNameError("Ingresa tu categoría comercial");
            return;
        }
        else {
            setCategoriaNameError("");
        }

    };

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
        else{
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

    const handleChange = evt => {
        const value = evt.target.value;
        setDireccionUno(value);
    };

    useEffect(() => {
        if (sCorreo === null && sPassword === null) {
            navigate("/");
        }
    }, []);
    return (
        <div className="RegisterBusinessContainer">
            <div className="container">
                <div className="title">
                    Agrega tu empresa <span>Es rápido y fácil</span>
                </div>
                <div className="registerForm">
                    <div className="registerForm-group">
                        <label>¿Cómo se llama tu empresa ?</label>
                        <input type="text" name="sName" placeholder="Nombre de la empresa" required onChange={(e) => setName(e.target.value)} />
                        {sNameError ? <label className='errorlabel' name="userNameError">{sNameError}</label> : <></>}
                    </div>
                    <div className="registerForm-group">
                        <label>Elige la categoría que describa mejor tu empresa</label>
                        <input type="text" name="sCategoriaName" placeholder="Categoría comercial" required onChange={(e) => setCategoriaName(e.target.value)} />
                        {sCategoriaNameError ? <label className='errorlabel' name="sCategoriaNameError"> {sCategoriaNameError}</label> : <></>}
                    </div>
                    <div className="registerForm-group">
                        <label>Código postal</label>
                        <input type="text" placeholder='Código postal' maxLength={5} onChange={getCodigoPostal} />
                        <label className='sublabel' name="countCodigoPostal">{countCodigoPostal} / 5 </label> 
                    </div>
                    <div className="registerForm-group">
                        <label>Estado</label>
                        <input className='--placeholder' type="text" placeholder='Estado' value={estado} disabled />
                    </div>
                    <div className="registerForm-group">
                        <label>Municipio/Ciudad</label>
                        <input className='--placeholder' type="text" placeholder='Municipio/Ciudad' value={ciudad} disabled />
                    </div>
                    <div className="registerForm-group">
                        <label>Colonia</label>
                        <AutocompleteInput data={colonias} placeholder={'Colonia'} setDireccionDos={setDireccionDos} />
                    </div>
                    <div className="registerForm-group">
                        <label>Calle / Número externo</label>
                        <input type="text" placeholder='Calle / Número externo'
                            onChange={handleChange} />
                    </div>
                    <div className="registerForm-button">
                        <button type="submit" onClick={register} > <span>Finalizar</span></button>
                    </div>
                </div>
            </div>
        </div>);
}

export default RegisterBusiness;