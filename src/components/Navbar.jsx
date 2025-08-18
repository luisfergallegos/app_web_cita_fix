// rrd imports
import { useState } from 'react';
import { fetchData } from "../Wrapper.js";
import { NavLink, Form } from 'react-router-dom';

// Library
import {
    Bars3Icon, XMarkIcon, HomeIcon, UserCircleIcon, 
    BuildingOfficeIcon, BellIcon, ArrowRightStartOnRectangleIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/solid';

// assents
import logo from "../assets/splash.png";


export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(!isOpen);

    const sUserCitaFix = fetchData("UserCitaFix") ?? [];
    const bPhotoUser = fetchData("photoUser") ?? [];
    const dorsl = fetchData("dorsl") ?? '';

    const [linksArray, setLinksArray] = useState([
        {
            label: 'Inicio',
            sublabel:
                (sUserCitaFix['first_name'] === "" || sUserCitaFix.length === 0
                    ? 'Agrega tu nombre'
                    : sUserCitaFix['first_name']),

            icon: (bPhotoUser['data'] === null || bPhotoUser.length === 0
                ? <HomeIcon className='w-8 h-8 mx-1 md:w-5 md:h-5 lg:w-10 lg:h-10 ms:mx-2 md:mx-2 lg:mx-2' />
                : <img src={User} width={50} height={50} />),
            to: "home"
        },
        {
            label: 'Buscar',
            sublabel: 'Home',
            icon: <MagnifyingGlassIcon className='w-8 h-8 mx-1 md:w-5 md:h-5 lg:w-10 lg:h-10 ms:mx-2 md:mx-2 lg:mx-2' />,
            to: "/findBusiness"
        },
        /* {
            label: (dorsl == '' || sUserCitaFix.length === 0 ? 'Agrega tu empresa' : 'Empresa'),
            sublabel: (dorsl == '' || sUserCitaFix.length === 0
                ? 'Agrega tu empresa'
                : dorsl),
            icon: <BuildingOfficeIcon className='w-8 h-8 mx-1 md:w-5 md:h-5 lg:w-10 lg:h-10 ms:mx-2 md:mx-2 lg:mx-2' />,
            to: (dorsl == '' || sUserCitaFix.length === 0
                ? "registerBusiness"
                : "homeBusiness")
        }, */
        {
            label: "Notificaciones",
            sublabel: "Ver tus Notificaciones",
            icon: <BellIcon className='w-8 h-8 mx-1 md:w-5 md:h-5 lg:w-10 lg:h-10 ms:mx-2 md:mx-2 lg:mx-2' />,
            to: "notification"
        },

    ]);

    return (
        <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                {/* logo */} 
                <a href="https://www.plannersday.com/"><img src={logo} className='h-10 w-auto' /></a>
                         
                {/* Botón para móvil */}
                <button className="lg:hidden" onClick={toggleMenu}>
                    {isOpen ? <XMarkIcon width={24} /> : <Bars3Icon width={24} />}
                </button>

                {/* Menú desktop */}
                {/* <ul className="hidden md:flex space-x-6 text-orange-600 font-medium">
                    {linksArray.map(({ icon, label, to }) => (
                        <li><a href={to} className="flex items-center hover:text-orange-800">{icon}{label}</a></li>
                    ))}
                </ul> */}
                <ul className="hidden lg:flex space-x-6 text-orange-600 font-medium">
                    {linksArray.map(({ icon, label, to, sublabel }) => (
                        <NavLink to={to}
                            className={({ isActive }) => `${isActive ? `flex items-center text-orange-800 hover:text-orange-600` : `flex items-center hover:text-orange-800`}`}
                        >
                            {icon}
                            <span>{label}</span>
                        </NavLink>
                    ))}
                    {/* <div className='flex items-center hover:text-orange-800'>
                        <ArrowRightStartOnRectangleIcon className='w-8 h-8 mx-1 md:w-5 md:h-5 lg:w-10 lg:h-10 ms:mx-2 md:mx-2 lg:mx-2' />
                        <Form method="post" action="/logout" >
                            <button type="submit" >
                                Cerrar sesión
                            </button>
                        </Form>
                    </div> */}
                </ul>

            </div>

            {/* Menú móvil */}
            {isOpen && (
                <ul className="lg:hidden bg-white px-4 pt-2 pb-4 space-y-2 text-orange-600 font-medium shadow-md">
                    {/* {linksArray.map(({ icon, label, to }) => (
                        <li><a href={to} className="flex items-center hover:text-orange-800">{icon}{label}</a></li>
                    ))} */}
                    {linksArray.map(({ icon, label, to, sublabel }) => (
                        <NavLink to={to} onClick={toggleMenu}
                            className={({ isActive }) => `${isActive ? `flex items-center text-orange-800 hover:text-orange-600` : `flex items-center hover:text-orange-800`}`}
                        >
                            {icon}
                            <span>{label}</span>
                        </NavLink>
                    ))}
                    {/* <div className='flex items-center hover:text-orange-800'>
                        <ArrowRightStartOnRectangleIcon className='w-8 h-8 mx-1 md:w-5 md:h-5 lg:w-10 lg:h-10 ms:mx-2 md:mx-2 lg:mx-2' />
                        <Form method="post" action="/logout" >
                            <button type="submit" >
                                Cerrar sesión
                            </button>
                        </Form>
                    </div> */}
                </ul>
            )}

        </nav>
    );
}

export default Navbar;
