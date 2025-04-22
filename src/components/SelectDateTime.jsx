// Library
import { CalendarDaysIcon } from '@heroicons/react/24/solid';
import './SelectDateTime.css';
// rrd imports
import { useState } from 'react';

export function SelectDateTime({ citas, _selectedDate }) {
    const [selectedIndex, setSelectedIndex] = useState('');
    var tempcita = [];
    for (let index = 0; index < citas.length; index++) {
        var parts = citas[index]['APPOINTMENT_DATE'].split('-');
        var formattedDate = new Date(parts[0], parts[1] - 1, parts[2]);
        if (formattedDate.toLocaleDateString() == _selectedDate.toLocaleDateString()) {
            tempcita.push(citas[index]['APPOINTMENT']);
        }
    }

    return (
        <div>

            {tempcita[0] &&
                tempcita[0].map(({ APPOINTMENT_TIME, STATUS }, index) =>
                (
                    <div key={APPOINTMENT_TIME}
                        style={STATUS === 'No' ?
                            { border: index === selectedIndex ? '2px solid #a0a0a0 ' : 'none' } :
                            { border: index === selectedIndex ? '2px solid #e0e0e0' : 'none' }
                        }
                        onClick={() => 
                            setSelectedIndex(index)
                        
                            
                        }  >
                        <label>{APPOINTMENT_TIME} </label>
                    </div>
                ))}


        </div>
    )
}

export default SelectDateTime;
