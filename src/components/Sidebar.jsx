import { useState } from "react";
import { HomeIcon, BuildingOfficeIcon, BellIcon, ArrowRightOnRectangleIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";

export default function FloatingTopbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-3 shadow-lg transition-all duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Panel flotante tipo slide-in */}
      <div
        className={`fixed top-0 left-0 h-16 flex items-center backdrop-blur-lg bg-white/20 shadow-md border-b border-white/30 transition-all duration-500 z-40 ${
          open ? "w-full px-6" : "w-0 overflow-hidden"
        }`}
      >
        <nav className="flex items-center gap-6 text-white">
          <MenuItem icon={<MagnifyingGlassIcon className="h-6 w-6" />} label="Buscar" />
          <MenuItem icon={<HomeIcon className="h-6 w-6" />} label="Inicio" />
          <MenuItem icon={<BuildingOfficeIcon className="h-6 w-6" />} label="Agrega tu empresa" />
          <MenuItem icon={<BellIcon className="h-6 w-6" />} label="Notificaciones" />
          <MenuItem icon={<ArrowRightOnRectangleIcon className="h-6 w-6" />} label="Cerrar sesión" />
        </nav>
      </div>
    </>
  );
}

function MenuItem({ icon, label }) {
  return (
    <button className="flex items-center gap-2 text-white hover:text-orange-200 transition">
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
