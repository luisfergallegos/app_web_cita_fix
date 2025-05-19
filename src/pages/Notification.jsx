
// rrd imports
import { useLoaderData, useNavigate } from 'react-router-dom';
import { fetchData } from "../Wrapper.js";
import { useEffect } from "react";
// assets
import './Notification.css';
// Library
import { BellAlertIcon } from '@heroicons/react/24/solid';
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
            <div>
                <BellAlertIcon width={100} />
                <h1>Sin Notification</h1>
            </div>
        </div>);
}

export default Notification;