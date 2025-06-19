
              import { useLoaderData, useNavigate } from 'react-router-dom';
import { fetchData } from "../../Wrapper.js";
import { useEffect, useState } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  EyeIcon,
  EyeSlashIcon,
  UserCircleIcon
} from '@heroicons/react/24/solid';

import UserIcon from "../../assets/e.png";
import PhoneIcon from "../../assets/phone.png";
import MailIcon from "../../assets/mail.png";
import LockIcon from "../../assets/lock.png";
import CardMemberIcon from "../../assets/card_membership.png";

// loader
export function viewUpdateUserLoader() {
  const sCorreo = fetchData("correo");
  const sPassword = fetchData("pwd");
  return { sCorreo, sPassword };
}

export function ViewUpdateUser() {
  const navigate = useNavigate();
  const { sCorreo, sPassword } = useLoaderData();

  const [indexEmp, setIndexEmp] = useState('');
  const [nameGroup, setNameGroup] = useState(true);
  const [infGroup, setInfGroup] = useState(true);
  const [mailGroup, setMailGroup] = useState(true);
  const [passGroup, setPassGroup] = useState(true);
  const [desAccGroup, setDesAccGroup] = useState(true);
  const [passView, setPassView] = useState(true);
  const [passType, setPassType] = useState('password');

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return btoa(binary);
  };

  const toggle = (setter) => setter((prev) => !prev);

  const confirmDesactivar = () => {
    const confirmed = confirm("¿Deseas desactivar tu cuenta?");
    setDesAccGroup(!confirmed);
  };

  const togglePassView = () => {
    setPassView(!passView);
    setPassType(passView ? 'text' : 'password');
  };

  useEffect(() => {
    if (!sCorreo && !sPassword) {
      navigate("/");
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 text-gray-800">
      {/* Imagen usuario */}
      <div className="flex justify-center mb-6">
        {indexEmp === '' ? (
          <UserCircleIcon className="h-24 w-24 text-orange-400" />
        ) : (
          <img
            className="w-24 h-24 rounded-full object-cover border"
            src={`data:image/jpeg;base64,${arrayBufferToBase64(indexEmp.data)}`}
            alt="User"
          />
        )}
      </div>

      {/* Grupo Nombre */}
      <div className="bg-white shadow rounded-xl p-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggle(setNameGroup)}
        >
          <div className="flex items-center gap-2">
            <img src={UserIcon} alt="icon" className="w-5 h-5" />
            <span className="font-semibold">Nombre</span>
          </div>
          {nameGroup ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronUpIcon className="w-5 h-5" />}
        </div>
        {!nameGroup && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input className="w-full border px-4 py-2 rounded-md" type="text" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Apellido</label>
              <input className="w-full border px-4 py-2 rounded-md" type="text" />
            </div>
            <button className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">Guardar</button>
          </div>
        )}
      </div>

      {/* Grupo Teléfono */}
      <div className="bg-white shadow rounded-xl p-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggle(setInfGroup)}
        >
          <div className="flex items-center gap-2">
            <img src={PhoneIcon} alt="icon" className="w-5 h-5" />
            <span className="font-semibold">Información de contacto</span>
          </div>
          {infGroup ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronUpIcon className="w-5 h-5" />}
        </div>
        {!infGroup && (
          <div className="mt-4 space-y-4">
            <label className="block text-sm font-medium mb-1">Número celular</label>
            <input type="tel" className="w-full border px-4 py-2 rounded-md" placeholder="+52..." />
            <button className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">Guardar</button>
          </div>
        )}
      </div>

      {/* Grupo Correo */}
      <div className="bg-white shadow rounded-xl p-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggle(setMailGroup)}
        >
          <div className="flex items-center gap-2">
            <img src={MailIcon} alt="icon" className="w-5 h-5" />
            <span className="font-semibold">Correo electrónico</span>
          </div>
          {mailGroup ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronUpIcon className="w-5 h-5" />}
        </div>
        {!mailGroup && (
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Confirma tu correo</label>
            <input type="email" className="w-full border px-4 py-2 rounded-md" />
            <button className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">Guardar</button>
          </div>
        )}
      </div>

      {/* Grupo Contraseña */}
      <div className="bg-white shadow rounded-xl p-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggle(setPassGroup)}
        >
          <div className="flex items-center gap-2">
            <img src={LockIcon} alt="icon" className="w-5 h-5" />
            <span className="font-semibold">Contraseña</span>
          </div>
          {passGroup ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronUpIcon className="w-5 h-5" />}
        </div>
        {!passGroup && (
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Confirma tu contraseña</label>
            <div className="flex items-center border rounded-md px-2 py-1">
              <input type={passType} className="flex-grow px-2 py-1 outline-none" />
              {passView ? (
                <EyeSlashIcon className="w-5 h-5 text-gray-500 cursor-pointer" onClick={togglePassView} />
              ) : (
                <EyeIcon className="w-5 h-5 text-gray-500 cursor-pointer" onClick={togglePassView} />
              )}
            </div>
            <button className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">Guardar</button>
          </div>
        )}
      </div>

      {/* Grupo Desactivación */}
      <div className="bg-white shadow rounded-xl p-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={confirmDesactivar}
        >
          <div className="flex items-center gap-2">
            <img src={CardMemberIcon} alt="icon" className="w-5 h-5" />
            <span className="font-semibold">Desactivación</span>
          </div>
          {desAccGroup ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronUpIcon className="w-5 h-5" />}
        </div>
        {!desAccGroup && (
          <div className="mt-4 text-sm text-red-600">
            Tu cuenta ha sido marcada para desactivarse temporalmente.
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewUpdateUser;
