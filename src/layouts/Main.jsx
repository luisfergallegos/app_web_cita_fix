// rrd imports
import { useLoaderData } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useState } from 'react';
// helper funtions
import { fetchData } from "../Wrapper.js";
// components
import { Sidebar } from '../components/Sidebar.jsx';
import './Main.css';

// loader
export function mainLoader() {
  const sCorreo = fetchData("correo");
  const sPassword = fetchData("pwd");
  return { sCorreo, sPassword };
}

function Main() {
  const { sCorreo, sPassword } = useLoaderData();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      { sCorreo && sPassword ? 
        <div className={sidebarOpen?"sidebarState active":"sidebarState"}>
              <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
              <Outlet />
        </div> : <Outlet />
      }
    </>
  )
}

export default Main;
