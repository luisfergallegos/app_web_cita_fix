// rrd imports
import { useLoaderData, useNavigate } from 'react-router-dom';
import { fetchData } from "../../Wrapper.js";
import { useEffect } from "react";
// assets
import './Find_business.css';

// loader
export function HomeBusinessLoader() {
    const sCorreo = fetchData("correo");
    const sPassword = fetchData("pwd");
    const sUserCitaFix = fetchData("UserCitaFix") ?? [];
    const dorsl = sUserCitaFix['DORSL'];
    return { sCorreo, sPassword, dorsl };
}

export function HomeBusiness() {
    const navigate = useNavigate();
    const { sCorreo, sPassword, dorsl } = useLoaderData();
    useEffect(() => {
        if (dorsl === '') {
            navigate("/");
        }
        else if (sCorreo === null && sPassword === null) {
            navigate("/");
        }
    }, []);
    return (
        <div className="FindBusinessContainer">
            <h1>Home Business</h1>
        </div>);
}

export default HomeBusiness;