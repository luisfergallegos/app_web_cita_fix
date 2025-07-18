import { useState } from "react";
import { Bars3Icon, XMarkIcon, HomeIcon, UserIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

export default function Topbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      {/* Topbar fija */}
      <header className="w-full bg-[#2c2c2c] text-white shadow-md fixed top-0 z-50">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-orange-500">MiApp</h1>

          <nav className="hidden md:flex gap-6">
            <Link className="hover:text-orange-500 transition" to="/">Inicio</Link>
            <Link className="hover:text-orange-500 transition" to="/perfil">Perfil</Link>
            <Link className="hover:text-orange-500 transition" to="/ajustes">Ajustes</Link>
          </nav>

          {/* Botón menú hamburguesa */}
          <button onClick={toggleMenu} className="md:hidden focus:outline-none">
            {menuOpen ? <XMarkIcon className="w-6 h-6 text-orange-500" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Menú desplegable mobile */}
      {menuOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full bg-white shadow-xl z-40">
          <div className="flex flex-col px-6 py-4 text-[#2c2c2c]">
            <MobileLink icon={<HomeIcon className="w-5 h-5" />} to="/" label="Inicio" toggle={toggleMenu} />
            <MobileLink icon={<UserIcon className="w-5 h-5" />} to="/perfil" label="Perfil" toggle={toggleMenu} />
            <MobileLink icon={<Cog6ToothIcon className="w-5 h-5" />} to="/ajustes" label="Ajustes" toggle={toggleMenu} />
          </div>
        </div>
      )}
    </>
  );
}

function MobileLink({ to, icon, label, toggle }) {
  return (
    <Link
      to={to}
      onClick={toggle}
      className="flex items-center gap-2 py-3 border-b border-gray-200 hover:text-orange-500 transition"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
