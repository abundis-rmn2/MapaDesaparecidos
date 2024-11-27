// src/App.jsx
import React, { useEffect } from 'react';
import MapComponent from './components/MapComponent';
import DateFetch from './components/DateFetch'; // Update the import path as necessary
import { MapProvider, useMap } from './MapContext';
import CedulaFilter from "./components/CedulaFilter.jsx";

const AppContent = () => {
    const { markersRef } = useMap(); // Access markersRef and update from useMap hook

    useEffect(() => {
        const logMarkersRef = () => {
        };

        // Set up an interval to log the markersRef every 4 seconds
        const intervalId = setInterval(logMarkersRef, 4000);

        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);
    }, [markersRef]);

    const handleFetchRecords = (fetchedRecords) => {
        if (mapRef.current && mapRef.current.updateMarkers) {
            mapRef.current.updateMarkers(fetchedRecords); // Update markers on the map
        }
    };

    return (
        <div>
            <div id="form" style={{ position: 'absolute', bottom: '5px', right: '5px', backgroundColor: 'white', zIndex: 1000 }}>
                <DateFetch onFetchRecords={handleFetchRecords} />
                <CedulaFilter />
            </div>
            <div id="mapFixed" style={{ position: 'fixed', top: '0', left: '0', height: '100vh', width: '100%' }}>
                <MapComponent style={{ position: 'relative', width: '100%', height: '100%' }} />
            </div>
        </div>

    );
};

const App = () => (
    <MapProvider>
        <AppContent />
    </MapProvider>
);

export default App;