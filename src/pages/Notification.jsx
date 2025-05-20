import { useLoaderData, useNavigate } from 'react-router-dom';
import { fetchData } from "../Wrapper.js";
import { useEffect } from "react";

import { BellAlertIcon } from '@heroicons/react/24/solid';

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-600 to-orange-800 px-4">
            <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center animate-fade-in-up">
                <BellAlertIcon className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Sin notificaciones</h1>
                <p className="text-gray-500 text-sm">
                    Actualmente no tienes notificaciones pendientes. ¡Te avisaremos si ocurre algo nuevo!
                </p>
            </div>
        </div>
    );
}

export default Notification;
