
// rrd imports
import { useLoaderData, useNavigate } from 'react-router-dom';
import { fetchData } from "../Wrapper.js";
import { useEffect, useState } from "react";
// assets
import { urlApi } from "../styles/Constants.jsx";
import Logo from "../assets/splash.png";
import Store from "../assets/business.png";
import pprincipal from "../assets/pprincipal.png";
import save from "../assets/search_grey.png";
import person from "../assets/directorio_orange.png";
import clock from "../assets/clock_grey.png";

import { MagnifyingGlassIcon, XMarkIcon as CloseIcon } from '@heroicons/react/24/solid';
import CardBusiness from '../components/CardBusiness.jsx';
import Loaging from '../components/Loading.jsx';

// Loader que se usa en App.jsx
export function LandingLoader() {
    const correo = fetchData("correo");
    const pwd = fetchData("pwd");
    // const user = fetchData("UserCitaFix");
    return { correo, pwd };
}

export function Landing() {
    const navigate = useNavigate();
    const { correo, pwd } = useLoaderData();
    const [loading, setLoading] = useState(true);
    const [empresas, setEmpresas] = useState([]);
    const [services, setServices] = useState([]);
    const [index, setIndex] = useState();

    const [userId, setUserId] = useState("");
    const [userName, setUserName] = useState("");

    const [searchText, setSearchText] = useState("");
    const [filteredNames, setFilteredNames] = useState([]);

    const [isOpen, setIsOpen] = useState(false);
    const [indexEmp, setIndexEmp] = useState();
    const [qualifications, setQualifications] = useState([]);
    const [selectBusiness, setSelectBusiness] = useState(null);
    const [showInput, setShowInput] = useState(false);

    const arrayBufferToBase64 = (buffer) => {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return btoa(binary);
    };

    const StarRating = (stars) => '⭐'.repeat(stars);

    function quitarAcentos(texto) {
        return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    const handleChange = evt => {
        const value = evt.target.value;
        setSearchText(value);
        if (value.trim() == "") {
            setFilteredNames([]);
        } else {
            const results = empresas.filter((emp) =>
                quitarAcentos(emp.DORSL.toLowerCase())
                    .includes(value.toLowerCase()) ||
                quitarAcentos(emp.SUBCATEGORY.toLowerCase())
                    .includes(value.toLowerCase())
            );
            setFilteredNames(results);
        }
    };



    useEffect(() => {
        // Redirección si no hay sesión
        /* if (!correo || !pwd) {
            navigate("/");
        } */
        // Cargar user info desde loader        
        var auxUser = fetchData("UserCitaFix") ?? "";
        if (auxUser) {
            setUserId(auxUser['USER_ID'] ?? "");
            var auxName = `${auxUser['first_name'] ?? ""} ${auxUser['last_name'] ?? ""}`;
            setUserName(auxName);
        }
        const fData = async () => {
            const userId = auxUser['USER_ID'] ?? '0';
            //Solicitar por GET
            var options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
            try {
                const response = await fetch(`${urlApi}bussiness?user_id=${userId}&latitude=4&longitude=5&radio=6`, options);
                if (!response.ok) {
                    console.log(`Error getting empresas.`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const json = await response.json();
                setEmpresas(json['data']);
                const results = json['data']
                    .filter((emp) => emp.PHOTO !== null && emp.PHOTO !== undefined)
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 3);
                setServices(results);
                setIndex(Math.floor(Math.random() * json['data'].length));
                setLoading(false);
            }
            catch (e) {
                return;
            }
        };
        fData();
    }, []);

    if (loading) {
        return <Loaging />;
    }

    const handleViewProfile = async (bus) => {
        const baseUrl = '/viewBusiness';
        const params = new URLSearchParams({
            n: bus.DORSL,
            i: bus.BUSSINESS_ID
        });
        navigate(`${baseUrl}?${params.toString()}`);

    };

    const benefits = [
        {
            title: "Encuentra nuevos clientes",
            description:
                "Publica tus servicios y permite que cientos de personas encuentren tu negocio fácilmente.",
            image: save,
        },
        {
            title: "Agenda en segundos",
            description:
                "Tus clientes podrán reservar, modificar o cancelar citas de forma rápida y sencilla.",
            image: person,
        },
        {
            title: "Organiza tu día",
            description:
                "Administra horarios, servicios y citas en tiempo real desde una sola app.",
            image: clock,
        },
    ];


    return (

        <div className="min-h-screen bg-white text-gray-900">
            {
                correo == null & pwd == null ?
                    /* Navbar */
                    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur">
                        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                            <div className="text-2xl font-bold tracking-tight">
                                <a href="https://www.plannersday.com/"><img className='h-10 w-auto' src={Logo} alt="" /></a>
                            </div>

                            <nav className="hidden gap-8 md:flex">
                                <a href="#home" className="text-sm font-medium hover:text-black">
                                    Inicio
                                </a>
                                <a href="#services" className="text-sm font-medium hover:text-black">
                                    Servicios
                                </a>
                                <a href="#benefits" className="text-sm font-medium hover:text-black">
                                    Beneficios
                                </a>
                                <a href="#explor" className="text-sm font-medium hover:text-black">
                                    Explorar
                                </a>
                                <a href="#contact" className="text-sm font-medium hover:text-black">
                                    Contacto
                                </a>
                            </nav>

                            <button className="rounded-full bg-orange-600 px-5 py-2 text-sm font-semibold text-white transition hover:scale-105"
                                onClick={() => navigate("/login")}>
                                Iniciar sesión
                            </button>
                        </div>
                    </header> : <div></div>
            }


            {/* Hero */}
            <section
                id="home"
                className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white"
            >
                <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
                    <div>
                        <p className="mb-4 inline-block rounded-full bg-orange-600 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                            Productividad Premium
                        </p>

                        <h1 className="text-5xl font-black leading-tight md:text-7xl">
                            Planners Day.
                            <span className="block text-gray-400">Encuentra y agenda fácilmente.</span>
                        </h1>

                        <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
                            Te <span className="font-black">ayuda</span> a encontrar los
                            <span className="font-black"> lugares</span> que forman parte de tu <span className="font-black">vida</span>.
                        </p>

                        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                            {correo == null & pwd == null ?
                                <button className="rounded-full bg-black px-8 py-4 font-semibold text-white transition hover:scale-105"
                                    onClick={() => navigate("/registerUser")}>
                                    Registrate
                                </button> : <></>}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-gray-200 blur-3xl"></div>
                        <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-gray-300 blur-3xl"></div>

                        <img
                            src={pprincipal}
                            alt="Planner"
                            className="relative z-10 w-full rounded-[2rem] object-cover "
                        />
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="border-y border-gray-100 bg-white py-12">
                <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
                    {[
                        ['+10K', 'Citas realizadas'],
                        ['4.9★', 'Calificación promedio'],
                        ['+120', 'Clientes felices'],
                        ['24/7', 'Soporte disponible'],
                    ].map(([number, label]) => (
                        <div key={label} className="text-center">
                            <div className="text-3xl font-black md:text-4xl">{number}</div>
                            <div className="mt-2 text-sm text-gray-500">{label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Products */}
            <section id="services" className="mx-auto max-w-7xl px-6 py-20">
                <div className="mb-12 text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">
                        Colección
                    </p>

                    <h2 className="mt-3 text-4xl font-black md:text-5xl">
                        Servicios destacados
                    </h2>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {services.map((product) => (
                        <div
                            key={product.DORSL}
                            className="group overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-2xl"
                        >
                            <div className="overflow-hidden">
                                <img
                                    src={`data:image/jpeg;base64,${arrayBufferToBase64(product.PHOTO.data)}`}
                                    alt={product.DORSL}
                                    className="w-80 h-80 mt-6 ml-8 object-cover rounded-full transition duration-500 group-hover:scale-110"
                                />
                            </div>

                            <div className="p-6">
                                <h3 className="text-2xl font-bold">{product.DORSL}</h3>

                                <div className="mt-2 text-lg text-gray-500">
                                    {product.SUBCATEGORY}
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // evita que active el onClick del card
                                        handleViewProfile(product);
                                    }}
                                    className="mt-6 w-full rounded-full bg-orange-600 py-3 font-semibold text-white transition hover:opacity-90">
                                    Ver perfil
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Benefits */}
            <section id="benefits" className="bg-gray-50 py-20">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="mb-12 text-center">
                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">
                            Beneficios
                        </p>

                        <h2 className="mt-3 text-4xl font-black text-gray-900 md:text-5xl">
                            Todo lo que necesitas para gestionar citas
                        </h2>

                        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
                            Planners Day conecta negocios y clientes en una sola plataforma
                            fácil de usar, rápida y organizada.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {benefits.map((benefit) => (
                            <div
                                key={benefit.title}
                                className="rounded-[2rem] bg-white p-8 shadow-sm"
                            >
                                <img
                                    src={benefit.image}
                                    alt={benefit.title}
                                    className="h-14 w-14 object-cover transition duration-500 group-hover:scale-110"
                                />

                                <h3 className="text-2xl font-bold">{benefit.title}</h3>

                                <p className="mt-4 leading-relaxed text-gray-600">
                                    {benefit.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section id="explor" className="mx-auto max-w-7xl px-6 py-20">
                <div className="overflow-hidden rounded-[3rem] bg-orange-600 px-8 py-16 text-center text-white md:px-16">
                    <h2 className="text-4xl font-black md:text-6xl">
                        Encuentra servicios y agenda tu cita
                    </h2>

                    <p className="mx-auto mt-6 max-w-2xl text-lg text-white">
                        Explora opciones cerca de ti y reserva cuando quieras.
                    </p>

                    {!showInput ?
                        (
                            <button
                                onClick={() => setShowInput(true)}
                                className="mt-10 mb-10 rounded-full bg-white px-8 py-4 font-bold text-orange-600 transition hover:scale-105">
                                Explorar servicios
                            </button>
                        ) : (
                            /* Buscador */
                            <div className="mt-5 mb-5 relative w-full max-w-lg mb-10 mx-auto">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                </div>

                                <input
                                    type="text"
                                    name="searchText"
                                    value={searchText}
                                    onChange={handleChange}
                                    autoFocus
                                    placeholder="Explorar servicios"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-400 outline-none text-gray-800 placeholder-gray-400"
                                />

                                <button
                                    onClick={() => { setShowInput(false); setSearchText(""); setFilteredNames([]); }}
                                    className="absolute top-3 right-3 text-gray-500 hover:text-orange-500"
                                >
                                    <CloseIcon className="w-5 h-5" />
                                </button>
                            </div>

                        )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredNames.map((empresa) => (
                            <CardBusiness
                                key={empresa.BUSSINESS_ID}
                                userId={userId}
                                userName={userName}
                                empresa={empresa}
                                setIsOpen={setIsOpen}
                                setIndexEmp={setIndexEmp}
                                setQualifications={setQualifications}
                                setSelectBusiness={setSelectBusiness}
                                selectBusiness={selectBusiness}
                            />
                        ))}
                    </div>
                </div>

            </section>

            {/* Footer */}
            <footer
                id="contact"
                className="border-t border-gray-100 bg-white py-14 mt-10"
            >
                <div className="mx-auto max-w-7xl px-6">

                    {/* TOP */}
                    <div className="grid gap-12 md:grid-cols-3">

                        {/* Logo */}
                        <div>
                            <img className="h-20 w-auto" src={Logo} alt="PlannersDay" />

                            <p className="mt-4 text-sm leading-relaxed text-gray-500 max-w-sm">
                                © 2026 PlannersDay. Todos los derechos reservados.
                            </p>
                        </div>

                        {/* Producto */}
                        <div className="md:mx-auto">
                            <h3 className="text-2xl font-black text-gray-900">
                                Producto
                            </h3>

                            <div className="mt-5">
                                <a
                                    href="https://play.google.com/store/apps/details?id=com.citafix.cita_fix&hl=es_419"
                                    className="group inline-flex items-center gap-2 text-gray-500 transition hover:text-black"
                                >
                                    <span>Descarga la app</span>

                                    <span className="transition group-hover:translate-x-1">
                                        →
                                    </span>
                                </a>
                            </div>
                        </div>

                        {/* Contacto */}
                        <div className="md:text-right">
                            <h3 className="text-2xl font-black text-gray-900">
                                Contáctanos
                            </h3>

                            <div className="mt-5 space-y-2">
                                <p className="text-sm text-gray-500">
                                    soporte.plannersday@gmail.com
                                </p>

                                <p className="text-sm text-gray-500">
                                    ¡Estaremos encantados de ayudarte!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* BOTTOM */}
                    <div className="mt-14 flex flex-col items-center justify-between gap-6 border-t border-gray-100 pt-8 md:flex-row">

                        {/* Links */}
                        <div className="flex flex-wrap items-center gap-6 text-sm font-semibold">
                            <a
                                // href="https://www.plannersday.com/deleteUser"
                                onClick={() => navigate("/deleteUser")}
                                className="cursor-pointer transition hover:text-gray-500"
                            >
                                Borrar Cuenta
                            </a>

                            <a
                                // href="https://www.plannersday.com/politica-de-privacidad"
                                onClick={() => navigate("/politica-de-privacidad")}
                                className="transition hover:text-gray-500"
                            >
                                Política de privacidad
                            </a>
                        </div>

                        {/* Social */}
                        <div className="flex gap-6 text-sm text-gray-500">
                            <a
                                href="https://www.instagram.com/planners.day"
                                className="transition hover:text-black"
                            >
                                Instagram
                            </a>

                            <a href="https://www.facebook.com/share/18oWt2k8SU" className="transition hover:text-black">
                                Facebook
                            </a>

                            <a
                                href="https://api.whatsapp.com/send/?phone=8116048150&text=Hola, ¿Tengo una duda sobre la plataforma?&type=phone_number&app_absent=0"
                                className="transition hover:text-black"
                            >
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
            {/* Modal */}
            {isOpen && indexEmp && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative animate-fade-in-up">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-3 right-3 text-gray-500 hover:text-orange-500"
                            >
                                <CloseIcon className="w-5 h-5" />
                            </button>
                            {/* Imagen */}
                            <div className="flex justify-center mb-4">
                                {indexEmp.PHOTO ? (
                                    <img
                                        className="w-32 h-32 object-cover rounded-full border"
                                        src={`data:image/jpeg;base64,${arrayBufferToBase64(indexEmp.PHOTO.data)}`}
                                    />
                                ) : (
                                    <img className="w-32 h-32 object-cover rounded-full border" id='store' src={Store} />
                                )}
                            </div>
                            <h4 className="text-xl font-bold text-center mb-1">{indexEmp.DORSL}</h4>
                            <p className="text-center text-yellow-500 mb-1">{StarRating(indexEmp.SERVICE_LEVEL)}</p>
                            <p className="text-center text-gray-500 mb-4">{indexEmp.SUBCATEGORY}</p>
                            <hr className="mb-4" />
                            <div>
                                <h5 className="text-sm font-semibold mb-2">Reseñas de clientes</h5>
                                <div className="space-y-3 max-h-60 overflow-y-auto">
                                    {qualifications.length > 0 ? (
                                        qualifications.map((q) => (
                                            <div key={q.SERVICE_LEVEL_DATE} className="text-sm text-gray-700">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium">{q.USER}</span>
                                                    <span>{StarRating(q.SERVICE_LEVEL)}</span>
                                                </div>
                                                <p className="text-xs text-gray-400">{q.SERVICE_LEVEL_DATE}</p>
                                                <p className="text-sm mt-1">{q.COMMENTS}</p>
                                                <hr className="my-2" />
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 text-sm">Este negocio aún no tiene reseñas.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Landing;