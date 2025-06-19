
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function AddAppoin() {
  const location = useLocation();
  const navigate = useNavigate();

  const { userId, userName, business } = location.state || {};

  const [fecha, setFecha] = useState(new Date());
  const [comentario, setComentario] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState('');

  // Redirigir si no viene el negocio
  useEffect(() => {
    if (!business) {
      navigate('/');
    }
  }, [business]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!fecha || !comentario.trim()) {
      setError('Por favor completa todos los campos.');
      return;
    }

    setError('');

    // Simulación de envío
    const nuevaCita = {
      fecha: fecha.toISOString(),
      comentario,
      userId,
      userName,
      businessId: business.BUSSINESS_ID,
      businessName: business.DORSL,
    };

    console.log('Cita enviada:', nuevaCita);

    // Aquí podrías usar fetch() o axios() si tenés una API
    // fetch('/api/agendar', { method: 'POST', body: JSON.stringify(nuevaCita) })

    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    navigate('/'); // o donde desees regresar
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 to-orange-800 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 animate-fade-in-up">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Agendar cita con <span className="text-orange-500">{business?.DORSL}</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <DatePicker
              selected={fecha}
              onChange={(date) => setFecha(date)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Comentario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Comentario</label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none h-28 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Especifica el motivo de tu cita..."
            />
          </div>

          {/* Error */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Botón */}
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
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
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
