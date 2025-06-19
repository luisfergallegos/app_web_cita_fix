import { useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon, XMarkIcon as CloseIcon } from "@heroicons/react/24/solid";
import { CardBusiness } from "../../components/CardBusiness";
import { fetchData } from "../../Wrapper";
import illustration from "../../assets/schedule_meeting.svg";
import Store from "../../assets/business.png";

// Loader
export function findBusinessLoader() {
  const correo = fetchData("correo");
  const pwd = fetchData("pwd");
  const user = fetchData("UserCitaFix");
  return { correo, pwd, user };
}

export default function FindBusiness() {
  const { correo, pwd, user } = useLoaderData();
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [filteredNames, setFilteredNames] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [indexEmp, setIndexEmp] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [qualifications, setQualifications] = useState([]);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [showIndicator, setShowIndicator] = useState(() => {
  const visto = localStorage.getItem("hasSeenSearchIndicator");
  return !visto; // Mostrar solo si NO se ha visto antes
});

  useEffect(() => {
    if (!correo || !pwd) {
      navigate("/");
    }

    if (user) {
      setUserId(user.user_id ?? "");
      setUserName(user.first_name ?? "");
    }

    const mockEmpresas = [
      {
        BUSSINESS_ID: "1",
        DORSL: "Clínica CitaFix",
        CATEGORY: "Salud",
        SERVICE_LEVEL: 4,
        ADDRESS_FIRST: "Av. Siempre Viva",
        ADDRESS_SECOND: "123",
        POSTAL_CODE: "01010",
        CITY: "CDMX",
        STATE: "CDMX",
        phone: "555-1234",
        Horario: "Lun-Vie 9am - 6pm",
        PHOTO: null,
      },
    ];

    setEmpresas(mockEmpresas);
    setFilteredNames(mockEmpresas);
  }, []);

  const handleChange = (e) => {
    if (showIndicator) setShowIndicator(false);

    const value = e.target.value;
    setSearchText(value);

    if (value === "") {
      setFilteredNames(empresas);
    } else {
      const results = empresas.filter((emp) =>
        emp.DORSL.toLowerCase().includes(value.toLowerCase()) ||
        emp.CATEGORY.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredNames(results);
    }
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return btoa(binary);
  };

  const StarRating = (stars) => '⭐'.repeat(stars);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 to-orange-800 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold">¿Estás en busca de un servicio?</h2>
        {/* Buscador con indicador */}
        <div className="relative mb-10">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="searchText"
            value={searchText}
            onChange={handleChange}
            onFocus={() => {
    if (showIndicator) {
      setShowIndicator(false);
      localStorage.setItem("hasSeenSearchIndicator", "true");
    }
  }}
            placeholder="Buscar negocios o categorías..."
            className="w-full pl-10 pr-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-400 outline-none text-gray-800 placeholder-gray-400"
          />

          {/* Círculo animado */}
          {showIndicator && (
  <>
    {/* Fondo vidrio suave */}
    <div className="fixed inset-0 bg-white/20 backdrop-blur-sm z-30 pointer-events-none" />

    {/* Indicador flotante con tooltip */}
    <div className="absolute -top-6 right-2 flex flex-col items-end group z-40">
      <div className="mb-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-xl opacity-90 group-hover:opacity-100 transition">
        ✨ Escribe para buscar un negocio
      </div>
      <span className="flex h-6 w-6 relative">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-6 w-6 bg-orange-500"></span>
      </span>
    </div>
  </>
)}


        </div>

        {/* Resultados o sugerencia */}
        {searchText !== "" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNames.map((empresa) => (
              <CardBusiness
                key={empresa.BUSSINESS_ID}
                userId={userId}
                userName={userName}
                empresa={empresa}
                setIsOpen={setIsOpen}
                setIndexEmp={setIndexEmp}
                setQualifications={setQualifications}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-white space-y-4">
            <p>Seleccioná una opción para generar una cita al instante.</p>
            <div className="mt-10">
              {empresas[0] && (
                <div className="flex justify-center">
                  <CardBusiness
                    key={empresas[0].BUSSINESS_ID}
                    userId={userId}
                    userName={userName}
                    empresa={empresas[0]}
                    setIsOpen={setIsOpen}
                    setIndexEmp={setIndexEmp}
                    setQualifications={setQualifications}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal */}
        {isOpen && indexEmp && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative animate-fade-in-up">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-orange-500"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
                <div className="flex justify-center mb-4">
                  {indexEmp.PHOTO ? (
                    <img
                      className="w-32 h-32 object-cover rounded-full border"
                      src={`data:image/jpeg;base64,${arrayBufferToBase64(indexEmp.PHOTO.data)}`}
                    />
                  ) : (
                    <img className="w-32 h-32 object-cover rounded-full border" src={Store} />
                  )}
                </div>
                <h4 className="text-xl font-bold text-center mb-1">{indexEmp.DORSL}</h4>
                <p className="text-center text-yellow-500 mb-1">{StarRating(indexEmp.SERVICE_LEVEL)}</p>
                <p className="text-center text-gray-500 mb-4">{indexEmp.CATEGORY}</p>
                <hr className="mb-4" />
                <div>
                  <h5 className="text-sm font-semibold mb-2">Calificaciones</h5>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {qualifications.length > 0 ? (
                      qualifications.map((q) => (
                        <div key={q.SERVICE_LEVEL_DATE} className="text-sm text-gray-700">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{q.USER}</span>
                            <span>{StarRating(q.SERVICE_LEVEL)}</span>
                          </div>
                          <p className="text-xs text-gray-400">{q.SERVICE_LEVEL_DATE}</p>
                          <p className="text-sm mt-1">{q.COMMENTS}</p>
                          <hr className="my-2" />
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm">Sin calificaciones disponibles.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
