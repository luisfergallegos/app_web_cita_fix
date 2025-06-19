// rrd imports
import { NavLink, useNavigate, Form } from 'react-router-dom';
import { fetchData } from "../Wrapper.js";
import { useState } from 'react';
// Library
import { toast } from "react-toastify";
import { ChevronRightIcon, UserCircleIcon, ChevronLeftIcon, 
    BuildingStorefrontIcon, BellIcon, HomeIcon, 
    MagnifyingGlassIcon, ArrowRightStartOnRectangleIcon
 } from '@heroicons/react/24/outline';
// assents
import MenuWhite from "../assets/menu_white.png";
import User from "../assets/e.png";
import logo from "../assets/icon_white.png";
import './Sidebar.css';


export function Sidebar({ sidebarOpen, setSidebarOpen }) {
    const sUserCitaFix = fetchData("UserCitaFix") ?? [];
    const bPhotoUser = fetchData("photoUser") ?? [];
    const dorsl = fetchData("dorsl") ?? '';

    const [linksArray, setLinksArray] = useState([
        {
            label: 'Home',
            sublabel: '',
            icon: <HomeIcon className='w-8 h-8 md:w-10 md:h-10 lg:w-10 lg:h-10 ms:me-4 md:me-4 lg:me-4' />,
            to: "/findBusiness"
        },
        {
            label:
                (sUserCitaFix['first_name'] === "" || sUserCitaFix.length === 0
                    ? 'Agrega tu nombre'
                    : sUserCitaFix['first_name']),
            sublabel: 'Ver tus citas',
            icon: (bPhotoUser['data'] === null || bPhotoUser.length === 0
                ? <UserCircleIcon className='w-8 h-8 md:w-10 md:h-10 lg:w-10 lg:h-10 ms:me-4 md:me-4 lg:me-4' />
                : <img src={User} width={50} height={50} />),
            to: "home"
        },
        {
            label: (dorsl == '' || sUserCitaFix.length === 0
                ? 'Agrega tu empresa'
                : dorsl),
            sublabel: (dorsl === '' ? '' : 'Ver tu empresa'),
            icon: <BuildingStorefrontIcon className='w-8 h-8 md:w-10 md:h-10 lg:w-10 lg:h-10 ms:me-4 md:me-4 lg:me-4' />,
            to: (dorsl == '' || sUserCitaFix.length === 0
                ? "registerBusiness"
                : "homeBusiness") 
        },
        {
            label: "Notificaiones",
            sublabel: "Ver tus notificaciones",
            icon: <BellIcon className='w-8 h-8 md:w-10 md:h-10 lg:w-10 lg:h-10 ms:me-4 md:me-4 lg:me-4' />,
            to: "notification"
        }

    ]);

    const ModSidebaropen = () => {
        setSidebarOpen(!sidebarOpen);
    };
    /* const onLogout=()=>{
        // delete tha user
        localStorage.removeItem("correo");
        localStorage.removeItem("pwd");
    } */
    return (
        <div className='SidebarContainer'>
            {sidebarOpen ? <button id="sidebar" onClick={ModSidebaropen}>
                <ChevronLeftIcon className='w-8 h-8 md:w-10 md:h-10 lg:w-10 lg:h-10' />
            </button> : <button id="sidebar" onClick={ModSidebaropen}>
                <ChevronRightIcon className='w-8 h-8 md:w-10 md:h-10 lg:w-10 lg:h-10' />
            </button>}
            <div className='Logocontent'>
                <div className="imgcontent">
                    {
                        sidebarOpen ?
                            <a className='OpenMenu' href="https://www.plannersday.com/"><img  id='logo' src={MenuWhite} /></a>
                            : <img id='logo' src={logo} />
                    }
                </div>
            </div>
            <div className='Divider' ></div>
            {/* <div className='LinkContainer'>
            <NavLink to='findBusiness'
                        className={({ isActive }) => `Links${isActive ? ` active` : ``}`}>
                        <MagnifyingGlassIcon className='w-8 h-8 md:w-10 md:h-10 lg:w-10 lg:h-10 ms:me-4 md:me-4 lg:me-4' />
                        <div >
                            {sidebarOpen && <span>Buscar</span>}
                            {sidebarOpen && <div className='LinkSubLabel'><span></span></div>}
                        </div>
                    </NavLink>
            </div>            
            <div className='Divider' ></div> */}
            {linksArray.map(({ icon, label, to, sublabel }) => (
                <div className="LinkContainer" key={label}>
                    <NavLink to={to}
                        className={({ isActive }) => `Links${isActive ? ` active` : ``}`}>
                        {icon}
                        <div >
                            {sidebarOpen && <span>{label}</span>}
                            {sidebarOpen && <div className='LinkSubLabel '><span>{sublabel}</span></div>}
                        </div>
                    </NavLink>

                </div>
            ))}
            <div className='Divider' ></div>
            <div className="LogoutContainer">
                <ArrowRightStartOnRectangleIcon className='w-8 h-8 md:w-10 md:h-10 lg:w-10 lg:h-10 ms:me-4 md:me-4 lg:me-4'/>
                {sidebarOpen && <Form method="post" action="/logout" >
                        <button type="submit" id="LogoutButton" >
                            Cerrar sesión
                        </button>
                        
                    </Form>}
                {/* {sidebarOpen && <button id="LogoutButton" onClick={onLogout}>  Cerrar sesión </button>} */}
            </div>
            <div className='Divider' ></div>

        </div>

    );
}

