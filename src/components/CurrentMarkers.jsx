import React, { useState, useEffect } from 'react';
import { useMap } from '../MapContext';

const CurrentMarkers = () => {
    const { mapRef, markersRef } = useMap();
    const [markerCounts, setMarkerCounts] = useState({});

    useEffect(() => {
        if (!mapRef.current) return;

        const updateMarkersInfo = () => {
            const counts = markersRef.current.reduce((acc, marker) => {
                const tipo = marker.options.tipo_marcador;
                if (tipo) {
                    acc[tipo] = (acc[tipo] || 0) + 1;
                }
                return acc;
            }, {});

            setMarkerCounts(counts);
        };

        // Update markers info on component mount
        updateMarkersInfo();

        // Ensure that we are syncing with changes to the mapRef and markersRef
        const handleMapChange = () => {
            updateMarkersInfo();
        };

        // Add listeners to markers for 'add' and 'remove' events
        markersRef.current.forEach(marker => {
            marker.on('add', handleMapChange);
            marker.on('remove', handleMapChange);
        });

        mapRef.current.on('moveend', handleMapChange);

        // Cleanup listeners on unmount
        return () => {
            markersRef.current.forEach(marker => {
                marker.off('add', handleMapChange);
                marker.off('remove', handleMapChange);
            });

            if (mapRef.current) {
                mapRef.current.off('moveend', handleMapChange);
            }
        };
    }, [mapRef, markersRef]);

    return (
        <div className="info" style={{ position: 'absolute', top: '0', left: '0', backgroundColor: 'white', padding: '10px', zIndex: '1000' }}>
            <div>Marker Types:</div>
            <ul>
                {Object.entries(markerCounts).map(([type, count]) => (
                    <li key={type}>
                        {type}: {count}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CurrentMarkers;