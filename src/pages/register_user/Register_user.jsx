import { useState } from "react";
import { toast } from "react-toastify";
// library
import { LockClosedIcon, UserIcon, ChevronLeftIcon } from "@heroicons/react/24/solid";

// rrd imports
import { useNavigate, NavLink } from "react-router-dom";
import "./Register_user.css";


const registerUser = () => {
    const [userEmail, setUserEmail] = useState('');
    const [userEmailError, setUserEmailError] = useState();
    const [userPass, setUserPass] = useState('');
    const [userPassError, setUserPassError] = useState();
    const [userName, setUserName] = useState('');
    const [userNameError, setUserNameError] = useState();
    const [userLastName, setUserLastName] = useState('');
    const [userLastNameError, setUserLastNameError] = useState();

    const navigate = useNavigate();

    function register(e) {

        //ValidateName
        if (userName === "") {
            setUserNameError("Ingresa tu nombre");
            return;
        }
        else {
            setUserNameError("");
        }

        //ValidateLastName
        if (userLastName === "") {
            setUserLastNameError("Ingresa tu apellido");
            return;
        }
        else {
            setUserLastNameError("");
        }

        //ValidateEmail
        const isValidEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (userEmail === "") {
            setUserEmailError("Usarás este dato cuando entres");
            return;
        } else if (!isValidEmail.test(userEmail)) {
            setUserEmailError("Ingresa un correo electrónico válido");
            return;
        }
        else {
            setUserEmailError("");
        }

        //ValidatePass
        if (userPass === "") {
            setUserPassError("Introduce una combinación de al menos 6 números, letras y signos de puntuación");
            return;
        } else if (userPass.length < 6) {
            setUserPassError("La contraseña debe tener al menos 6 caracteres");
            return;
        } else {
            setUserPassError("");
        }

        try {
            /* restDatasource.registerUser(
                sCorreo,
                sNombre,
                sApellido,
                'Movil',
                'user',
                sPassword); */
            console.log("correo " + userEmail);
            console.log("name " + userName);
            console.log("lastName " + userLastName);
            console.log("Web ");
            console.log("user ");
            console.log("pwd " + userPass);
            navigate(`/home`, { replace: true }); // <-- redirect
            toast.success("Registro completo");
            return;
        }
        catch (e) {
            throw new Error("There was a problem creating your account.");
        }
    }


    return (
        <div id="container">
            <nav>
                <NavLink to="/" aria-label="Back">
                    <div id="Linkicon"><ChevronLeftIcon /></div>                    
                    <span>Regresar</span>
                </NavLink>
            </nav>

            <div className="container">
                <div className="title">
                    Registrarte <span>Es rápido y fácil</span>
                </div>
                <div className="registerForm">
                    <div className="registerForm-group">

                        <input type="text" name="sName" placeholder="Nombre" required onChange={(e) => setUserName(e.target.value)} />
                        {userNameError ? <label name="userNameError">{userNameError}</label> : <></>}
                    </div>
                    <div className="registerForm-group">

                        <input type="text" name="sApellido" placeholder="Apellido" required onChange={(e) => setUserLastName(e.target.value)} />
                        {userLastNameError ? <label name="userLastNameError"> {userLastNameError}</label> : <></>}
                    </div>
                    <div className="registerForm-group">

                        <input type="text" name="sCorreo" placeholder="Correo electrónico" required onChange={(e) => setUserEmail(e.target.value)} />
                        {userEmailError ? <label name="userEmailError"><UserIcon width={20} /> {userEmailError}</label> : <></>}
                    </div>
                    <div className="registerForm-group">

                        <input type="password" name="sPassword" placeholder="Contraseña" required onChange={(e) => setUserPass(e.target.value)} />
                        {userPassError ? <label name="userPassError"><LockClosedIcon width={20} /> {userPassError}</label> : <></>}
                    </div>
                    <div className="registerForm-button">
                        <button type="submit" onClick={register} > <span>Registrarte</span></button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default registerUser;