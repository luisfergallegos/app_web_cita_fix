// rrd imports
import { useLoaderData, useNavigate } from 'react-router-dom';
import { fetchData } from "../../Wrapper.js";
import { useEffect } from "react";
// assets
import './Add_appoin.css';

// loader
export function AddAppoinLoader() {
    const sCorreo = fetchData("correo");
    const sPassword = fetchData("pwd");
    return { sCorreo, sPassword };
}


export function AddAppoin() {
    const navigate = useNavigate();
    const { sCorreo, sPassword } = useLoaderData();
    useEffect(() => {
        if (sCorreo === null && sPassword === null) {
            navigate("/");
        }
    }, []);
    return (
        <div className="AddAppoinContainer">
            <h1>Add Appoin</h1>
        </div>);
}

export default AddAppoin;