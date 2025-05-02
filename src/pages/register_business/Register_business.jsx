// rrd imports
import { useLoaderData, useNavigate } from 'react-router-dom';
import { fetchData } from "../../Wrapper.js";
import { useEffect } from "react";
// assets
import './Register_business.css';

// loader
export function registerBusinessLoader() {
    const sCorreo = fetchData("correo");
    const sPassword = fetchData("pwd");
    return { sCorreo, sPassword };
}


export function RegisterBusiness() {
    const navigate = useNavigate();
    const { sCorreo, sPassword } = useLoaderData();
    useEffect(() => {
        if (sCorreo === null && sPassword === null) {
            navigate("/");
        }
    }, []);
    return (
        <div className="RegisterBusinessContainer">
            <h1>Register Business</h1>
        </div>);
}

export default RegisterBusiness;