import { useState } from "react";
import { LockClosedIcon, UserIcon, ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useNavigate, NavLink } from "react-router-dom";

export default function RegisterUser() {
  const [userEmail, setUserEmail] = useState('');
  const [userPass, setUserPass] = useState('');
  const [userName, setUserName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const register = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!userName) newErrors.name = "Ingresa tu nombre";
    if (!userLastName) newErrors.lastname = "Ingresa tu apellido";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userEmail) newErrors.email = "Usarás este dato cuando entres";
    else if (!emailRegex.test(userEmail)) newErrors.email = "Ingresa un correo electrónico válido";

    if (!userPass) newErrors.password = "Introduce una contraseña segura";
    else if (userPass.length < 6) newErrors.password = "Mínimo 6 caracteres";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    console.log("Registro exitoso:", { userEmail, userName, userLastName, userPass });
    navigate(`/home`, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900 px-4">
      <div className="bg-white w-full max-w-2xl p-10 rounded-3xl shadow-xl animate-fade-in-up">
        <NavLink to="/" className="flex items-center text-sm text-gray-500 hover:text-indigo-500 mb-6">
          <ChevronLeftIcon className="w-5 h-5 mr-2" />
          Regresar
        </NavLink>

        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Registrarte</h2>
        <p className="text-sm text-gray-500 text-center mb-8">Es rápido y fácil 🚀</p>

        <form onSubmit={register} className="space-y-5">
          <div>
            <input
              type="text"
              placeholder="Nombre"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={(e) => setUserName(e.target.value)}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <input
              type="text"
              placeholder="Apellido"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={(e) => setUserLastName(e.target.value)}
            />
            {errors.lastname && <p className="text-red-500 text-sm mt-1">{errors.lastname}</p>}
          </div>

          <div>
            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={(e) => setUserEmail(e.target.value)}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><UserIcon className="w-4 h-4" /> {errors.email}</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={(e) => setUserPass(e.target.value)}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><LockClosedIcon className="w-4 h-4" /> {errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition"
          >
            Registrarte
          </button>
        </form>
      </div>
    </div>
  );
}
