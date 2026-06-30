// rrd imports
import { dateSpanish } from "../Wrapper.js";

import { EnvelopeIcon, InformationCircleIcon, XCircleIcon, TagIcon, StarIcon, ChevronRightIcon, CalendarDaysIcon, ClockIcon, TrophyIcon, PlayCircleIcon, PencilSquareIcon, BuildingStorefrontIcon, MapPinIcon, ChatBubbleLeftEllipsisIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import User from "../assets/e.png";

export function VistaCita({ cita, photoBase64, setIsOpenC, setIsOpen, bAcceder }) {

    function ConvertDateTime(date, time, flag) {
        var parts = date.split('-');
        var partsTime = time.split(':');
        var formattedDate = new Date(parts[0], parts[1] - 1, parts[2], partsTime[0], partsTime[1], partsTime[2]);
        const timeString = formattedDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
        if (flag == 0) {
            return dateSpanish(formattedDate);
        }
        else {
            return `${timeString}`;
        }

    }

    const getEstadoActual = () => {
        if (cita.ESTATUS == -1) {
            return {
                titulo: "Cancelada",
                descripcion: "La cita fue cancelada.",
                icon: XCircleIcon,
                bg: "bg-red-100",
                color: "text-red-600",
                colorT: "text-red-900",
                colorD: "text-red-500"
            };
        }

        if (cita.ESTATUS == 3) {
            return {
                titulo: "En curso",
                descripcion: "Actualmente la cita se encuentra en proceso.",
                icon: PlayCircleIcon,
                bg: "bg-blue-100",
                color: "text-blue-600",
                colorT: "text-blue-900",
                colorD: "text-blue-500"
            };
        }

        if (cita.ESTATUS == 2) {
            return {
                titulo: "Finalizada",
                descripcion: "La cita terminó correctamente.",
                icon: TrophyIcon,
                bg: "bg-orange-100",
                color: "text-orange-600",
                colorT: "text-orange-900",
                colorD: "text-orange-500"
            };
        }

        if (cita.APPOINTMENT_CONFIRM == 1) {
            return {
                titulo: "Confirmada",
                descripcion: "Has confirmado con éxito tu asistencia.",
                icon: CheckBadgeIcon,
                bg: "bg-green-100",
                color: "text-green-600",
                colorT: "text-green-900",
                colorD: "text-green-500"
            };
        }

        return {
            titulo: "Pendiente",
            descripcion: "Próxima cita en tu calendario.",
            icon: ClockIcon,
            bg: "bg-gray-100",
            color: "text-gray-600",
            colorT: "text-gray-900",
            colorD: "text-gray-500"
        };
    };

    const estado = getEstadoActual();
    const Icon = estado.icon;

    const historial = [];

    historial.push({
        icon: CalendarDaysIcon,
        texto: "Reservada",
        bg: "bg-orange-100",
        color: "text-orange-600"
    });

    if (cita.APPOINTMENT_CONFIRM == 1)
        historial.push({
            icon: CheckBadgeIcon,
            texto: "Confirmada",
            bg: "bg-green-100",
            color: "text-green-600"
        });

    if (cita.ESTATUS == 1)
        historial.push({
            icon: PencilSquareIcon,
            texto: "Modificada por la empresa",
            bg: "bg-yellow-100",
            color: "text-yellow-600"
        });

    if (cita.ESTATUS == 3)
        historial.push({
            icon: PlayCircleIcon,
            texto: "En curso",
            bg: "bg-blue-100",
            color: "text-blue-600"
        });

    if (cita.ESTATUS == 2) {
        historial.push({
            icon: PlayCircleIcon,
            texto: "En curso",
            bg: "bg-blue-100",
            color: "text-blue-600"
        });
        historial.push({
            icon: TrophyIcon,
            texto: "Finalizada",
            bg: "bg-orange-100",
            color: "text-orange-600"
        });
    }

    if (cita.ESTATUS == -1)
        historial.push({
            icon: XCircleIcon,
            texto: "Cancelada",
            bg: "bg-red-100",
            color: "text-red-600"
        });

    const canCalificar = cita.ESTATUS == 2 && cita.FLAG_SERVICE_LEVEL == 0;

    return (
        <>
            <div className="flex flex-col items-center">
                <div className="relative">
                    {photoBase64 ? (
                        <img className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl ring-4 ring-orange-100" src={`data:image/jpeg;base64,${photoBase64}`} alt="business" />
                    ) : (
                        <img className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl ring-4 ring-orange-100" src={User} alt="default" />
                    )}
                </div>
                <div className="mt-5 text-center">
                    <h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-900">
                        {cita.DORSL}
                    </h2>

                    <p className="text-sm text-gray-500">
                        Toda la información de tu cita.
                    </p>
                </div>
            </div>

            <div className={`flex items-center justify-center items-center gap-2 rounded-xl font-medium px-4 py-2 mt-4 ${estado.bg} ${estado.color}`}>
                <div className={`rounded-full ${estado.bg} p-2`}>
                    <Icon className={`w-5 h-5 ${estado.color}`} />
                </div>
                <div>
                    <p className={`font-semibold ${estado.colorT}`}>
                        {estado.titulo}
                    </p>
                    <p className={`text-sm ${estado.colorD}`}>
                        {estado.descripcion}
                    </p>
                </div>
            </div>
            {bAcceder ? cita.ESTATUS == -1 || cita.FLAG_SERVICE_LEVEL == 1 ? <></> : (
                <div role="button" tabIndex={0}
                    onClick={() => {
                        if (canCalificar) {
                            setIsOpenC(true);
                        } else {
                            setIsOpen(true);
                        }
                    }}  
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            if (canCalificar) {
                                setIsOpenC(true);
                            } else {
                                setIsOpen(true);
                            }
                        }
                    }}
                    className={`mt-5 rounded-2xl border p-5 cursor-pointer hover:shadow-md transition-all
                ${canCalificar ? 'border-orange-200 bg-orange-50 hover:border-orange-300' : 'border-gray-200 bg-white hover:border-red-300'}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`rounded-full p-3 ${canCalificar ? 'bg-orange-100' : 'bg-red-100'}`}>
                                {canCalificar ? <StarIcon className="w-6 h-6 text-orange-600" />
                                    : <XCircleIcon className="w-6 h-6 text-red-600" />}

                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">
                                    {canCalificar ? 'Calificar experiencia'
                                        : 'Cancelar cita'}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {canCalificar
                                        ? "Comparte tu opinión sobre el servicio recibido."
                                        : "Solo podrás cancelarla antes de que inicie."}
                                </p>
                            </div>
                        </div>
                        <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                    </div>
                </div>) :
                <div className="mt-5 rounded-2xl border bg-gray-50 p-5">
                    <div className="flex items-center gap-3 animate-pulse">
                        <div className="rounded-full bg-gray-200 p-3">
                            <ClockIcon className="w-6 h-6 text-gray-500" />
                        </div>
                        <div>
                            <p className="font-semibold">
                                Procesando...
                            </p>
                            <p className="text-sm text-gray-500">
                                Espera un momento.
                            </p>
                        </div>
                    </div>
                </div>
            }
            <div className="flex justify-center gap-3 mt-5">
                <div className="bg-orange-50 items-left rounded-xl px-5 py-3">
                    <p className="text-xs uppercase text-orange-500">
                        🕒 Hora
                    </p>
                    <p className="font-bold text-orange-700">
                        {ConvertDateTime(cita.APPOINTMENT_DATE, cita.APPOINTMENT_TIME, 1)}
                    </p>
                </div>
                <div className="bg-gray-100 rounded-xl px-5 py-3">
                    <p className="text-xs uppercase text-gray-500">
                        📅 Fecha
                    </p>
                    <p className="font-bold text-gray-700">
                        {ConvertDateTime(cita.APPOINTMENT_DATE, cita.APPOINTMENT_TIME, 0)}
                    </p>
                </div>
            </div>
            {cita.ALIAS == '' ? <></> : <div className="mt-5 rounded-xl border border-orange-200 bg-orange-50 p-4">
                <div className="flex items-start gap-3">

                    <div className="rounded-full bg-orange-100 p-2">
                        <TagIcon className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-orange-700">
                            Área asignada
                        </p>

                        <p className="text-lg font-semibold text-gray-900">
                            {cita.ALIAS}
                        </p>

                        {cita.NAME_SPACE && (
                            <p className="text-sm text-gray-600">
                                {cita.NAME_SPACE}
                            </p>
                        )}
                    </div>

                </div>
            </div>}

            {cita.BUS_USER_PHONE &&
                <div className="mt-6 w-full rounded-xl border hover:border-green-400 hover:bg-green-50 hover:shadow-md transition-all duration-200 cursor-pointer p-4"
                    onClick={() => {
                        const cleanNumber = cita.BUS_USER_PHONE.replace(/\D/g, '');
                        if (navigator.platform.indexOf('iPhone') !== -1 || navigator.platform.indexOf('iPad') !== -1 || navigator.platform.indexOf('iPod') !== -1) {
                            window.open(`https://api.whatsapp.com/send/?phone=${cleanNumber}&text=Hola, ¿Tengo una duda sobre mi cita?&type=phone_number&app_absent=0`);
                        } else {
                            window.open(`https://api.whatsapp.com/send/?phone=${cleanNumber}&text=Hola, ¿Tengo una duda sobre mi cita?&type=phone_number&app_absent=0`);
                        }
                    }}>
                    <div className="flex items-center">
                        <div className="bg-green-100 rounded-full p-3">
                            <EnvelopeIcon className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="font-semibold text-gray-900">
                                Enviar mensaje
                            </p>
                            <p className="text-sm text-gray-500">
                                {cita.BUS_USER_PHONE}
                            </p>
                        </div>
                    </div>
                </div>}

            {cita.FLAG_ADDRESS != '0' ?
                <div className="mt-4 flex justify-center">
                    <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                        🏠 Servicio a domicilio
                    </span>
                </div> : <></>}

            <section className="mt-8">

                <div className="rounded-2xl border bg-white p-5">
                    <h4 className="text-lg font-semibold">Historial de la cita</h4>

                    {historial.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 py-2">
                            <div className={`rounded-full p-2 ${item.bg}`}>
                                <item.icon className={`w-5 h-5 ${item.color}`} />
                            </div>

                            <p className="font-medium text-gray-700">
                                {item.texto}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mt-8">
                <div onClick={() => {
                    if (navigator.platform.indexOf('iPhone') !== -1 || navigator.platform.indexOf('iPad') !== -1 || navigator.platform.indexOf('iPod') !== -1) {
                        window.open(`maps://maps.google.com/?q=${cita.ADDRESS_FIRST} ${cita.ADDRESS_SECOND} CP ${cita.POSTAL_CODE} ${cita.CITY}, ${cita.STATE} Mexico`);
                    } else {
                        window.open(`https://maps.google.com?q=${cita.ADDRESS_FIRST} ${cita.ADDRESS_SECOND} CP ${cita.POSTAL_CODE} ${cita.CITY}, ${cita.STATE} Mexico`);
                    }
                }}
                    className="rounded-2xl border p-5 cursor-pointer hover:shadow-md hover:border-orange-300 transition-all">

                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-orange-100 p-3">
                            <MapPinIcon className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">
                                Ubicación
                            </h4>
                            <div className="mt-2 text-gray-600">
                                <p>
                                    {cita.ADDRESS_FIRST}
                                </p>
                                {cita.ADDRESS_SECOND && (
                                    <p>
                                        {cita.ADDRESS_SECOND}
                                    </p>
                                )}
                                <p>
                                    {cita.CITY}, {cita.STATE}
                                </p>
                                <p>
                                    C.P. {cita.POSTAL_CODE}
                                </p>
                            </div>
                        </div>
                        <ChevronRightIcon className="w-5 h-5 text-orange-600" />
                    </div>
                </div>
            </section>

            <section className="mt-8">
                <div className="rounded-2xl border p-5">
                    <div className="flex items-start gap-4">
                        <div className="rounded-full bg-orange-100 p-3 flex-shrink-0">
                            <ChatBubbleLeftEllipsisIcon className="w-6 h-6 text-orange-600" />
                        </div>

                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">
                                Tu comentario
                            </h4>
                            <div className="mt-3 rounded-xl bg-orange-50 p-4">
                                <p className="text-gray-700 leading-relaxed italic">
                                    {cita.MENSSAGE || "No agregaste ningún comentario."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


        </>);
}

export default VistaCita;