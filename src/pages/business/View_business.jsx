// Library
import { BuildingStorefrontIcon, MapPinIcon, PhoneIcon, ClockIcon, StarIcon, LinkIcon } from '@heroicons/react/24/solid';
// import '../../components/CardBusiness.css';
// assents
import Store from "../../assets/business.png";
import Logo from "../../assets/splash.png";
import Loaging from '../../components/Loading.jsx';
// rrd imports
import { useLoaderData, useNavigate, useSearchParams } from 'react-router-dom';
import { urlApi } from "../../styles/Constants.jsx";
import { useEffect, useState, useRef } from "react";
import { fetchData } from '../../Wrapper.js';
import { toast } from "react-toastify";
import html2canvas from "html2canvas";

const StarRating = (stars) => '⭐'.repeat(stars);
const StarRatingNot = (stars) => "✰".repeat(stars);

// loader
export async function ViewBusinessLoader() {
    const sCorreo = fetchData("correo");
    const sPassword = fetchData("pwd");
    return { sCorreo, sPassword };
}

export function ViewBusiness() {
    const navigate = useNavigate();
    const { sCorreo, sPassword } = useLoaderData();
    const [loading, setLoading] = useState(true);
    const [qualifications, setQualifications] = useState([]);
    const [horario, setHorario] = useState([]);

    const [searchParams] = useSearchParams();
    const businessId = searchParams.get("i");
    const businessDORSL = searchParams.get("n");

    const [sURL, setURL] = useState();
    const [empresa, SetEmpresa] = useState([]);
    const previewRef = useRef();

    // Function to convert Base64 string to binary data
    const arrayBufferToBase64 = (buffer) => {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return btoa(binary);
    };

    // Formatea la fecha en español (27 de noviembre de 2025)
    function formatDate(iso) {
        if (!iso) return "";
        try {
            var parts = iso.split('-');
            const d = new Date(parts[0], parts[1] - 1, parts[2]);
            return d.toLocaleDateString("es-ES", {
                weekday: "long",
                day: "numeric",
                month: "short",
            })
                .replace(".", "") // Quita puntos como "mié."
                .replace(/\b\w/g, c => c.toLowerCase()); // Asegura minúsculas
        } catch {
            return iso;
        }
    }

    // Descargar como imagen (opcional). Requiere html2canvas instalado
    async function downloadAsImage() {
        try {
            const node = previewRef.current;
            if (!node) return;

            const canvas = await html2canvas(node, { scale: 2 });
            const dataUrl = canvas.toDataURL("image/png");

            const blob = await (await fetch(dataUrl)).blob();
            const file = new File([blob], "invitacion.png", { type: "image/png" });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file], sURL,
                });
                return;
            }

            const link = document.createElement("a");
            link.download = `${empresa.DORSL}_citas_disponibles.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
            toast.info("Descargamos la imagen porque tu navegador no soporta compartir archivos.");

        } catch (e) {
            console.error(e);
            toast.error("Ocurrió un error generando la imagen.");
        }

    }

    useEffect(() => {
        // Cargar user info desde loader
        if (!businessId && !businessDORSL) {
            navigate("/");
        }
        const fData = async () => {
            //Solicitar por GET
            try {
                const response = await fetch(`${urlApi}bussinessId?bussiness_id=${businessId}`);
                if (response.status == 200) {
                    const json = await response.json();
                    SetEmpresa(json['data']);
                    const baseUrl = 'https://app.plannersday.com/viewBusiness';
                    const params = new URLSearchParams({
                        n: businessDORSL,
                        i: businessId
                    });
                    setURL(`${baseUrl}?${params.toString()}`);
                    try {
                        const response = await fetch(`${urlApi}getBusCalif?bussiness_id=${businessId}`);
                        const json = await response.json();
                        if (json['sucess']) {
                            setQualifications(json['data']);
                        }
                        else {
                            setQualifications([]);
                        }
                        //Solicitar por GET
                        try {
                            const response = await fetch(`${urlApi}appoinBussDate?bussiness_id=${businessId}`);
                            if (response.status == 200) {
                                const json = await response.json();
                                setHorario(json['data']);
                            } else {
                                console.log(`Error getting schedule.`);
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                            setLoading(false);
                        }
                        catch (e) {
                            setLoading(false);
                            return;
                        }
                    }
                    catch (e) {
                        setLoading(false);
                        return;
                    }
                } else {
                    console.log(`Error getting bussinessId.`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }
            catch (e) {
                setLoading(false);
                return;
            }
        };
        fData();
    }, []);

    if (loading) {
        return <Loaging />;
    }

    const photoBase64 = arrayBufferToBase64(empresa.PHOTO == null ? empresa.PHOTO : empresa.PHOTO.data);

    return (
        <div>

            {
                sCorreo == null & sPassword == null ? <div className="flex justify-between items-center w-full bg-white">
                    <a href="https://www.plannersday.com/"><img className='h-10 w-auto' src={Logo} alt="" /></a>
                    <a href="https://app.plannersday.com/"><span className='mr-10 text-orange-600 text-auto'>Iniciar sesión</span></a>
                </div> : <div></div>
            }

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-600 to-gray-800 p-4">
                <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-6 text-center mt-20">
                    {/* BOTÓN copy enlace */}
                    <button onClick={() => {
                        navigator.clipboard.writeText(sURL);
                        window.open(
                            `https://wa.me/?text=${encodeURIComponent('Próximas citas disponibles: ' + sURL)}`,
                            "_blank"
                        );
                        return toast.info(`El enlace se ha copiado en el portapapeles`);
                    }}
                        className="w-full flex items-center justify-end"
                    >
                        <LinkIcon className="w-10 h-10 text-orange-500 flex-shrink-0" />
                    </button>
                    <div className="flex flex-col items-center">
                        {photoBase64 ? (
                            <img className="w-64 h-64 rounded-full object-cover border mt-4" src={`data:image/jpeg;base64,${photoBase64}`} alt="business" />
                        ) : (
                            <img className="w-64 h-64 rounded-full object-cover border mt-4 bg-gray-200" src={Store} alt="default" />
                        )}
                        <h3 className="text-2xl font-bold mt-4 text-black">{empresa.DORSL}</h3>
                        <p className="text-gray-500 mb-3">{empresa.CATEGORY}</p>
                        <p className={`text-center text-xl mb-4 ${empresa.SERVICE_LEVEL == 0 ? 'text-gray-500' : 'text-yellow-500'}`}>
                            {empresa.SERVICE_LEVEL == 0 ? StarRatingNot(5) : StarRating(empresa.SERVICE_LEVEL)}
                        </p>
                    </div>
                    <hr className="my-4" />
                    <div className="w-full flex items-center gap-3 px-4 mt-2" style={{
                        cursor: 'pointer'
                    }}
                        onClick={() => {
                            if (navigator.platform.indexOf('iPhone') !== -1 || navigator.platform.indexOf('iPad') !== -1 || navigator.platform.indexOf('iPod') !== -1) {
                                window.open(`maps://maps.google.com/?q=${empresa.ADDRESS_FIRST} ${empresa.ADDRESS_SECOND} CP ${empresa.POSTAL_CODE} ${empresa.CITY}, ${empresa.STATE} Mexico`);
                            } else {
                                window.open(`https://maps.google.com?q=${empresa.ADDRESS_FIRST} ${empresa.ADDRESS_SECOND} CP ${empresa.POSTAL_CODE} ${empresa.CITY}, ${empresa.STATE} Mexico`);
                            }
                        }}>
                        <MapPinIcon className="w-6 h-6 text-orange-500" />
                        <div className="text-left">
                            <p className="text-gray-500">{empresa.ADDRESS_FIRST} {empresa.ADDRESS_SECOND} CP {empresa.POSTAL_CODE}</p>
                            <p className="text-gray-500">{empresa.CITY}, {empresa.STATE}</p>
                        </div>
                    </div>
                    <div className="w-full flex items-center gap-3 px-4 mt-2 mb-2">
                        <PhoneIcon className="w-6 h-6 text-orange-500" />
                        <div className="text-left">
                            <p className="text-gray-500">{empresa.phone || 'Este negocio aún no ha agregado información de contacto.'}</p>
                        </div>
                    </div>
                    <hr className="my-4" />
                    {
                        sCorreo == null & sPassword == null ?
                            <div className="text-left px-4 mb-2">
                                <h4 className="text-sm font-semibold">Citas disponibles.</h4>
                                <h4 className="text-sm font-semibold">En tus redes sociales</h4>
                            </div> : <div className="text-left px-4 mb-2">
                                <h4 className="text-sm font-semibold">Comparte tus próximas citas disponibles.</h4>
                                <h4 className="text-sm font-semibold">En tus redes sociales</h4>
                            </div>
                    }
                    <div
                        ref={previewRef}
                        className="bg-gradient-to-br from-gray-200 to-indigo-50 border border-gray-100 rounded-2xl p-6 shadow-md"
                    >
                        <div className="flex justify-start">
                            {photoBase64 ? (
                                <img className="w-12 h-12 rounded-full object-cover border mt-4" src={`data:image/jpeg;base64,${photoBase64}`} alt="business" />
                            ) : (
                                <img className="w-12 h-12 rounded-full object-cover border mt-4 bg-gray-200" src={Store} alt="default" />
                            )}
                            <div className="text-start ml-4">
                                <h3 className="text-2xl font-bold mt-4 text-black">{empresa.DORSL}</h3>
                                <p className="text-gray-500 mb-3">{empresa.CATEGORY}</p>
                            </div>
                        </div>
                        <div className="text-start">
                            {horario.length > 0 ? (
                                horario.slice(0, 5).map((h) => (
                                    <div className="w-full flex items-center gap-3 px-4 mt-2 mb-2">
                                        <ClockIcon className="w-10 h-10 text-orange-500" />
                                        <div>
                                            <p className="text-gray-500">{formatDate(h.APPOINTMENT_DATE)}</p>
                                            <p className="text-gray-500">Disponibles : <strong>{h.APPOINTMENT.filter(a => a.STATUS === "free").length}</strong></p>
                                        </div> </div>
                                ))
                            ) :
                                <></>
                            }
                        </div>
                    </div>
                    {
                        sCorreo == null & sPassword == null ?
                            <></> : <div>
                                <button
                                    onClick={downloadAsImage}
                                    className="w-full py-3 mt-4 rounded-md font-bold text-white bg-orange-500 hover:bg-orange-600"
                                >
                                    Compartir imagen
                                </button>
                            </div>
                    }
                    <hr className="my-4" />
                    <div className="text-left px-4">
                        <h4 className="text-lg font-semibold">Reseñas de clientes</h4>
                        <div>
                            {qualifications.length > 0 ? (
                                qualifications.map((q) => (
                                    <div key={q.SERVICE_LEVEL_DATE} className="text-sm text-gray-700">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">{q.USER}</span>
                                            <span>{StarRating(q.SERVICE_LEVEL)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs text-gray-400">{q.SERVICE_LEVEL_DATE}</p>
                                            <p className="text-sm mt-1">{q.COMMENTS}</p>
                                        </div>
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
        </div>
    );
}

export default ViewBusiness;