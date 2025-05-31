// rrd imports
import { useState } from "react";
//librery
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export function UpdateSchedule({ excludeTimes, horario }) {
    const listIntervaloDes = ['30 min', '45 min', '1 hora', '2 horas'];
    const [valuesDefault, setValuesDefault] = useState(horario);

    const handleChangeCheckbox = (indexToUpdate, evt) => {
        const value = evt.target.checked;
        if (value) {
            var newValue = valuesDefault[indexToUpdate];
            newValue['value'] = 1;
            setValuesDefault(valuesDefault.map((item, index) =>
                index === indexToUpdate ? newValue : item
            ));
        }
        else {
            var newValue = valuesDefault[indexToUpdate];
            newValue['value'] = 0;
            setValuesDefault(valuesDefault.map((item, index) =>
                index === indexToUpdate ? newValue : item
            ));

        }
    };

    const handleChangeDesde = (value, indexToUpdate) => {
        const hour = ('0' + value.getHours()).slice(-2);
        var newValue = valuesDefault[indexToUpdate];
        newValue['desdeH'] = hour;
        setValuesDefault(valuesDefault.map((item, index) =>
            index === indexToUpdate ? newValue : item
        ));
    };

    const handleChangeHasta = (value, indexToUpdate) => {
        const hour = ('0' + value.getHours()).slice(-2);
        var newValue = valuesDefault[indexToUpdate];
        newValue['hastaH'] = hour;
        setValuesDefault(valuesDefault.map((item, index) =>
            index === indexToUpdate ? newValue : item
        ));
    };

    const handleChangeIntervalo = (indexToUpdateIntervalo, indexToUpdate) => {
        var dIntervalo = '0.5_0.75_1_2'.split('_');
        var _intervaloDes = '30 min_45 min_1 hora_2 horas'.split('_');
        var newValue = valuesDefault[indexToUpdate];
        newValue['intervalo'] = dIntervalo[indexToUpdateIntervalo];
        newValue['intervaloDes'] = _intervaloDes[indexToUpdateIntervalo];
        setValuesDefault(valuesDefault.map((item, index) =>
            index === indexToUpdate ? newValue : item
        ));
    };

    const btnRegisterSchedule = () => {
        var iCountDiasMal = 0;
        for (var val in valuesDefault) {
            var element = valuesDefault[val];
            if (element['desdeH'] > element['hastaH'] ) {
                iCountDiasMal = iCountDiasMal + 1;
            }
        }
        if (iCountDiasMal == 0) {
            console.log(valuesDefault);
            alert('Es posible que este cambio tarde unos minutos en reflejarse en todos lados');
        }
        else {
            alert('Es posible que exista un hora incorrecta o no válido');
        }
    };

    return (
        <div className='GroupLabel'>
            <span>Las personas pueden elegir la fecha y la hora de su cita en función del calendario que configures.</span>
            <span>CALENDARIO</span>
            <span>Elige los días y horarios disponibles para realizar citas en tu calendario.</span>
            {
                valuesDefault.map((valor, index) => (
                    <div >
                        <label>{valor['day_name']}</label>
                        <input type="checkbox" defaultChecked={valor['value'] == 0 ? false : true} onClick={(evt) => { handleChangeCheckbox(index, evt); }} />
                        <div className={valor['value'] == 0 ? 'nameGroup active' : 'nameGroup'}>
                            <div className='GroupLabel'>
                                <label>Desde</label>
                                <DatePicker
                                    dateFormat="h:mm aa"
                                    selected={new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDay(), valor['desdeH'], valor['desdeM'], '00')}
                                    onChange={(date) => { handleChangeDesde(date, index); }}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={60}
                                    showTimeCaption={false}
                                    excludeTimes={excludeTimes}
                                />
                                <label>Hasta</label>
                                <DatePicker
                                    dateFormat="h:mm aa"
                                    selected={new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDay(), valor['hastaH'], valor['hastaM'], '00')}
                                    onChange={(date) => { handleChangeHasta(date, index); }}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={60}
                                    showTimeCaption={false}
                                    excludeTimes={excludeTimes}
                                />
                                <label>Intervalo de tiempo</label>
                                {
                                    <select name="" id="">
                                        {
                                            listIntervaloDes.map((Intervalo, indexIntervalo) => (
                                                Intervalo == valor['intervaloDes'] ?
                                                    <option value={Intervalo} selected onClick={() => (handleChangeIntervalo(indexIntervalo, index))}>{Intervalo}</option> :
                                                    <option value={Intervalo} onClick={() => (handleChangeIntervalo(indexIntervalo, index))} >{Intervalo}</option>
                                            )
                                            )
                                        }
                                    </select>
                                }
                            </div>
                        </div>
                        <div className='businessContainer_Divider'></div>
                    </div>
                ))
            }
            <div class="bt-btn">
                <button onClick={() => (btnRegisterSchedule())} >Guardar</button>
            </div>
        </div>);
}

export default UpdateSchedule;