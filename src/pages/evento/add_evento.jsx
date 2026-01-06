
// rrd imports
import { useLoaderData, useNavigate } from 'react-router-dom';
import { fetchData, dateSpanish } from "../../Wrapper.js";
import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { toast } from "react-toastify";

// assets
import { urlApi } from "../../styles/Constants.jsx";

// loader
export function AddEventoLoader() {
    const sCorreo = fetchData("correo");
    const sPassword = fetchData("pwd");
    return { sCorreo, sPassword };
}

export function AddEvento({ onSubmit }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { sCorreo, sPassword } = useLoaderData();
    const userId = location.state?.userId ?? '';
    const [form, setForm] = useState({
        user_id: userId,
        evento: "Cumpleaños",
        anfitrion: "",
        event_date: "",
        event_time: "",
        ubicacion: "",
        dressCode: "Casual",
        notas: "",
        encabezado: "",
        motivo: "",
        despedida: "",
        isPrivate: 1
    });
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [bAcceder, setbAcceder] = useState(true);

    function validate() {
        const e = {};
        if (!form.anfitrion.trim())
            e.anfitrion = "El nombre del anfitrión es obligatorio.";
        if (!form.encabezado.trim())
            e.encabezado = "El encabezado es obligatorio.";
        if (!form.motivo.trim())
            e.motivo = "El motivo es obligatorio.";
        if (!form.despedida.trim())
            e.despedida = "El mensaje final es obligatorio.";
        if (!form.event_date)
            e.event_date = "Selecciona la fecha.";
        if (!form.event_time)
            e.event_time = "Selecciona la hora.";
        return e;
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
        setSubmitted(false);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const eobj = validate();
        setErrors(eobj);
        if (Object.keys(eobj).length > 0) return;
        const payload = { ...form };

        if (bAcceder) {
            setbAcceder(false);
            //Enviar por POST
            var options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }
            try {
                const response = await fetch(`${urlApi}event`, options);
                const json = await response.json();
                if (json['sucess'] == false) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                else {
                    setTimeout(() => toast.success("Evento creado"), 3000);
                    navigate("/home");
                }
            }
            catch (e) {
                toast.error("Error al crear el Evento");
            }
            finally{
                setbAcceder(true);
            }

            if (onSubmit && typeof onSubmit == "function") onSubmit(payload);
            // else console.log("Invitation form submitted:", payload);

            setSubmitted(true);
        }
    }

    useEffect(() => {
        const fData = async () => {
            if (userId == '') {
                navigate("/");
            }
            else if (sCorreo == null && sPassword == null) {
                navigate("/");
            }
        };
        fData();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-600 to-orange-800 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                {/* Form Card */}
                <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-1">Crear Evento</h2>
                    <p className="text-sm text-gray-500 mb-6">Rellena los datos y revisa la vista previa.</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Encabezado</span>
                                <input
                                    name="encabezado"
                                    value={form.encabezado}
                                    onChange={handleChange}
                                    placeholder="Ejemplo: ¡Estas invitado!, Acompáñanos a celebrar"
                                    className={`mt-1 block w-full rounded-lg border ${errors.encabezado ? 'border-red-400' : 'border-gray-200'} px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-300`}
                                />
                                {errors.encabezado && <p className="mt-1 text-xs text-red-600">{errors.encabezado}</p>}
                            </label>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Tipo de evento</span>
                                <select
                                    name="evento"
                                    value={form.evento}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-300"
                                >
                                    <option>Cumpleaños</option>
                                    <option>Fiesta</option>
                                    <option>Graduación</option>
                                    <option>Boda</option>
                                    <option>XV</option>
                                    <option>Reunión</option>
                                    <option>Curso</option>
                                    <option>Conferencia</option>
                                    <option>Otro</option>
                                </select>
                            </label>

                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Código de vestimenta</span>
                                <select
                                    name="dressCode"
                                    value={form.dressCode}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-300"
                                >
                                    <option>Casual</option>
                                    <option>Formal</option>
                                    <option>Temática</option>
                                    <option>Elegante</option>
                                </select>
                            </label>
                        </div>
                        <label className="flex items-center gap-2 mt-2">
                            <input
                                type="checkbox"
                                name="isPrivate"
                                checked={form.isPrivate || false}
                                onChange={(e) => handleChange({ target: { name: 'isPrivate', value: e.target.checked } })}
                                className={`h-4 w-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500`}
                            />
                            <span className="text-sm font-medium text-gray-700">Evento privado</span>
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Anfitrión</span>
                                <input
                                    name="anfitrion"
                                    value={form.anfitrion}
                                    onChange={handleChange}
                                    placeholder="Nombre(s) del anfitrión"
                                    className={`mt-1 block w-full rounded-lg border ${errors.anfitrion ? 'border-red-400' : 'border-gray-200'} px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-300`}
                                />
                                {errors.anfitrion && <p className="mt-1 text-xs text-red-600">{errors.anfitrion}</p>}
                            </label>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Motivo</span>
                                <input
                                    name="motivo"
                                    value={form.motivo}
                                    onChange={handleChange}
                                    placeholder="Ejemplo: Mis 30 años, Reapertura del negocio"
                                    className={`mt-1 block w-full rounded-lg border ${errors.motivo ? 'border-red-400' : 'border-gray-200'} px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-300`}
                                />
                                {errors.motivo && <p className="mt-1 text-xs text-red-600">{errors.motivo}</p>}
                            </label>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Fecha</span>
                                <input
                                    type="date"
                                    name="event_date"
                                    value={form.event_date}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full rounded-lg border ${errors.event_date ? 'border-red-400' : 'border-gray-200'} px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-300`}
                                />
                                {errors.event_date && <p className="mt-1 text-xs text-red-600">{errors.event_date}</p>}
                            </label>

                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Hora</span>
                                <input
                                    type="time"
                                    name="event_time"
                                    value={form.event_time}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full rounded-lg border ${errors.event_time ? 'border-red-400' : 'border-gray-200'} px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-300`}
                                />
                                {errors.event_time && <p className="mt-1 text-xs text-red-600">{errors.event_time}</p>}
                            </label>
                        </div>

                        <label className="block">
                            <span className="text-sm font-medium text-gray-700">Lugar</span>
                            <input
                                name="ubicacion"
                                value={form.ubicacion}
                                onChange={handleChange}
                                placeholder="Dirección o referencia"
                                className="mt-1 block w-full rounded-lg border-gray-200 px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-300"
                            />
                        </label>

                        <label className="block">
                            <span className="text-sm font-medium text-gray-700">{'Notas / Indicaciones / enlace'}</span>
                            <textarea
                                name="notas"
                                value={form.notas}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Ej: traer traje de baño, sin niños, confirmar asistencia, enlace maps, etc."
                                className="mt-1 block w-full rounded-lg border-gray-200 px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-300"
                            />
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Mensaje final</span>
                                <input
                                    name="despedida"
                                    value={form.despedida}
                                    onChange={handleChange}
                                    placeholder="Ejemplo: será un gusto celebrar contigo, ¡No faltes!"
                                    className={`mt-1 block w-full rounded-lg border ${errors.despedida ? 'border-red-400' : 'border-gray-200'} px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-300`}
                                />
                                {errors.despedida && <p className="mt-1 text-xs text-red-600">{errors.despedida}</p>}
                            </label>
                        </div>

                        <div className="flex items-center justify-between">

                            {bAcceder ? <button
                                type="submit"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white font-semibold shadow hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            >
                                Guardar
                            </button> : <button className="px-3 py-1 text-sm rounded-lg bg-orange-300">
                                <span className="animate-pulse">Procesando...</span>
                            </button>}

                            <div className="text-sm text-gray-500">
                                {submitted ? (
                                    <span className="text-orange-600 font-medium">¡Invitación lista!</span>
                                ) : (
                                    <span>Los campos obligatorios están marcados</span>
                                )}
                            </div>
                        </div>
                    </form>
                </div>

                {/* Preview Card */}
                <div className="flex flex-col gap-4">
                    <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Vista previa</h3>
                                <p className="text-sm text-gray-500">Como se verá la invitación para el invitado</p>
                            </div>
                            <div className="text-xs text-gray-400">Impresión rápida</div>
                        </div>

                        <div className="mt-4 bg-white rounded-lg p-4 border border-gray-100">
                            <div className="text-center">
                                <p className="text-sm text-indigo-600 font-medium">{form.encabezado || 'Encabezado'}</p>
                                <h2 className="text-2xl font-bold text-gray-900">{form.anfitrion || 'Anfitrión'}</h2>
                                <p className="text-sm text-black-600 font-medium">{form.motivo || 'Motivo'}</p>
                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                                    <div>
                                        <p className="font-medium"><strong>Cuándo</strong></p>
                                        <p>{form.event_date == '' ? 'Fecha' : dateSpanish(new Date(form.event_date.split('-')[0], form.event_date.split('-')[1] - 1, form.event_date.split('-')[2]))}</p>
                                        <p>{form.event_time ? form.event_time : ''}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium"><strong>Dónde</strong></p>
                                        <p>{form.ubicacion || 'Dirección'}</p>
                                    </div>
                                </div>

                                <div className="mt-4 text-sm text-gray-600">
                                    <p><strong>Vestimenta:</strong> {form.dressCode}</p>
                                    <p className="mt-2">{form.notas || 'Notas / Indicaciones / enlace'}</p>
                                </div>

                                <p className="text-sm text-gray-600">{form.despedida || 'Mensaje final'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                        <h4 className="text-sm font-semibold text-gray-800">Detalles rápidos</h4>
                        <ul className="mt-2 text-sm text-gray-600 space-y-1">
                            <li><strong>Tipo:</strong> {form.evento || '-'}</li>
                            <li><strong>Vestimenta:</strong> {form.dressCode || '-'}</li>
                            <li><strong>Evento:</strong> {form.isPrivate ? 'Privado' : 'Abierto'}</li>
                            <li><strong>Anfitrión:</strong> {form.anfitrion || '-'}</li>
                            <li><strong>Fecha:</strong> {form.event_date || '-'}</li>
                            <li><strong>Hora:</strong> {form.event_time || '-'}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddEvento;