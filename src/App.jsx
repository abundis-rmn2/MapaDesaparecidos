// src/App.jsx
import React, { useRef } from 'react';
import MapComponent from './components/MapComponent';
import DateFetch from './components/DateFetch'; // Update the import path as necessary
import { MapProvider, useMap } from './MapContext';

const App = () => {
    const mapRef = useRef(null); // Reference to MapComponent

    const handleFetchRecords = (fetchedRecords) => {
        if (mapRef.current && mapRef.current.updateMarkers) {
            mapRef.current.updateMarkers(fetchedRecords); // Update markers on the map
        }
    };

    return (
        <MapProvider>
            <div>
                <div id="form" style={{ position: 'absolute', bottom: '5px', right: '5px', backgroundColor: 'white', zIndex: 1000 }}>
                    <DateFetch onFetchRecords={handleFetchRecords} />
                </div>

                <div id="mapFixed" style={{ position: 'fixed', top: '0', left: '0', height: '100vh', width: '100%' }}>
                    <MapComponent ref={mapRef} style={{ position: 'relative', width: '100%', height: '100%' }} />
                </div>
            </div>
        </MapProvider>
    );
};

export default App;