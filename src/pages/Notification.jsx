
// rrd imports
import { useLoaderData, useNavigate } from 'react-router-dom';
import { fetchData } from "../Wrapper.js";
import { useEffect } from "react";
// assets
import './Notification.css';

// loader
export function notificationLoader() {
    const sCorreo = fetchData("correo");
    const sPassword = fetchData("pwd");
    return { sCorreo, sPassword };
}


export function Notification() {
    const navigate = useNavigate();
    const { sCorreo, sPassword } = useLoaderData();
    useEffect(() => {
        if (sCorreo === null && sPassword === null) {
            navigate("/");
        }
    }, []);
    return (
        <div className="NotificationContainer">
            <h1>Notification</h1>
        </div>);
}

export default Notification;