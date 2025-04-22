
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000); // ocultar alerta
      return;
    }

    console.log('Login con:', email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Alerta centrada */}
      {showAlert && (
        <div className="absolute top-6 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg text-sm animate-bounce z-50">
          Por favor completa todos los campos.
        </div>
      )}

      {/* Contenedor principal */}
      <div className="flex w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up scale-95 hover:scale-100 transition-all duration-300">
        {/* Formulario */}
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 animate-fade-in-down">Iniciar sesión</h2>
          <p className="text-sm text-gray-500 mb-6">Bienvenido de nuevo 👋</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-600 text-sm mb-1">Correo electrónico</label>
              <input
                type="email"
                placeholder="tucorreo@ejemplo.com"
                className="w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all duration-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-600 text-sm mb-1">Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all duration-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-orange-500 text-white font-semibold rounded-md shadow-md hover:bg-orange-600 transition duration-300"
            >
              Iniciar sesión
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-6">
            ¿Olvidaste tu contraseña?{' '}
            <span className="text-orange-500 underline cursor-pointer hover:text-orange-600 transition">
              Recuperar acceso
            </span>
          </p>
        </div>

        {/* Panel derecho (visual) */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-orange-500 text-white p-10 flex-col text-center">
          <h2 className="text-2xl font-bold mb-4">¡Hola otra vez!</h2>
          <p className="text-sm">Ingresa tus credenciales para continuar</p>
        </div>
      </div>
    </div>
  );
}