export default Sidebar;
// // rrd imports
// import { NavLink, useNavigate } from 'react-router-dom';
// import { fetchData } from "../Wrapper";
// // Library
// import { toast } from "react-toastify";
// import { Bars3Icon, UserCircleIcon, XMarkIcon, BuildingStorefrontIcon, BellIcon } from '@heroicons/react/24/solid';

// import './Sidebar.css';
// // assents
// import MenuWhite from "../assets/menu_white.png";
// import Logout from "../assets/exit.png";
// import User from "../assets/e.png";

// const sUserCitaFix = fetchData("UserCitaFix") ?? [];
// const bPhotoUser = fetchData("photoUser") ?? [];

// const linksArray=[
//     {
//         label:
//         (sUserCitaFix['first_name'] === "" || sUserCitaFix.length === 0
//             ? 'Agrega tu nombre'
//             : sUserCitaFix['first_name']),
//         sublabel:'Ver tu perfil',
//         icon:(bPhotoUser['data'] === null || bPhotoUser.length === 0
//             ? <UserCircleIcon width={50} height={50}/>
//             : <img src={User} width={50} height={50}/> ) ,
//         to:"viewUpdateUser"
//     },
//     {
//         label: (sUserCitaFix['DORSL'] === '' || sUserCitaFix.length === 0
//             ? 'Agrega tu empresa'
//             : sUserCitaFix['DORSL']),
//         sublabel:(sUserCitaFix['DORSL'] ===  '' ? '' : 'Ver tu empresa'),
//         icon:<BuildingStorefrontIcon width={50} height={50}/>,
//         to:"viewUpdateBusiness"
//     },
//     {
//         label:"Notificaiones",
//         sublabel:"Ver tus notificaciones",
//         icon:<BellIcon width={50} height={50}/>,
//         to:"notification"
//     }

// ];

// function Sidebar({ sidebarOpen, setsidebarOpen, header, setheader }) {
//     const navigate = useNavigate();
//     const openDrawerMenu=()=>{
//         setsidebarOpen(!sidebarOpen);
//         setheader(!header);
//         navigate(`/`, { replace: true }); // <-- redirect
//     }

//     const onLogout=()=>{
//         setsidebarOpen(false);
//         setheader(true);
//         // delete tha user
//         localStorage.removeItem("correo");
//         localStorage.removeItem("pwd");
//         navigate(`/`, { replace: true }); // <-- redirect
//         toast.success('Regresa pronto!');
//     }
//     return (
//         <>
//             {   sidebarOpen ?
//                     <div className={sidebarOpen ? "Menu active" : "Menu"} >
//                         <button onClick={openDrawerMenu}
//                         className={sidebarOpen ? "closeMenu active" : "closeMenu"}>
//                             <XMarkIcon />
//                         </button>
//                         <div className="Logocontent">
//                             <div className='imgcontent'>
//                                 <img src={MenuWhite} />
//                             </div>
//                         </div>
//                         <div className="Divider"></div>
//                         {
//                             linksArray.map(({icon, label, sublabel, to})=>(
//                                 <div>
//                                 <div className="LinkContainer" key={label}>
//                                     <NavLink to={to} className={({isActive})=>`Links${isActive?` active`:``}`}>
//                                     <div  className="Linkicon">
//                                         {icon} 
//                                         <div className="LinkLabel">
//                                             <span>{label}</span>
//                                             <p>{sublabel}</p>
//                                         </div>
//                                     </div>
//                                     </NavLink>
//                                 </div>
//                                 <div className="Divider"></div>
//                                 </div>  
//                             ))
//                         }
//                         <div className="Logocontent">
//                             <button className="Logout" onClick={onLogout}> <img src={Logout} /> Cerrar sesión </button>
//                         </div>
                        
//                     </div> :
//                     <div onClick={openDrawerMenu} className={sidebarOpen ? "closeMenu active" : "closeMenu"}>
//                         <Bars3Icon />
//                     </div>
//             }
//         </>

//     );
// }

// export default Sidebar;
