// assents

import Logo from "../assets/splash.png";
import Loaging from '../components/Loading.jsx';
// rrd imports
import { useLoaderData, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import { useEffect, useState } from "react";
import { fetchData } from '../Wrapper.js';

// loader
export async function PoliticasLoader() {
    const sPassword = fetchData("pwd");
    return { sPassword };
}

export function Politicas() {
    const location = useLocation();
    const navigate = useNavigate();
    const { sPassword } = useLoaderData();
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState('');
    const [sCorreo, setCorreo] = useState('');


    useEffect(() => {
        if (location.state != null) {
            setUserId(location.state.userId);
            setCorreo(fetchData("correo"));
        } else if (!sCorreo) {
            setCorreo(fetchData("correo"));
        }
        setLoading(false);
    }, []);

    if (loading) {
        return <Loaging />;
    }

    return (
        <div>
            {
                sCorreo == null && sPassword == null ?
                    /* Navbar */
                    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur">
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
            <section
                className="relative overflow-hidden border-b border-orange-500"
            >
                {/* Imagen */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('https://lh3.googleusercontent.com/sitesv/AA5AbUDDx1x1E33ovT4BLNqCHADviU9FOOhGIgFtpgj09q4SsxXs40xcSOC0ansIhZZ2qmKD7T7ddcLum74TO-f8IrnXIJbm7IM9V_utev2MmjHiRXYTdpRSNsWbGJfH3_8Uhqq7Ehrp-8IA7sSGyd9PjWgD8Rzm1c2Rm_DWdf8r76b-QeIQG9dIpMI7PsI=w16383')",
                    }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" />

                {/* Contenido */}
                <div className="relative mx-auto flex min-h-[320px] max-w-7xl flex-col items-center justify-center px-6 py-24 text-center">
                    <h1 className="text-5xl font-light uppercase tracking-wide text-white md:text-7xl">
                        Política de Privacidad
                    </h1>

                    <div className="mt-6 h-2 w-64 rounded-full bg-orange-500" />

                    <p className="mt-6 text-lg text-white/80">
                        Última actualización: 30 de mayo de 2026
                    </p>
                </div>
            </section>
            <section className="py-20">
                <div className="mx-auto max-w-5xl px-6">
                    <h2 className="mb-8 text-2xl font-black">Qué cubre esta política</h2>
                    <div className="space-y-6 text-lg leading-8 text-gray-700">
                        <p className="mb-4 text-lg text-gray-700">
                            De conformidad con lo establecido en la Ley Federal de Protección de Datos Personales en Posesión de los Particulares, Planners Day pone a su disposición el siguiente aviso de privacidad.
                        </p>

                        <p className="mb-4 text-lg text-gray-700">
                            Planners Day , es responsable del uso y protección de sus datos personales, en este sentido y atendiendo las obligaciones legales establecidas en la Ley Federal de Protección de Datos Personales en Posesión de los Particulares, a través de este instrumento se informa a los titulares de los datos, la información que de ellos se recaba y los fines que se le darán a dicha información.

                            Además de lo anterior, informamos a usted que Planners Day , tiene su domicilio ubicado en: Prolongación Degollado #771, Col. Luis Echeverría Alvarez, Torreón, Coahuila.
                        </p>

                        <p className="mb-4 text-lg text-gray-700">
                            Los datos personales que recabamos de usted serán utilizados para las siguientes finalidades, las cuales son necesarias para concretar nuestra relación con usted, así como atender los servicios y/o pedidos que solicite: Brindar una atención personalizada a nuestros clientes.
                        </p>

                        <p className="mb-4 text-lg text-gray-700">
                            Para llevar a cabo las finalidades descritas en el presente aviso de
                            privacidad, podremos recopilar los siguientes datos personales:
                        </p>

                        <ul className="space-y-2 pl-6 text-gray-700">
                            <li>• Nombre completo</li>
                            <li>• Número telefónico</li>
                            <li>• Domicilio</li>
                            <li>• Correo electrónico</li>
                        </ul>

                        <p className="mb-4 text-lg text-gray-700">
                            Por otra parte, informamos a usted, que sus datos personales no serán compartidos con ninguna autoridad, empresa, organización o persona distintas a nosotros y serán utilizados exclusivamente para los fines señalados.
                        </p>

                        <p className="mb-4 text-lg text-gray-700">
                            Usted tiene en todo momento el derecho a conocer qué datos personales tenemos de usted, para qué los utilizamos y las condiciones del uso que les damos (Acceso). Asimismo, es su derecho solicitar la corrección de su información personal en caso de que esté desactualizada, sea inexacta o incompleta (Rectificación); de igual manera, tiene derecho a que su información se elimine de nuestros registros o bases de datos cuando considere que la misma no está siendo utilizada adecuadamente (Cancelación); así como también a oponerse al uso de sus datos personales para fines específicos (Oposición). Estos derechos se conocen como derechos ARCO.
                        </p>

                        <p className="mb-4 text-lg text-gray-700">
                            Para el ejercicio de cualquiera de los derechos ARCO, se deberá presentar la solicitud respectiva a través de los formatos que estarán a su disposición en: http://www.plannersday.com. Lo anterior también servirá para conocer el procedimiento y requisitos para el ejercicio de los derechos ARCO.
                        </p>

                        <p className="mb-4 text-lg text-gray-700">
                            La respuesta a la solicitud se dará en 10 días y se comunicará de la siguiente manera: A través de la cuenta de correo que se indique en el formulario de Contacto. Los datos de contacto de la persona o departamento de datos personales, que está a cargo de dar trámite a las solicitudes de derechos ARCO, son los siguientes:
                        </p>

                        <ul className="space-y-2 pl-6 text-gray-700">
                            <li>1. Nombre del responsable: Luis Fernando Gallegos</li>
                            <li>2. Domicilio: Prolongación Degollado #771, Col. Luis Echeverría Alvarez, Torreón, Coahuila.</li>
                            <li>3. Teléfono: (81) 1604 8150</li>
                        </ul>

                        <p className="mb-4 text-lg text-gray-700">
                            Cabe mencionar, que en cualquier momento usted puede revocar su consentimiento para el uso de sus datos personales. Del mismo modo, usted puede revocar el consentimiento que, en su caso, nos haya otorgado para el tratamiento de sus datos personales.
                        </p>
                        <p className="mb-4 text-lg text-gray-700">
                            Asimismo, usted deberá considerar que, para ciertos fines, la revocación de su consentimiento implicará que no podamos seguir prestando el servicio que nos solicitó, o la conclusión de su relación con nosotros.
                        </p>

                        <p className="mb-4 text-lg text-gray-700">
                            Para revocar el consentimiento que usted otorga en este acto o para limitar su divulgación, se deberá presentar la solicitud respectiva a través del siguiente correo electrónico: soporte.plannersday@gmail.com
                        </p>

                        <p className="mb-4 text-lg text-gray-700">
                            Del mismo modo, podrá solicitar la información para conocer el procedimiento y requisitos para la revocación del consentimiento, así como limitar el uso y divulgación de su información personal.
                        </p>

                        <p className="mb-4 text-lg text-gray-700" >
                            En cualquier caso, la respuesta a las peticiones se dará a conocer en un plazo de 10 días. En cuanto a cambios en nuestro modelo de negocio, o por otras causas, por lo cual, nos comprometemos a mantenerlo informado sobre los cambios que pueda sufrir el presente aviso de privacidad, sin embargo, usted puede solicitar información sobre si el mismo ha sufrido algún cambio a través de la siguiente dirección electrónica:
                            <p>
                                soporte.plannersday@gmail.com
                            </p>
                        </p>

                    </div>




                </div>
            </section>
        </div>
    );
}

export default Politicas;