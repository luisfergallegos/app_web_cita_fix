export function AddAppoinLoader() {
  return null; // 
}

    import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CalendarDaysIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/solid';
import Store from '../../assets/business.png';

export default function AddAppoin() {
  const location = useLocation();
  const navigate = useNavigate();

  const { userId, userName, business } = location.state || {};

  const [fecha, setFecha] = useState(new Date());
  const [comentario, setComentario] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState('');

  // Redirección si no hay datos del negocio
  useEffect(() => {
    if (!business || !userId || !userName) {
      navigate('/');
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!fecha || !comentario.trim()) {
      setError('Por favor completa todos los campos.');
      return;
    }

    setError('');

    const nuevaCita = {
      fecha: fecha.toISOString(),
      comentario,
      userId,
      userName,
      businessId: business.BUSSINESS_ID,
      businessName: business.DORSL,
    };

    console.log('Cita registrada:', nuevaCita);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    navigate('/'); // o a una vista de historial
  };

  const StarRating = (stars) => '⭐'.repeat(stars);

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return btoa(binary);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 to-orange-800 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl p-8 grid grid-cols-1 md:grid-cols-2 gap-10 animate-fade-in-up">
        
        {/* Columna Izquierda: Info del Negocio */}
        <div className="space-y-4 text-gray-800">
          <div className="flex justify-center">
            {business.PHOTO ? (
              <img
                className="w-36 h-36 object-cover rounded-full border"
                src={`data:image/jpeg;base64,${arrayBufferToBase64(business.PHOTO.data)}`}
              />
            ) : (
              <img className="w-36 h-36 object-cover rounded-full border" src={Store} />
            )}
          </div>
          <h2 className="text-xl font-bold text-center">{business.DORSL}</h2>
          <p className="text-center text-sm text-orange-600">{business.CATEGORY}</p>
          <p className="text-center text-yellow-500">{StarRating(business.SERVICE_LEVEL)}</p>

          <div className="flex items-start gap-2 text-sm">
            <MapPinIcon className="h-5 w-5 text-orange-500 mt-0.5" />
            <p>
              {business.ADDRESS_FIRST} {business.ADDRESS_SECOND}, CP {business.POSTAL_CODE}, {business.CITY}, {business.STATE}
            </p>
          </div>

          {business.phone && (
            <div className="flex items-center gap-2 text-sm">
              <PhoneIcon className="h-5 w-5 text-orange-500" />
              <p>{business.phone}</p>
            </div>
          )}

          {business.Horario && (
            <div className="flex items-center gap-2 text-sm">
              <CalendarDaysIcon className="h-5 w-5 text-orange-500" />
              <p>{business.Horario}</p>
            </div>
          )}
        </div>

        {/* Columna Derecha: Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <DatePicker
              selected={fecha}
              onChange={(date) => setFecha(date)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Comentario</label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none h-28 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Especifica el motivo de tu cita..."
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-orange-500 text-white font-semibold py-3 rounded-md hover:bg-orange-600 transition"
          >
            Confirmar cita
          </button>
        </form>
      </div>

      {/* Modal de confirmación */}
      {modalOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center relative">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">¡Cita agendada!</h3>
              <p className="text-gray-600 text-sm mb-2">Has agendado con:</p>
              <p className="text-orange-600 font-semibold text-lg mb-1">{business?.DORSL}</p>
              <p className="text-gray-600 text-sm mb-2">Fecha:</p>
              <p className="text-orange-500 font-bold text-lg mb-6">{fecha.toLocaleDateString()}</p>
              <button
                onClick={cerrarModal}
                className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
