// src/components/DateFetch.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useMap } from '../MapContext';
import L from 'leaflet';

const DateFetch = ({ onFetchRecords, currentmarkers }) => {
    const [startDate, setStartDate] = useState('2024-01-01');
    const [endDate, setEndDate] = useState('2024-02-01');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fetchedRecords, setFetchedRecords] = useState([]);
    const { mapRef, markersRef } = useMap();

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        setFetchedRecords([]);

        try {
            const response = await axios.get('https://datades.abundis.com.mx/api/specificDate.php', {
                headers: {
                    'API_KEY': 'gNXGJ0hCDavnMHvqbVRhL4yZalLUceQ4ccEHQmB40bQ',
                    'Content-Type': 'application/json'
                },
                params: {
                    start_date: startDate,
                    end_date: endDate
                }
            });

            const records = response.data.records || [];

            // Transform the records to include lat, lon, and additional attributes
            const transformedRecords = records.map((record) => {
                //console.log('Fetched Record:', record); // Log each fetched record

                const [lat, lon] = record.lat_long ? record.lat_long.split(',').map(coord => parseFloat(coord)) : [null, null];

                return {
                    ...record,
                    lat,
                    lon,
                    id: record.id_cedula_busqueda, // Using id_cedula_busqueda as unique identifier
                    fecha_desaparicion: record.fecha_desaparicion,
                    sexo: record.sexo,
                    edad_momento_desaparicion: record.edad_momento_desaparicion,
                    condicion_localizacion: record.condicion_localizacion,
                    descripcion_desaparicion: record.descripcion_desaparicion,
                    tipo_marcador: 'cedula_busqueda' // Adding tipo_marcador field
                };
            });

            setFetchedRecords(transformedRecords);

            //console.log('Fetched and Transformed Records:', transformedRecords);
        } catch (err) {
            console.error('Error fetching records:', err);
            setError('Error fetching records');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        fetchData();
    };

    const addRecordsToMap = () => {
        if (mapRef.current) {
            let newMarkersCount = 0;

            fetchedRecords.forEach(record => {
                // Check if the marker already exists
                const existingMarker = markersRef.current.find(marker => marker.options.id === record.id);
                if (!existingMarker && record.lat && record.lon) {
                    // Create and add new marker
                    const marker = L.marker([record.lat, record.lon], {
                        id: record.id,
                        tipo_marcador: record.tipo_marcador,
                        fecha_desaparicion: record.fecha_desaparicion,
                        sexo: record.sexo,
                        edad_momento_desaparicion: record.edad_momento_desaparicion,
                        condicion_localizacion: record.condicion_localizacion,
                        descripcion_desaparicion: record.descripcion_desaparicion
                    }).addTo(mapRef.current);

                    markersRef.current.push(marker);
                    newMarkersCount++;
                }
            });


            // Alert the number of new markers added
            alert(`Added ${newMarkersCount} new markers to the map.`);
            
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Start Date:
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                    </label>
                </div>
                <div>
                    <label>
                        End Date:
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                    </label>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Fetching...' : 'Fetch Records'}
                </button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {fetchedRecords.length > 0 && (
                <div>
                    <p>{`Fetched ${fetchedRecords.length} records`}</p>
                    <button onClick={addRecordsToMap}>Add {fetchedRecords.length} Records to Map</button>
                </div>
            )}
        </div>
    );
};

export default DateFetch;