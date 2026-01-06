// rrd imports
import { useState } from 'react';
import { fetchData } from "../Wrapper.js";
import { NavLink } from 'react-router-dom';

// Library
import { Bars3Icon, XMarkIcon, BuildingOfficeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';

// assents
import logo from "../assets/splash.png";


export function NavbarBus() {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(!isOpen);
    const stored = JSON.parse(localStorage.getItem("homeBusiness"));
    const arrayBufferToBase64 = (buffer) => {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return btoa(binary);
    };
    
    const [linksArray, setLinksArray] = useState([
        {
            label: 'Inicio',
            icon: (stored.photo.data == null || stored.photo.data.length == 0
                ? <BuildingOfficeIcon className='w-8 h-8 mx-1 md:w-5 md:h-5 lg:w-10 lg:h-10 ms:mx-2 md:mx-2 lg:mx-2' />
                : <img className="w-8 h-8 mx-1 md:w-5 md:h-5 lg:w-10 lg:h-10 ms:mx-2 md:mx-2 lg:mx-2 rounded-full object-cover border" 
                src={'data:image/jpeg;base64,' + arrayBufferToBase64(stored.photo.data)} />),
            to: "home"
        },
        {
            label: 'Buscar',
            icon: <MagnifyingGlassIcon className='w-8 h-8 mx-1 md:w-5 md:h-5 lg:w-10 lg:h-10 ms:mx-2 md:mx-2 lg:mx-2' />,
            to: "/findUser"
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
                    {linksArray.map(({ icon, label, to }) => (
                        <NavLink to={to}
                            className={({ isActive }) => `${isActive ? `flex items-center text-orange-800 hover:text-orange-600` : `flex items-center hover:text-orange-800`}`}
                        >
                            {icon}
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </ul>
            </div>
            {/* Menú móvil */}
            {isOpen && (
                <ul className="lg:hidden bg-white px-4 pt-2 pb-4 space-y-2 text-orange-600 font-medium shadow-md">
                    {linksArray.map(({ icon, label, to }) => (
                        <NavLink to={to} onClick={toggleMenu}
                            className={({ isActive }) => `${isActive ? `flex items-center text-orange-800 hover:text-orange-600` : `flex items-center hover:text-orange-800`}`}
                        >
                            {icon}
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </ul>
            )}
        </nav>
    );
}

export default NavbarBus;
