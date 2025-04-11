// rrd imports
import { useLoaderData, useNavigate } from 'react-router-dom';
import { fetchData } from "../../Wrapper.js";
import { useEffect } from "react";
// assets
import './View_update_business.css';

// loader
export function viewUpdateBusinessLoader() {
    const sCorreo = fetchData("correo");
    const sPassword = fetchData("pwd");
    return { sCorreo, sPassword };
}


export function ViewUpdateBusiness() {
    const navigate = useNavigate();
    const { sCorreo, sPassword } = useLoaderData();
    useEffect(() => {
        if (sCorreo === null && sPassword === null) {
            navigate("/");
        }
    }, []);
    return (
        <div className="ViewUpdateBusinessContainer">
            <h1>View Update Business</h1>
        </div>);
}

export default ViewUpdateBusiness;