// rrd imports
import { useLoaderData, Outlet } from "react-router-dom";
import { useState } from "react";
// helper functions
import { fetchData } from "../Wrapper.js";
// components
import  Sidebar  from "../components/Sidebar.jsx";
import "./Main.css";

// loader
export function mainLoader() {
  const sCorreo = fetchData("correo");
  const sPassword = fetchData("pwd");
  return { sCorreo, sPassword };
}

function Main() {
  const { sCorreo, sPassword } = useLoaderData();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      {sCorreo && sPassword ? (
        <div className="flex min-h-screen bg-gray-50">
          {/* Sidebar */}
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          {/* Main content */}
          <div
            className={`transition-all duration-300 ease-in-out ${
              sidebarOpen ? "ml-64" : "ml-0"
            } w-full`}
          >
            <Outlet />
          </div>
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
}

export default Main;
