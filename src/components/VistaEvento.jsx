// rrd imports
import { dateSpanish } from "../Wrapper.js";

import EventoPng from "../assets/evento.png";

import { EnvelopeIcon, ClockIcon } from '@heroicons/react/24/solid';

export function VistaEvento({ evento, cita, indexConfirm, indexConfirmNot, bAcceder }) {

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

    const TextoConLinks = ({ text = "" }) => {
        const regex = /(https?:\/\/[^\s]+)/g;

        const partes = text.split(regex);

        return (
            <p className="font-medium">
                {partes.map((parte, index) =>
                    regex.test(parte) ? (
                        <a key={index} href={parte} target="_blank" rel="noopener noreferrer" style={{ color: "blue" }}>
                            {parte}
                        </a>
                    ) : (
                        <span key={index}>{parte}</span>
                    )
                )}
            </p>
        );
    };

    const canCalificar = cita.ESTATUS == 2 ;

    return (
        <>
            <div className="flex flex-col items-center">
                <div className="relative">
                    <img className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl ring-4 ring-orange-100" src={EventoPng} alt="default" />
                </div>
                <div className="mt-5 text-center">
                    <h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-900">
                        {cita.DORSL}
                    </h2>
                    <p className="mb-2 text-sm text-gray-700">
                        <strong>Vestimenta:</strong> {evento.DRESSCODE || 'Código de vestimenta'}
                    </p>

                    <p className="text-sm text-gray-500">
                        Toda la información de tu evento.
                    </p>
                </div>
            </div>


            <div className="bg-white rounded-lg p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">✨ {evento.ENCABEZADO || 'Encabezado'}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            {evento.ANFITRION ? `${evento.ANFITRION} —` : ""} <span className="font-medium">{evento.MOTIVO || 'Motivo'}</span>
                        </p>
                    </div>
                </div>
                
                {!canCalificar && cita.APPOINTMENT_CONFIRM == 0 ? <hr className="my-4 border-gray-100" /> : <></>}
                {!canCalificar && cita.APPOINTMENT_CONFIRM == 0 ? bAcceder ? <div className="mt-6 mb-4 flex flex-col sm:flex-row gap-3">
                    <button
                        className="flex-1 rounded-xl bg-emerald-600 py-3 text-white font-medium hover:bg-emerald-700 transition"
                        onClick={() => {
                            indexConfirm();
                        }}
                    >
                        ✓ Confirmar asistencia
                    </button>

                    <button
                        className="flex-1 rounded-xl border border-red-300 py-3 text-red-600 font-medium hover:bg-red-50 transition"
                        onClick={() => {
                            indexConfirmNot();
                        }}
                    >
                        No podré asistir
                    </button>

                </div> : <div className="mt-5 mb-4 rounded-2xl border bg-gray-50 p-5">
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
                </div> : <></>}
                <hr className="my-4 border-gray-100" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700 ">
                    <div>
                        <p className="text-xs text-gray-500">📅 Fecha</p>
                        <p className="font-medium">{ConvertDateTime(cita.APPOINTMENT_DATE, cita.APPOINTMENT_TIME, 0)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">🕒 Hora</p>
                        <p className="font-medium">{ConvertDateTime(cita.APPOINTMENT_DATE, cita.APPOINTMENT_TIME, 1)}</p>
                    </div>



                    <div className="sm:col-span-2">
                        <p className="text-xs text-gray-500">📍 Ubicación</p>
                        <p className="font-medium">{evento.UBICACION || "Lugar"}</p>
                        <TextoConLinks text={"⚠️ " + (evento.NOTAS || "")} />
                    </div>
                    <div className="sm:col-span-2 mt-2">
                        <p className="text-xs text-gray-500">🔖 Invitados</p>
                        <p className="font-medium">{cita.MENSSAGE.substring(0, cita.MENSSAGE.indexOf(","))} {`(${cita.MENSSAGE.substring(cita.MENSSAGE.indexOf(",") + 1, cita.MENSSAGE.length)})`}</p>
                    </div>
                </div>
                <div className="mt-6 text-sm text-gray-600">
                    <p>{evento.DESPEDIDA || 'Mensaje final'} 🎊</p>
                </div>
            </div>
        </>);
}

export default VistaEvento;