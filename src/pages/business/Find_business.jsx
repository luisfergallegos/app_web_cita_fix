
// rrd imports
import { useLoaderData, useNavigate } from 'react-router-dom';
import { fetchData } from "../../Wrapper.js";
import { useEffect, useState } from "react";
// assets
import { urlApi } from "../../styles/Constants.jsx";
import Logo from "../../assets/splash.png";
import Store from "../../assets/business.png";
import { MagnifyingGlassIcon, XMarkIcon as CloseIcon } from '@heroicons/react/24/solid';
import CardBusiness from '../../components/CardBusiness.jsx';
import Loaging from '../../components/Loading.jsx';

// Loader que se usa en App.jsx
export function findBusinessLoader() {
    const correo = fetchData("correo");
    const pwd = fetchData("pwd");
    // const user = fetchData("UserCitaFix");
    return { correo, pwd };
}

export function FindBusiness() {
    const navigate = useNavigate();
    const { correo, pwd } = useLoaderData();
    const [loading, setLoading] = useState(true);
    const [empresas, setEmpresas] = useState([]);
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
        if (value == "") {
            setFilteredNames(empresas);
            setShowInput(false);
        } else {
            setShowInput(true);
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

    return (

        <div>
            {
                correo == null & pwd == null ? <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                        <div className="text-2xl font-bold tracking-tight">
                            <a href="https://www.plannersday.com/"><img className='h-10 w-auto' src={Logo} alt="" /></a>
                        </div>
                        <nav className="hidden gap-8 md:flex">
                        </nav>
                        <button className="rounded-full bg-orange-600 px-5 py-2 text-sm font-semibold text-white transition hover:scale-105"
                            onClick={() => navigate("/login")}>
                            Iniciar sesión
                        </button>
                    </div>
                </header> : <div></div>
            }
            <div className="min-h-screen mt-10 bg-orange-600 px-4 py-10">
                <div className="overflow-hidden rounded-[3rem] px-8 py-16 text-center text-white md:px-16">
                    <h2 className="text-4xl font-black md:text-6xl">
                        Encuentra servicios y agenda tu cita
                    </h2>

                    <p className="mx-auto mt-6 mb-2 max-w-2xl text-lg text-white">
                        Explora opciones cerca de ti y reserva cuando quieras.
                    </p>
                    {/* Buscador */}
                    <div className="relative w-full max-w-lg mb-10 mx-auto">

                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>

                        <input
                            type="text"
                            name="searchText"
                            value={searchText}
                            onChange={handleChange}
                            placeholder="Explorar servicios"
                            className="w-full pl-10 pr-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-400 outline-none text-gray-800 placeholder-gray-400"
                        />
                        {showInput == true ? <button
                            onClick={() => { setShowInput(false); setSearchText(""); setFilteredNames([]); }}
                            className="absolute top-3 right-3 text-gray-500 hover:text-orange-500"
                        >
                            <CloseIcon className="w-5 h-5" />
                        </button> : <></>}
                    </div>

                    {/* Resultados o sugerencias */}
                    {searchText !== "" ? (
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
                    ) : (
                        <div className="text-white space-y-4">
                            <div className="mt-10 max-w-5xl mx-auto">
                                {empresas[index] && (
                                    <div className="grid justify-center">
                                        <div className="flex items-center mb-4 text-left">
                                            <h3 className="inline-flex items-center gap-2 text-lg font-semibold text-white">
                                                <span>✨</span>
                                                <span>Servicios destacados</span>
                                            </h3>
                                        </div>
                                        <CardBusiness
                                            key={empresas[index].BUSSINESS_ID}
                                            userId={userId}
                                            userName={userName}
                                            empresa={empresas[index]}
                                            setIsOpen={setIsOpen}
                                            setIndexEmp={setIndexEmp}
                                            setQualifications={setQualifications}
                                            setSelectBusiness={setSelectBusiness}
                                            selectBusiness={selectBusiness}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

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
            </div>
        </div>
    );
}

export default FindBusiness;