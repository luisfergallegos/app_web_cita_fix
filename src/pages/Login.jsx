// rrd imports
import { useLoaderData } from "react-router-dom";

import SingIn from './authenticate/SignIn.jsx';
// assents
import Logo from "../assets/menu.png";

// Routes
import Home from "../pages/Home.jsx";

// helper funtions
import { fetchData } from "../Wrapper.js";

// loader
export function loginFormLoader() {    
    const sCorreo = fetchData("correo");
    const sPassword = fetchData("pwd");
    return { sCorreo, sPassword };
}

export function LoginForm() {
    const { sCorreo, sPassword } = useLoaderData();
    return (
        <>
            {sCorreo && sPassword ? <Home /> :
                <div id="containerLogin">
                    <div className="containerLogin">
                        <SingIn />
                    </div>
                </div>
            }
        </>
    );
}

export default LoginForm;