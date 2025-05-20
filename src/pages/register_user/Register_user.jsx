import { useState } from "react";
import {
  LockClosedIcon,
  UserIcon,
  ChevronLeftIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";
import { useNavigate, NavLink } from "react-router-dom";

export default function RegisterUser() {
  const [userEmail, setUserEmail] = useState('');
  const [userPass, setUserPass] = useState('');
  const [userName, setUserName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateAndRegister = (e) => {
    e.preventDefault();

    if (!userName || !userLastName || !userEmail || !userPass) {
      setErrorMsg('Completa todos los campos.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      setErrorMsg('Correo electrónico inválido.');
      return;
    }

    if (userPass.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setErrorMsg('');
    try {
      /* restDatasource.registerUser(
          <correo>,
          <name>,
          <lastName>,
          'Web',
          'user',
          <pwd>); */
      console.log(`correo ${userEmail}`);
      console.log("name " + userName);
      console.log("lastName " + userLastName);
      console.log("Web ");
      console.log("user ");
      console.log("pwd " + userPass);
      console.log({ userEmail, userPass, userName, userLastName });
      navigate('/home', { replace: true });
    }
    catch (e) {
      throw new Error("There was a problem creating your account.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 to-orange-800 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Alerta centrada */}
      {errorMsg && (
        <div className="absolute top-6 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg text-sm animate-bounce z-50">
          {errorMsg}
        </div>
      )}

      <div className="flex w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up scale-95 hover:scale-100 transition-all duration-300">
        {/* Formulario */}
        <div className="w-full md:w-1/2 p-10">
          <NavLink to="/" className="flex items-center text-sm text-gray-500 hover:text-orange-500 mb-6">
            <ChevronLeftIcon className="w-5 h-5 mr-2" />
            Regresar
          </NavLink>

          <h2 className="text-3xl font-bold text-gray-800 mb-2">Registrarte</h2>
          <p className="text-sm text-gray-500 mb-6">Es rápido y fácil 🎉</p>

          <form onSubmit={validateAndRegister} className="space-y-5">
            <input
              type="text"
              placeholder="Nombre"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none"
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Apellido"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none"
              onChange={(e) => setUserLastName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none"
              onChange={(e) => setUserEmail(e.target.value)}
            />

            {/* Campo de contraseña con icono */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={userPass}
                onChange={(e) => setUserPass(e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-orange-500"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeIcon className="w-5 h-5" />
                ) : (
                  <EyeSlashIcon className="w-5 h-5" />
                )}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition duration-300"
            >
              Registrarte
            </button>
          </form>
        </div>

        {/* Panel visual derecho */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-orange-500 text-white p-10 flex-col text-center">
          <h2 className="text-2xl font-bold mb-4">¡Bienvenido!</h2>
          <p className="text-sm">Crea tu cuenta para comenzar a usar la plataforma.</p>
        </div>
      </div>
    </div>
  );
}
