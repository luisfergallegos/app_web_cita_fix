// rrd imports
import { useState } from 'react';
import { fetchData } from "../Wrapper.js";
import { NavLink } from 'react-router-dom';
import { useProfile } from "../ProfileContext.jsx";

// Library
import { Bars3Icon, XMarkIcon, BuildingOfficeIcon, MagnifyingGlassIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

// assents
import logo from "../assets/splash.png";


export function NavbarBus() {
    const { setProfile } = useProfile();
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(!isOpen);
    const sUserCitaFix = fetchData("UserCitaFix") ?? [];

    const arrayBufferToBase64 = (buffer) => {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return btoa(binary);
    };

    const [linksArray, setLinksArray] = useState([
        {
            label: 'Inicio',
            icon: <BuildingOfficeIcon className='w-8 h-8 mx-1 md:w-5 md:h-5 lg:w-10 lg:h-10 ms:mx-2 md:mx-2 lg:mx-2' />,
            to: "home"
        },
        {
            label: 'Buscar',
            icon: <MagnifyingGlassIcon className='w-8 h-8 mx-1 md:w-5 md:h-5 lg:w-10 lg:h-10 ms:mx-2 md:mx-2 lg:mx-2' />,
            to: "/findUser"
        },
        {
            label: (sUserCitaFix['first_name'] == "" || sUserCitaFix.length == 0
                ? 'Cambiar de perfil'
                : 'Cambiar a ' + sUserCitaFix['first_name']),
            icon: (sUserCitaFix['PHOTO'].data == null || sUserCitaFix['PHOTO'].data.length == 0
                ? <HomeIcon className='w-8 h-8 mx-1 md:w-5 md:h-5 lg:w-10 lg:h-10 ms:mx-2 md:mx-2 lg:mx-2' />
                : <div className="relative w-10 h-10 mr-1">
                    <img
                        className="w-full h-full rounded-full object-cover border"
                        src={'data:image/jpeg;base64,' + arrayBufferToBase64(sUserCitaFix['PHOTO'].data)}
                    />
                    <ArrowPathIcon className="absolute inset-0 m-auto w-8 h-8 text-white bg-black/10 rounded-full p-1" />
                </div>),
            to: "home"
        },
    ]);

    return (
        <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                {/* logo */}
                <a href="https://app.plannersday.com/home"><img src={logo} className='h-10 w-auto' /></a>
                {/* Botón para móvil */}
                <button className="lg:hidden" onClick={toggleMenu}>
                    {isOpen ? <XMarkIcon width={24} /> : <Bars3Icon width={24} />}
                </button>
                {/* Menú desktop */}
                <ul className="hidden lg:flex space-x-6 text-orange-600 font-medium">
                    {linksArray.map(({ icon, label, to }) => {
                        if (label.substring(0, 7) == 'Cambiar') {
                            console.log(label.substring(0, 7));
                            return (
                                <NavLink onClick={() => {
                                        setProfile("user");
                                        navigate("/home");
                                    }}
                                    className={({ isActive }) => `${isActive ? `flex items-center text-orange-800 hover:text-orange-600` : `flex items-center hover:text-orange-800`}`}
                                >
                                    {icon}
                                    <span>{label}</span>
                                </NavLink>
                            );
                        }
                        return (
                            <NavLink to={to}
                                className={({ isActive }) => `${isActive ? `flex items-center text-orange-800 hover:text-orange-600` : `flex items-center hover:text-orange-800`}`}
                            >
                                {icon}
                                <span>{label}</span>
                            </NavLink>
                        );
                    })}
                </ul>
            </div>
            {/* Menú móvil */}
            {isOpen && (
                <ul className="lg:hidden bg-white px-4 pt-2 pb-4 space-y-2 text-orange-600 font-medium shadow-md">
                    {linksArray.map(({ icon, label, to }) => {
                        if (label.substring(0, 7) == 'Cambiar') {
                            console.log(label.substring(0, 7));
                            return (
                                <NavLink onClick={() => {
                                        setProfile("user");
                                        navigate("/home");
                                    }}
                                    className={({ isActive }) => `${isActive ? `flex items-center text-orange-800 hover:text-orange-600` : `flex items-center hover:text-orange-800`}`}
                                >
                                    {icon}
                                    <span>{label}</span>
                                </NavLink>
                            );
                        }
                        return (
                            <NavLink to={to}
                                className={({ isActive }) => `${isActive ? `flex items-center text-orange-800 hover:text-orange-600` : `flex items-center hover:text-orange-800`}`}
                            >
                                {icon}
                                <span>{label}</span>
                            </NavLink>
                        );
                    })}
                </ul>
            )}
        </nav>
    );
}

export default NavbarBus;
