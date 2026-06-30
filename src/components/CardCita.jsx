import { useState } from "react";
import { ClockIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { useNavigate } from "react-router-dom";

export function CardCita({ index, bAccederIndex, indexConfirm, bWeek }) {
    const navigate = useNavigate();

    function ConvertDateTime(date, time, flag) {
        var parts = date.split('-');
        var partsTime = time.split(':');
        var formattedDate = new Date(parts[0], parts[1] - 1, parts[2], partsTime[0], partsTime[1], partsTime[2]);
        switch (flag) {
            case 0:
                return `${parts[2]} / ${parts[1]} / ${parts[0]}`;

            case 1:
                return formattedDate.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                });

            case 2: {
                const dia = formattedDate.toLocaleDateString('es-MX', {
                    weekday: 'long'
                });

                return dia.charAt(0).toUpperCase() + dia.slice(1);
            }

            default:
                return "";
        }

    }

    return (

        <div
            className="mb-1 bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all"
            key={index.APOINMENT_ID}
        >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Foto */}
                    <div className="flex-shrink-0">
                        {index.BUS_PHOTO == null ? (
                            <div className="w-20 h-20 rounded-2xl bg-orange-50 flex items-center justify-center">
                                <BuildingOfficeIcon
                                    className="w-20 h-20 object-cover rounded-2xl border"                                    
                                    color={
                                        index.ESTATUS == -1
                                            ? '#B71C1C'
                                            : index.ESTATUS == 1
                                                ? '#32325d'
                                                : index.ESTATUS == 3
                                                    ? '#4472C4'
                                                    : 'grey'
                                    }
                                />
                            </div>
                        ) : (
                            <img
                                className="w-16 h-16 rounded-2xl object-cover"
                                src={
                                    'data:image/jpeg;base64,' +
                                    arrayBufferToBase64(index.BUS_PHOTO.data)
                                }
                            />
                        )}
                    </div>
                    {/* Información */}
                    <div className="min-w-0">
                        <h3 className="font-bold text-lg text-gray-900">
                            {index.DORSL}
                        </h3>

                        <p className="text-sm text-gray-500">
                            {index.ALIAS}
                        </p>

                        <div className="mt-2">
                            {index.APPOINTMENT_CONFIRM === 1 ? (
                                <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                                    Confirmada
                                </span>
                            ) : (
                                <span className="px-2 py-1 rounded-full bg-amber-50 text-amber-700 text-sm font-medium">
                                    ⏳ Por confirmar
                                </span>
                            )}
                        </div>

                        {index.ESTATUS == 1 && (
                            <p className="text-sm text-orange-600 mt-1">
                                Cita modificada por la empresa
                            </p>
                        )}
                    </div>
                </div>

                {/* Fecha */}
                {/* Hora */}
                <div className="flex-shrink-0">
                    {bWeek && <div className="bg-slate-50 rounded-2xl px-4 py-3 text-center mb-2">
                        <p className="font-bold text-slate-900">
                            {ConvertDateTime(
                                index.APPOINTMENT_DATE,
                                index.APPOINTMENT_TIME,
                                2
                            )}
                        </p>
                    </div>}
                    <div className="bg-slate-50 rounded-2xl px-4 py-3 text-center">
                        <p className="text-sm uppercase tracking-wide text-slate-500">
                            Hora
                        </p>

                        <p className="font-bold text-slate-900">
                            {ConvertDateTime(
                                index.APPOINTMENT_DATE,
                                index.APPOINTMENT_TIME,
                                1
                            )}
                        </p>
                    </div>
                </div>

            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">

                {bAccederIndex == index.APOINMENT_ID ? (
                    <button className="px-4 py-2 rounded-xl bg-blue-500 text-white">
                        <div className="mx-auto w-5 h-5 border-[5px] border-white border-t-blue-600 rounded-full animate-spin"></div>
                    </button>
                ) : index.APPOINTMENT_CONFIRM == 0 ? (
                    <button
                        className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-blue-500 text-white"
                        onClick={() => indexConfirm(index)} >
                        Confirmar
                    </button>
                ) : null}

                <button
                    className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gray-100 text-gray-700 bg-transparent border"
                    onClick={() => {
                        if (index.ESTATUS !== -1 && index.ESTATUS !== 2) {
                            navigate(
                                `/cancelAppoin/${index.APOINMENT_ID}`,
                                {
                                    state: {
                                        flagEvent: index.FLAG_EVENT
                                    }
                                }
                            );
                        }
                    }}
                >
                    Ver detalles →
                </button>
            </div>
        </div>

    );
}

export default CardCita;