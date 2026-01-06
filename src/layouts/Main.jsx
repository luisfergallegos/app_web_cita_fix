// rrd imports
import { useLoaderData } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useProfile } from "../ProfileContext.jsx";
// helper funtions
import { fetchData } from "../Wrapper.js";
// components
// import { Sidebar } from '../components/Sidebar.jsx';
import { XMarkIcon as CloseIcon } from '@heroicons/react/24/solid';

// import './Main.css';
import Navbar from "../components/Navbar.jsx";
import NavbarBus from "../components/NavbarBus.jsx";

// loader
export function mainLoader() {
  const sCorreo = fetchData("correo");
  const sPassword = fetchData("pwd");
  return { sCorreo, sPassword };
}

function Main() {
  const { sCorreo, sPassword } = useLoaderData();
  const { profile } = useProfile();
  // const [sidebarOpen, setSidebarOpen] = useState(false);

  // 📱 Detector de móvil
    const [isMobileBrowser, setIsMobileBrowser] = useState(false);
    const [showMobileBanner, setShowMobileBanner] = useState(true);

    useEffect(() => {
        const isMobile =
            /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
            window.innerWidth < 768;

        setIsMobileBrowser(isMobile);
    }, []);
  
  return (
    <>
      {sCorreo && sPassword ?
        <div className="relative">
          {/* 📱 Banner invitación app móvil */}
            {isMobileBrowser && showMobileBanner && (
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md bg-white shadow-xl rounded-2xl p-4 flex items-center justify-between z-50 animate-fade-in">
                    <div>
                        <p className="font-semibold text-gray-900">¿Tienes nuestra app móvil?</p>
                        <p className="text-sm text-gray-600 -mt-1">Descárgala para una mejor experiencia</p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button 
                            className="bg-orange-600 text-white text-sm px-3 py-2 rounded-xl"
                            onClick={() => {
                                window.open(`https://play.google.com/store/apps/details?id=com.citafix.cita_fix`);
                            }}
                        >
                            Descargar
                        </button>

                        <button
                            onClick={() => setShowMobileBanner(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <CloseIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
          {profile == "business" ? <NavbarBus /> : <Navbar /> }
          <Outlet />
        </div>
         : <Outlet />
      }
    </>
  )
}

export default Main;
