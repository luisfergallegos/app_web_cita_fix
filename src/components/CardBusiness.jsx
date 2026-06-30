// Library
import {
    MapPinIcon,
    PhoneIcon,
    CalendarDaysIcon,
    ChevronRightIcon,
    PlusCircleIcon,
    CheckBadgeIcon
} from "@heroicons/react/24/solid";
// assets
import Store from "../assets/business.png";
// rrd imports
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { urlApi } from "../styles/Constants.jsx";

const StarRating = (stars) => "⭐".repeat(stars);
const StarRatingNot = (stars) => "✰".repeat(stars);


export function CardBusiness({
    key,
    userId,
    userName,
    empresa,
    setIsOpen,
    setIndexEmp,
    setQualifications,
    setSelectBusiness,
    selectBusiness
}) {
    const navigate = useNavigate();


    const arrayBufferToBase64 = (buffer) => {
        let binary = "";
        let bytes = [...new Uint8Array(buffer)];
        bytes.forEach((b) => (binary += String.fromCharCode(b)));
        return btoa(binary);
    };

    const {
        BUSSINESS_ID,
        USER_ID,
        DORSL,
        PHOTO,
        SUBCATEGORY,
        SERVICE_LEVEL,
        ADDRESS_FIRST,
        ADDRESS_SECOND,
        POSTAL_CODE,
        CITY,
        STATE,
        phone,
        Horario,
    } = empresa;

    const desplegarPantallaAddAppoin = async (e) => {
        e.stopPropagation();
        if (!userName) {
            navigate("/addAppoinBusinessAnon", { state: { empresa: empresa, selectSpace: [] } });
        }
        else {
            navigate("/addAppoin", {
                state: { userId: userId, userName: userName, business: empresa },
            });
        }

    };

    const handleButtonIcon = async (e) => {
        e.stopPropagation();
        setIsOpen(true);
        setIndexEmp(empresa);

        try {
            const response = await fetch(
                `${urlApi}getBusCalif?bussiness_id=${empresa["BUSSINESS_ID"]}`
            );
            const json = await response.json();

            if (json.sucess) setQualifications(json.data);
            else setQualifications([]);

            if (!response.ok) throw new Error("Error al obtener calificaciones");
        } catch (e) {
            return;
        }
    };

    const handleADDRESS = (e) => {
        e.stopPropagation();
        const url = `${ADDRESS_FIRST} ${ADDRESS_SECOND} CP ${POSTAL_CODE} ${CITY}, ${STATE} Mexico`;

        if (/iPhone|iPad|iPod/.test(navigator.platform)) {
            window.open(`maps://maps.google.com/?q=${url}`);
        } else {
            window.open(`https://maps.google.com?q=${url}`);
        }
    };

    const handleViewProfile = async () => {
        const baseUrl = '/viewBusiness';
        const params = new URLSearchParams({
            n: DORSL,
            i: BUSSINESS_ID
        });
        navigate(`${baseUrl}?${params.toString()}`);

    };

    const getBusinessStatus = (Horario) => {
        const horario = Horario == "Siempre abierto" ? "Lu 01-23, Ma 01-23, Mi 01-23, Ju 01-23, Vi 01-23, Sá 01-23, Do 01-23" : Horario;
        const dias = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];

        const now = new Date();

        const diaActual = dias[now.getDay()];
        const horaActual = now.getHours() + now.getMinutes() / 60;

        const bloques = horario.split(',');

        const horarioHoy = bloques.find(
            item => item.trim().startsWith(diaActual)
        );

        if (!horarioHoy) {
            return {
                abierto: false,
                mensaje: "Cerrado hoy"
            };
        }

        const match = horarioHoy.match(/(\d+)-(\d+)/);

        if (!match) {
            return {
                abierto: false,
                mensaje: "Horario no disponible"
            };
        }

        const apertura = parseInt(match[1]);
        const cierre = parseInt(match[2]);

        const abierto = horaActual >= apertura && horaActual < cierre;

        return {
            abierto,
            mensaje: abierto
                ? `Abierto hasta las ${cierre}:00`
                : `Cerrado`
        };
    };

    const { abierto, mensaje } = getBusinessStatus(Horario);

    return (
        <div
            className="bg-white shadow-xl rounded-3xl p-6 w-full max-w-lg mx-auto cursor-pointer border border-white 
                hover:scale-105 hover:shadow-2xl transition-all "
            onClick={() => {
                setSelectBusiness(selectBusiness == BUSSINESS_ID ? null : BUSSINESS_ID);
            }}
        >
            {/* BOTÓN AddAppoin */}
            {selectBusiness == BUSSINESS_ID ? <button
                onClick={desplegarPantallaAddAppoin}
                className="w-full mt-4 mb-4 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-semibold transition"
            >
                Agendar cita
            </button> : <></>}
            {/* ICONO GRANDE */}
            <div
                className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-white shadow-lg mx-auto flex items-center justify-center overflow-hidden">
                {PHOTO == null ? (
                    <img
                        src={Store}
                        className="w-full h-full object-contain opacity-70 bg-gray-400"
                        alt="store"
                    />
                ) : (
                    <img
                        src={`data:image/jpeg;base64,${arrayBufferToBase64(PHOTO.data)}`}
                        className="w-full h-full object-cover"
                    />
                )}
            </div>

            {/* CALIFICACIÓN */}
            <p className={`text-center text-xl ${SERVICE_LEVEL == 0 ? 'text-gray-500' : 'text-yellow-500'}`}>
                {SERVICE_LEVEL == 0 ? StarRatingNot(5) : StarRating(SERVICE_LEVEL)}
            </p>
            {/* BOTÓN CALIFICACIONES */}
            <button
                onClick={handleButtonIcon}
                className="w-full flex items-center justify-center text-gray-600 text-base"
            >
                <span className="mr-2">Ver reseñas</span>
            </button>
            {/* HORARIO */}
            <div className="flex items-center justify-center gap-2 mt-2">
                <div
                    className={`w-3 h-3 rounded-full ${abierto
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                />
                <span
                    className={`font-medium ${abierto
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                >
                    {mensaje}
                </span>
            </div>

            {/* TITULO */}
            <h4 className="text-2xl font-bold text-center text-gray-900 mt-6">
                {DORSL}
            </h4>
            <p className="text-center text-gray-500 text-lg mb-2">{SUBCATEGORY}</p>


            {/* BOTÓN VER PERFIL */}
            <button
                onClick={(e) => {
                    e.stopPropagation(); // evita que active el onClick del card
                    handleViewProfile();
                }}
                className="mt-2 mx-auto block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-full transition-all"
            >
                Más información
            </button>



            <hr className="my-4 border-gray-200" />

            {/* DIRECCIÓN */}
            <div className="flex gap-4 mb-3 items-start">
                <p
                    className="text-gray-500 text-sm leading-tight cursor-pointer"
                    onClick={handleADDRESS}
                >
                   📍 {CITY}, {STATE}
                </p>
            </div>

            {/* TELÉFONO */}
            <div className="flex gap-4 mb-3 items-center">
                {phone !== "" ? <a href={`tel:${phone}`} className="text-gray-500 text-sm">
                    📞 Llamar ahora
                </a> : <div className="text-gray-500 text-sm">
                    Este negocio aún no ha agregado información de contacto.
                </div>}                
            </div>

        </div>
    );
}

export default CardBusiness;