// src/components/MapComponent.jsx
import React, { useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useMap } from '../MapContext';

const MapComponent = forwardRef((props, ref) => {
    const { markersRef } = useMap();
    const mapRef = useRef(null);
    const markerRefs = useRef([]);

    const addMarker = (record) => {
        if (record.lat && record.lon) {
            return (
                <Marker
                    position={[record.lat, record.lon]}
                    key={record.id}
                    record={record}
                />
            );
        }
    };

    useImperativeHandle(ref, () => ({
        updateMarkers: (records) => {
            markerRefs.current = records.map(record => addMarker(record));
        }
    }));

    useEffect(() => {
        window.markersRef = markersRef;
        return () => {
            markersRef.current = [];
            mapRef.current = null;
        };
    }, []);

    return (
        <div id="map-container" style={{ position: 'relative', height: '100vh', width: '100%' }}>
            <MapContainer
                center={[20.7210006, -103.3312962]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                whenCreated={(mapInstance) => {
                    mapRef.current = mapInstance;
                }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                {markerRefs.current}
            </MapContainer>
        </div>
    );
});

export default MapComponent;