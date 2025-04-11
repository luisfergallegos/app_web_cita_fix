import React from "react";
// library
import { toast } from "react-toastify";
import './SignIn.css';
import { Link, useNavigate } from "react-router-dom";
// rrd imports
import { fetchData } from "../../Wrapper.js";


function SingIn() {
    const navigate = useNavigate();
    const [state, setState] = React.useState({
        sCorreo: "",
        sPassword: ""
    });
    const handleChange = evt => {
        const value = evt.target.value;
        setState({
            ...state,
            [evt.target.name]: value
        });
    };

    const handleOnSubmit = evt => {
        evt.preventDefault();
        const { sCorreo, sPassword } = state;
        //alert(`You are login with email: ${sCorreo} and password: ${sPassword}`);
        console.log("correo " + sCorreo);
        console.log("pwd " + sPassword);
        localStorage.setItem("correo", JSON.stringify(sCorreo));
        localStorage.setItem("pwd", JSON.stringify(sPassword));
        //obtener nombre
        const sUserCitaFix = fetchData("UserCitaFix") ?? [];
        var userName = sUserCitaFix['first_name'];
        navigate(`/`,{ replace: true }); // <-- redirect
        return toast.success(`Bienvenido, ${userName}`);

    };
    function signInAction() {
        /* if (confirm("Delete user and all data?")) {
            
        } */
        const { sCorreo, sPassword } = state;
        //ValidateEmail
        const isValidEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (sCorreo === "") {
            alert("Por favor ingresa tu correo electrónico");
            return;
        } else if (!isValidEmail.test(sCorreo)) {
            alert("Ingresa un correo electrónico válido");
            return;
        }
        else {
            console.log("correo " + sCorreo);
            return toast.success("Información enviada!");
        }

    };

    return (
        <>
            <div className="form-containerLogin sign-in-container">
                <form onSubmit={handleOnSubmit}>
                    <h1>Hola</h1>
                    <span>Inicia tu sesión</span>
                    <p className="spacing">Ingresa los siguientes datos</p>
                    <input type="email" placeholder="Correo electrónico" name="sCorreo" required value={state.sCorreo}
                        onChange={handleChange} />
                    <input type="password" placeholder="Contraseña" name="sPassword" required value={state.sPassword}
                        onChange={handleChange} minLength={6} />
                    <a onClick={signInAction} >Olvidé mi contraseña</a>
                    <div className="loginForm-button">
                        <button>ENTRAR</button>
                    </div>
                    <p>¿No tienes cuenta? | <Link to="registerUser" className="Link" >Regístrate</Link></p>{/* <a href="#" className="a second">Regístrate</a> </p>*/}
                </form>
            </div>
        </>
    );
}

export default SingIn;

// // rrd imports
// import { Form, Link, useNavigate } from "react-router-dom"

// // library
// import { LockClosedIcon, UserIcon } from "@heroicons/react/24/solid";

// /* import { useLoaderData } from "react-router-dom";
// import { fetchData } from "../../Wrapper"; */
// import { toast } from "react-toastify";
// import { useState } from "react";
// // assents
// import illustration from "../../assets/menu.png";

// import './SignIn.css';


// function SignIn() {
//     const [userEmail, setUserEmail] = useState('');
//     const [userEmailError, setUserEmailError] = useState();
//     const [userPass, setUserPass] = useState('');
//     const [userPassError, setUserPassError] = useState();

//     const navigate = useNavigate();


//     function signInAction() {
//         /* if (confirm("Delete user and all data?")) {
            
//         } */
//         //ValidateEmail
//         const isValidEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

//         if (userEmail === "") {
//             setUserEmailError("Por favor ingresa tu correo electrónico");
//             return;
//         } else if (!isValidEmail.test(userEmail)) {
//             setUserEmailError("Ingresa un correo electrónico válido");
//             return;
//         }
//         else {
//             setUserEmailError("");
//             console.log("correo " + userEmail);
//             return toast.success("Información enviada!");
//         }

//     }
//     function authenticate(e) {

//         //ValidateEmail
//         const isValidEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

//         if (userEmail === "") {
//             setUserEmailError("Por favor ingresa tu correo electrónico");
//             return;
//         } else if (!isValidEmail.test(userEmail)) {
//             setUserEmailError("Ingresa un correo electrónico válido");
//             return;
//         }
//         else {
//             setUserEmailError("");
//         }

//         //ValidatePass
//         if (userPass === "") {
//             setUserPassError("La contraseña debe tener al menos 6 caracteres");
//             return;
//         } else if (userPass.length < 6) {
//             setUserPassError("La contraseña debe tener al menos 6 caracteres");
//             return;
//         } else {
//             setUserPassError("");
//         }
//         try {
//             console.log("correo " + userEmail);
//             console.log("pwd " + userPass);
//             localStorage.setItem("correo", JSON.stringify(userEmail));
//             localStorage.setItem("pwd", JSON.stringify(userPass));
//             //obtener nombre
//             var userName = 'prueba';
//             navigate(`/`, { replace: true }); // <-- redirect
//             toast.success(`Bienvenido, ${userName}`);
//             return;
//         }
//         catch (e) {
//             throw new Error("There was a problem creating your account.");
//         }
//     }
//     return (
//         <div>
//             <div className="SignInContainer">
//                 <div className="title">
//                     <h1>
//                         Hola <span>Inicia tu sesión</span>
//                     </h1>
//                 </div>
//                 <div className="loginForm">
//                     <p>Ingresa los siguientes datos</p>
//                     <div className="flex-lg">
//                         <input type="text" name="sCorreo" placeholder="Ingresa tu correo electrónico" autoComplete="given-name" required onChange={(e) => setUserEmail(e.target.value)} />
//                         {userEmailError ? <label name="userEmailError"><UserIcon width={15} /> {userEmailError}</label> : <></>}
//                     </div>
//                     <div className="flex-lg">
//                         <input type="password" name="sPassword" placeholder="Contraseña" required onChange={(e) => setUserPass(e.target.value)} />
//                         {userPassError ? <label name="userPassError"><LockClosedIcon width={15} /> {userPassError}</label> : <></>}
//                     </div>
//                     {/* <label htmlFor="lostPass" onClick={signInAction}>Olvidé mi contraseña</label> */}
//                     <Link className="Link" onClick={signInAction}>Olvidé mi contraseña</Link>
//                     <div className="loginForm-button">
//                         <button type="submit" onClick={authenticate}> <span> ENTRAR </span></button>
//                     </div>
//                     <div className="grid-md">
//                         <p>¿No tienes cuenta? | <Link to="registerUser" className="Link" >Regístrate</Link></p>
//                     </div>
//                 </div>

//             </div>
//             <div className="SignInContainer">
//                 <img src={illustration} alt="Planners Day" width={400} />
//             </div>
//         </div>
//     );
// }

// export default SignIn;