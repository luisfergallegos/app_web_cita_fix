
// rrd imports
import { useLoaderData, useNavigate } from 'react-router-dom';
import { fetchData } from "../../Wrapper.js";
import { useEffect } from "react";
// assets
import './View_update_user.css';

// loader
export function viewUpdateUserLoader() {
    const sCorreo = fetchData("correo");
    const sPassword = fetchData("pwd");
    return { sCorreo, sPassword };
}


export function ViewUpdateUser() {
    const navigate = useNavigate();
        const { sCorreo, sPassword } = useLoaderData();
        useEffect(() => {
            if (sCorreo === null && sPassword === null) {
                navigate("/");
            }
        }, []);
    return (
    <div className="ViewUpdateUserContainer">
        <h1>View Update User</h1>
    </div>);
}

export default ViewUpdateUser;