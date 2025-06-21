// Library
import '../../components/CardBusiness.css';
// assents
import Store from "../../assets/business.png";
import Logo from "../../assets/splash_white.png";
import Loaging from '../../components/Loading.jsx';
// rrd imports
import { useLoaderData, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import { urlApi } from "../../styles/Constants.jsx";
import { useEffect, useState } from "react";
import { fetchData } from '../../Wrapper.js';
import { toast } from "react-toastify";
import { logoutAction } from '../../actions/logout.js';

const StarRating = (stars) => '⭐'.repeat(stars);

// loader
export async function DeleteUserLoader() {
    const sPassword = fetchData("pwd");
    return { sPassword };
}

export function DeleteUser() {
    const location = useLocation();
    const navigate = useNavigate();
    const { sPassword } = useLoaderData();
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState('');
    const [sCorreo, setCorreo] = useState('');

    const handleChangeCorreo = evt => {
        const value = evt.target.value;
        setCorreo(value);
    };

    const validateAndDelete = async (e) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(sCorreo)) {
            return;
        }

        if (userId) {
            //Enviar por DELETE
            var options = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            }
            try {
                const response = await fetch(`${urlApi}user?user_id=${userId}`, options);
                if (response.status == 200) {
                    logoutAction();
                    setTimeout(() => window.location.reload(), 3000);
                }
                else {
                    console.log(`No se pudo eliminar informacion del usuario`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }
            catch (e) {
                return;
            }
        }
        else {
            //Enviar por DELETE
            var options = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            }
            try {
                const response = await fetch(`${urlApi}user?email=${sCorreo}`, options);
                if (response.status == 200) {
                    toast.success("Regresa pronto!");
                    setTimeout(() => window.location.reload(), 3000); // ocultar alerta
                }
                else {
                    console.log(`No se pudo eliminar informacion del usuario`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

            }
            catch (e) {
                return;
            }
        }


    };

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
                sPassword == null ? <div className="flex justify-between items-center w-full bg-gradient-to-br from-orange-600 to-orange-800">
                    <a href="https://www.plannersday.com/"><img className='w-58 h-14' src={Logo} alt="" /></a>
                    <a href="https://app.plannersday.com/"><span className='me-6 text-white text-xl'>Iniciar sesión</span></a>
                </div> : <div></div>
            }
            <div className="min-h-screen grid items-center justify-center bg-gradient-to-br from-orange-600 to-orange-800 px-4">
                <div className="bg-white rounded-3xl shadow-xl p-10 max-w-2xl w-full text-center animate-fade-in-up">
                    <h4 className='text-2xl font-bold text-black mb-1 '>Desactiva tu cuenta</h4>
                    <h2 className='font-bold text-black mb-1 mt-4'>Esta acción desactivará tu cuenta</h2>
                    <h1 className='text-black mb-4 mt-4'>Estás por iniciar el proceso de desactivación de tu cuenta de plannersday.
                        Tu perfil ya no se podrá ver en plannersday.com, plannersday para Android.</h1>
                    <form onSubmit={validateAndDelete} className="flex items-center justify-center py-1 mt-4">
                        <input type="email" className="w-full text-black border px-4 py-2 rounded-md me-4"
                            placeholder='Correo electrónico' value={sCorreo} onChange={handleChangeCorreo} disabled={sPassword ? true : false} />
                        <button type='submit' className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">Eliminar cuenta</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default DeleteUser;