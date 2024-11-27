// src/components/MapComponent.jsx
import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMap } from '../MapContext';
import CurrentMarkers from './CurrentMarkers';

const MapComponent = forwardRef((props, ref) => {
    const { mapRef, markersRef } = useMap();

    const addMarker = (record) => {
        if (mapRef.current && record.lat && record.lon) {
            const marker = L.marker([record.lat, record.lon], {
                id: record.id, // Unique identifier
                fecha_desaparicion: record.fecha_desaparicion,
                sexo: record.sexo,
                edad_momento_desaparicion: record.edad_momento_desaparicion,
                condicion_localizacion: record.condicion_localizacion,
                descripcion_desaparicion: record.descripcion_desaparicion,
                tipo_marcador: record.tipo_marcador,
            }).addTo(mapRef.current);
            markersRef.current.push(marker);
        }
    };

    useImperativeHandle(ref, () => ({
        updateMarkers: (records) => {
            if (!mapRef.current) return;

            // Remove old markers
            markersRef.current.forEach(marker => marker.remove());
            markersRef.current = [];

            // Add new markers
            records.forEach(record => {
                addMarker(record);
            });
        }
    }));

    useEffect(() => {
        if (mapRef.current) return; // Ensure the map is only initialized once

        const map = L.map('map').setView([20.7210006, -103.3312962], 13);
        mapRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        // Expose mapRef and markersRef to the global window object for debugging
        window.mapRef = mapRef;
        window.markersRef = markersRef;

        return () => {
            if (mapRef.current) {
                mapRef.current.remove(); // Properly clean up the map instance
                mapRef.current = null;
            }
            markersRef.current = [];
        };
    }, []);

    return (
        <div id="map-container" style={{ position: 'relative', height: '100vh', width: '100%' }}>
            <div id="map" style={{ height: '100%', width: '100%' }}></div>
            <CurrentMarkers />
        </div>
    );
});

export default MapComponent;