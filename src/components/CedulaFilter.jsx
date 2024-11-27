import React, { useState } from 'react';
import { useMap } from '../MapContext';

const CedulaFilter = () => {
    const { markersRef } = useMap();

    const [sexoOptions, setSexoOptions] = useState([]);
    const [condicionLocalizacionOptions, setCondicionLocalizacionOptions] = useState([]);
    const [fechaDesaparicionOptions, setFechaDesaparicionOptions] = useState([]);
    const [edadMomentoDesaparicionOptions, setEdadMomentoDesaparicionOptions] = useState([]);

    const [sexo, setSexo] = useState('');
    const [condicionLocalizacion, setCondicionLocalizacion] = useState('');
    const [fechaDesaparicion, setFechaDesaparicion] = useState('');
    const [edadMomentoDesaparicion, setEdadMomentoDesaparicion] = useState('');

    const handleUpdateFilters = () => {

        // Ensure markersRef is treated as an array
        const markersArray = Array.isArray(markersRef) ? markersRef : Object.values(markersRef);
        console.log(markersArray[0][3]);

        if (markersArray[0].length > 0) {
            const sexoSet = new Set();
            const condicionLocalizacionSet = new Set();
            const fechaDesaparicionSet = new Set();
            const edadMomentoDesaparicionSet = new Set();

            markersArray[0].forEach(record => {
                if (record) {
                    sexoSet.add(record.options.sexo);
                    condicionLocalizacionSet.add(record.options.condicion_localizacion);
                    fechaDesaparicionSet.add(record.options.fecha_desaparicion);
                    edadMomentoDesaparicionSet.add(record.options.edad_momento_desaparicion);
                }
            });

            setSexoOptions([...sexoSet]);
            setCondicionLocalizacionOptions([...condicionLocalizacionSet]);
            setFechaDesaparicionOptions([...fechaDesaparicionSet].sort());
            setEdadMomentoDesaparicionOptions([...edadMomentoDesaparicionSet].sort((a, b) => a - b));
        } else {
            console.error('markersRef does not contain valid data:', markersRef);
        }
    };

    return (
        <div>
            <button onClick={handleUpdateFilters}>Log markersRef and Update Filters</button>

            <form>
                <div>
                    <label>
                        Sexo:
                        <select value={sexo} onChange={(e) => setSexo(e.target.value)}>
                            <option value="">Select</option>
                            {sexoOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        Condición Localización:
                        <select value={condicionLocalizacion} onChange={(e) => setCondicionLocalizacion(e.target.value)}>
                            <option value="">Select</option>
                            {condicionLocalizacionOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        Fecha de Desaparición:
                        <select value={fechaDesaparicion} onChange={(e) => setFechaDesaparicion(e.target.value)}>
                            <option value="">Select</option>
                            {fechaDesaparicionOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        Edad Momento de Desaparición:
                        <select value={edadMomentoDesaparicion} onChange={(e) => setEdadMomentoDesaparicion(e.target.value)}>
                            <option value="">Select</option>
                            {edadMomentoDesaparicionOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </label>
                </div>
            </form>
        </div>
    );
};

export default CedulaFilter;