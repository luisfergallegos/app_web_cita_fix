
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
            <div className="bg-white rounded-3xl shadow-xl p-10 max-w-2xl w-full text-center animate-fade-in-up">      
                <div className='searchContainer'>
                    <div className="searchicon"><MagnifyingGlassIcon /></div>
                    <input type="text" name="searchText" placeholder="Buscar ..." onChange={handleChange} />
                </div>
            {
                searchText !== '' ? (
                    <div>
                        {
                            usuarios &&
                            filteredNames.map((index) =>
                            (
                                <div className="flex justify-between bg-white-100 rounded-2xl shadow-2xl overflow-hidden scale-95 hover:scale-100 transition-all duration-300"
                                        key={index['USER_ID']}
                                        onClick={() => {
                                            navigate("/addAppoinBusiness", { state: { userCita: index, businessId: sUserCitaFix['BUSSINESS_ID'], dorsl: sUserCitaFix['DORSL']  } });
                                        }}  >
                                        {
                                            index['PHOTO'] === null ? <UserCircleIcon width={80} 
                                                color={'#fc6500'} /> :
                                                <img id='imgS' src={'data:image/jpeg;base64,' + arrayBufferToBase64(index['PHOTO'].data)} />
                                        }
                                        <div className="grid">
                                            <label className="text-2xl font-bold text-black">{index['first_name']} {index['last_name']} </label>
                                            <label className="text-1xl font-bold text-gray-400">{index['email']} </label>
                                        </div>
                                        <ChevronRightIcon width={30} color="black" />
                                    </div>
                            ))
                        }
                    </div>
                )
                    :
                    (
                        <div className="space-y-4">
                            <button
                                onClick={() => 
                                {
                                    navigate("/addAppoinBusinessAnon", { state: { userId: sUserCitaFix['USER_ID'], businessId: sUserCitaFix['BUSSINESS_ID'], dorsl: sUserCitaFix['DORSL'] } });
                                }
                                }
                                className="flex bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-md shadow-md transition"
                            >
                                <UserPlusIcon width={40} />
                                Nuevo cliente
                            </button>
                        </div>
                    )
            }
            </div>
        </div>);
}

export default FindUser;