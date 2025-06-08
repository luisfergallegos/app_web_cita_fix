
// rrd imports
import { useLoaderData, useNavigate } from 'react-router-dom';
import { fetchData } from "../../Wrapper.js";
import { useEffect, useState } from "react";
// assets
import '../business/Find_business.css';
import { urlApi } from "../../styles/Constants.jsx";
import { ChevronRightIcon, MagnifyingGlassIcon, UserCircleIcon, UserPlusIcon } from '@heroicons/react/24/solid';
import Loaging from '../../components/Loading.jsx';

// loader
export function findUserLoader() {
    const sCorreo = fetchData("correo");
    const sPassword = fetchData("pwd");
    const sUserCitaFix = fetchData("UserCitaFix") ?? [];
    return { sCorreo, sPassword, sUserCitaFix };
}

export function FindUser() {
    const navigate = useNavigate();
    const { sCorreo, sPassword, sUserCitaFix } = useLoaderData();
    const [loading, setLoading] = useState(true);
    const [usuarios, setUsuarios] = useState([]);

    const [searchText, setsearchText] = useState('');
    const [filteredNames, setfilteredNames] = useState([]);

    const arrayBufferToBase64 = (buffer) => {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return btoa(binary);
    };

    const handleChange = evt => {
        const tempList = [];
        const value = evt.target.value;
        setsearchText(value);
        for (var filName in usuarios) {
            var userName = `${usuarios[filName].first_name} ${usuarios[filName].last_name}`;
            if (userName.toLowerCase().startsWith(value.toLowerCase())) {
                tempList.push(usuarios[filName]);
            } else if (usuarios[filName].email
                .toLowerCase()
                .startsWith(value.toLowerCase())) {
                tempList.push(usuarios[filName]);
            }
        }
        setfilteredNames(tempList);
    };

    useEffect(() => {
        const fData = async () => {
            const userId = sUserCitaFix['USER_ID'];
            //Solicitar por GET
            try {
                const response = await fetch(`${urlApi}users?user_id=${userId}`);
                if (!response.ok) {
                    console.log(`Error getting empresas.`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const json = await response.json();
                setUsuarios(json['data']);
                setLoading(false);
            }
            catch (e) {
                return;
            }


        };
        if (sCorreo === null && sPassword === null) {
            navigate("/");
        }
        fData();
    }, []);

    if (loading) {
        return <Loaging />;
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-600 to-orange-800 px-4">
            <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center animate-fade-in-up">
                <div className="flex justify-center mb-4 relative">
                    <input
                        id='searchInput'
                        type="text"
                        onChange={handleChange}
                        placeholder="Buscar ..."
                        className="w-full p-2 border border-gray-300 rounded-lg bg-orange-600 text-white"
                    />
                    <div className='absolute inset-y-0 right-3 flex items-center text-white'>
                        <MagnifyingGlassIcon className="w-5 h-5" />
                    </div>
                </div>
                {
                    searchText != '' ? (usuarios &&
                        filteredNames.map((index) => (
                            <div className="inline-flex bg-white p-4 border border-gray-300 rounded-md mb-2 scale-95 hover:scale-100"
                                key={index.USER_ID}
                                onClick={() => {
                                    navigate("/addAppoinBusiness", { state: { userCita: index, businessId: sUserCitaFix['BUSSINESS_ID'], dorsl: sUserCitaFix['DORSL'] } });
                                }}
                            >
                                {
                                    index['PHOTO'] === null ? <UserCircleIcon width={40} color={'#fc6500'} /> :
                                        <img id='imgS' src={'data:image/jpeg;base64,' + arrayBufferToBase64(index['PHOTO'].data)} />
                                }
                                <div>
                                    <h2 className="font-bold text-black">{index['first_name']} {index.last_name}</h2>
                                    <p className="text-gray-400">{`${index.email.substring(0, index.email.indexOf("@") + 1)}..`}</p>
                                </div>
                            </div>
                        ))) :
                        <div className='flex justify-center mb-4'>
                            <button
                                onClick={() => {
                                    navigate("/addAppoinBusinessAnon", { state: { userId: sUserCitaFix['USER_ID'], businessId: sUserCitaFix['BUSSINESS_ID'], dorsl: sUserCitaFix['DORSL'] } });
                                }
                                }
                                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-md shadow-md transition inline-flex items-center me-2 "
                            >
                                <UserPlusIcon width={40} />
                                Nuevo cliente
                            </button>
                        </div>
                }
            </div>
        </div>
    );
}

export default FindUser;