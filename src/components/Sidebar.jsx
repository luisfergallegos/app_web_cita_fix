import { useState } from "react";
import {
  BellIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import avatar from "../assets/avatar.png"; // Asegúrate de tener este archivo

export default function Topbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="w-full fixed top-0 left-0 z-50 backdrop-blur-md bg-white/30 border-b border-white/20 shadow-md transition-all duration-500 animate-fade-in-down">
      <div className="flex justify-between items-center px-6 py-3">
        {/* Logo o título */}
        <h1 className="text-xl font-bold text-orange-500 tracking-wide">MiApp</h1>

        {/* Íconos y usuario */}
        <div className="flex items-center gap-6 relative">
          <BellIcon className="w-6 h-6 text-orange-600 cursor-pointer hover:text-orange-400 transition" />

          {/* Avatar y dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 focus:outline-none"
            >
              <img
                src={avatar}
                alt="Usuario"
                className="w-10 h-10 rounded-full border-2 border-orange-500 shadow"
              />
              <ChevronDownIcon className="w-5 h-5 text-orange-600" />
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg border border-gray-200 z-50 animate-slide-in">
                <div className="px-4 py-2 border-b">
                  <p className="text-sm font-medium">Usuario</p>
                  <span className="text-xs text-gray-500">correo@ejemplo.com</span>
                </div>
                <ul>
                  <li className="px-4 py-2 hover:bg-orange-100 flex items-center gap-2 cursor-pointer">
                    <UserCircleIcon className="w-5 h-5 text-orange-500" /> Perfil
                  </li>
                  <li className="px-4 py-2 hover:bg-orange-100 flex items-center gap-2 cursor-pointer">
                    <ArrowRightOnRectangleIcon className="w-5 h-5 text-orange-500" /> Cerrar sesión
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
