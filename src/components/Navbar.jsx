// rrd imports
import { useEffect, useState } from 'react';
import { fetchData } from "../Wrapper.js";
import { NavLink, useLocation } from 'react-router-dom';
// Library
import { HomeIcon, UserIcon, BellIcon, MagnifyingGlassIcon, XMarkIcon as CloseIcon } from '@heroicons/react/24/solid';

// assents
import logo from "../assets/splash.png";
import NotificationPopover from './NotificationPopover.jsx';


export function Navbar() {
    const numNoti = fetchData("numNot") ?? 0;
    const sUserCitaFix = fetchData("UserCitaFix") ?? [];
    const [numNotificaciones, setNumNotificaciones] = useState(numNoti);
    const location = useLocation();

    const arrayBufferToBase64 = (buffer) => {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return btoa(binary);
    };

    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        setShowNotifications(false);
    }, [location.pathname]);

    return (
        <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

                <img
                    src={logo}
                    className="h-9 w-auto"
                    alt="PlannersDay"
                />

                {/* Buscador */}
                {location.pathname !== "/findBusiness" && (
                    <div className="hidden md:flex flex-1 max-w-xl mx-8">

                        <NavLink
                            to="/findBusiness"
                            className="w-full flex items-center pl-3 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-left hover:bg-slate-100"
                        >
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-2" />

                            <span className="text-gray-400">
                                Explorar servicios
                            </span>
                        </NavLink>

                    </div>
                )}

                <div className="hidden lg:flex items-center gap-6">

                    <NavLink
                        to="/home"
                        className={({ isActive }) =>
                            `relative  ${isActive
                                ? 'text-orange-500'
                                : 'text-gray-700'
                            }`}
                    >
                        <HomeIcon className="w-6 h-6" />
                    </NavLink>

                    {/* <NavLink
                        to="/notification"
                        className={({ isActive }) =>
                            `relative  ${isActive
                                ? 'text-orange-500'
                                : 'text-gray-700'
                            }`}
                    >
                        <BellIcon className="w-6 h-6" />

                        {numNotificaciones > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {numNotificaciones > 9 ? '9+' : numNotificaciones}
                            </span>
                        )}
                    </NavLink> */}

                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="mt-2 text-gray-700 hover:text-orange-500 transition"
                        >
                            <BellIcon className="w-6 h-6" />

                            {numNotificaciones > 0 && (
                                <span className="mt-2 absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {numNotificaciones > 9 ? "9+" : numNotificaciones}
                                </span>
                            )}
                        </button>

                        {showNotifications && (
                            <NotificationPopover />
                        )}
                    </div>

                    <NavLink
                        to="/viewUpdateUser"
                        className="flex items-center gap-3"
                    >
                        {sUserCitaFix?.PHOTO?.data?.length > 0 ? (
                            <img
                                className="w-10 h-10 rounded-full object-cover"
                                src={
                                    'data:image/jpeg;base64,' +
                                    arrayBufferToBase64(
                                        sUserCitaFix.PHOTO.data
                                    )
                                }
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                <UserIcon className="w-6 h-6" />
                            </div>
                        )}

                        <span className="font-medium text-gray-800">
                            {sUserCitaFix?.first_name || 'Inicio'}
                        </span>
                    </NavLink>
                </div>
            </div>
            {/* Menú móvil */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50">

                <div className="grid grid-cols-4 h-16">

                    <NavLink
                        to="/home"
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center ${isActive
                                ? 'text-orange-500'
                                : 'text-gray-400'
                            }`
                        }
                    >
                        <HomeIcon className="w-6 h-6" />
                        <span className="text-xs">Inicio</span>
                    </NavLink>

                    <NavLink
                        to="/findBusiness"
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center ${isActive
                                ? 'text-orange-500'
                                : 'text-gray-400'
                            }`
                        }
                    >
                        <MagnifyingGlassIcon className="w-6 h-6" />
                        <span className="text-xs">Explorar</span>
                    </NavLink>

                    <NavLink
                        to="/notification"
                        className={({ isActive }) =>
                            `relative flex flex-col items-center justify-center ${isActive
                                ? 'text-orange-500'
                                : 'text-gray-400'
                            }`
                        }
                    >
                        <BellIcon className="w-6 h-6" />

                        {numNotificaciones > 0 && (
                            <span className="absolute top-1 right-6 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                                {numNotificaciones > 9 ? '9+' : numNotificaciones}
                            </span>
                        )}

                        <span className="text-xs">
                            Avisos
                        </span>
                    </NavLink>

                    <NavLink
                        to="/viewUpdateUser"
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center ${isActive
                                ? 'text-orange-500'
                                : 'text-gray-400'
                            }`
                        }
                    >
                        {sUserCitaFix?.PHOTO?.data?.length > 0 ? (
                            <img
                                className="w-6 h-6 rounded-full object-cover"
                                src={
                                    'data:image/jpeg;base64,' +
                                    arrayBufferToBase64(
                                        sUserCitaFix.PHOTO.data
                                    )
                                }
                            />
                        ) : (
                            <UserIcon className="w-6 h-6" />
                        )}

                        <span className="text-xs">
                            Perfil
                        </span>
                    </NavLink>

                </div>

            </div>
        </nav>

    );
}

export default Navbar;
