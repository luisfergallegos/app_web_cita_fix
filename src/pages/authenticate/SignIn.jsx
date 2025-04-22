
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login:', email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="flex w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Panel de formulario */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Iniciar Sesión</h2>
          <p className="text-sm text-gray-500 mb-6">
            Bienvenido, por favor ingresa tus datos para continuar
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-400 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-400 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full py-2 px-4 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition"
            >
              Entrar
            </button>
          </form>
          <p className="text-sm text-center text-gray-500 mt-4">
            ¿Olvidaste tu contraseña?{' '}
            <span className="text-orange-500 underline cursor-pointer">Recupérala</span>
          </p>
        </div>

        {/* Panel visual (imagen o mensaje) */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-orange-500 text-white p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">¡Bienvenido!</h2>
            <p className="text-sm">Agenda, consulta y gestiona tu cita fácilmente.</p>
          </div>
        </div>
      </div>
    </div>
  );
}






