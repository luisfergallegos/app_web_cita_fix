import { useState } from "react";
import { HomeIcon, UserIcon, Cog6ToothIcon, ChevronDoubleRightIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  const toggleSidebar = () => setOpen(!open);

  return (
    <aside
      className={`h-screen bg-[#2c2c2c] text-white fixed top-0 left-0 transition-all duration-300 z-50 ${
        open ? "w-64" : "w-16"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-4">
        <h1 className={`text-xl font-bold text-orange-500 transition-all ${open ? "block" : "hidden"}`}>MiApp</h1>
        <button onClick={toggleSidebar} className="text-orange-500">
          <ChevronDoubleRightIcon className={`w-6 h-6 transform ${!open && "rotate-180"}`} />
        </button>
      </div>

      <nav className="mt-4 space-y-2 px-2">
        <SidebarItem to="/" icon={<HomeIcon className="w-6 h-6" />} label="Inicio" open={open} />
        <SidebarItem to="/perfil" icon={<UserIcon className="w-6 h-6" />} label="Perfil" open={open} />
        <SidebarItem to="/ajustes" icon={<Cog6ToothIcon className="w-6 h-6" />} label="Ajustes" open={open} />
      </nav>
    </aside>
  );
}

function SidebarItem({ to, icon, label, open }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-4 py-3 hover:bg-orange-500 rounded-md transition-all"
    >
      {icon}
      <span className={`whitespace-nowrap transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 hidden"}`}>
        {label}
      </span>
    </Link>
  );
}
