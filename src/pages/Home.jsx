
// rrd imports
import { useLoaderData, useNavigate } from "react-router-dom";
import { fetchData } from "../Wrapper.js";
import { useEffect } from "react";

// assets
import illustration from "../assets/clock_green.png";
import './Home.css';

// loader
export function homeLoader() {
    const sCorreo = fetchData("correo");
    const sPassword = fetchData("pwd");
    return { sCorreo, sPassword };
}

export function Home() {
    const navigate = useNavigate();
    const { sCorreo, sPassword } = useLoaderData();
    useEffect(() => {
        if (sCorreo === null && sPassword === null) {
            navigate("/");
        }
    }, []);
    const sUserCitaFix = fetchData("UserCitaFix") ?? [];
    const citas = [];
    const firstName = sUserCitaFix['first_name'];
    return (
        <div className="HomeContainer">
                {
                    citas.length > 0 ? (
                        <div>

                        </div>
                    )
                        :
                        (
                            <div>
                                <img src={illustration} alt="Planners Day" width={350} />
                                <p>¡No olvides crear tu cita!</p>
                                <p>Genera tus proximas citas de manera fácil y al instante.</p>
                                <p>Dirígete al buscador</p>
                            </div>
                        )
                }
        </div>

    );
}


export default Home;