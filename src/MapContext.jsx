// src/MapContext.js
import React, { createContext, useContext, useRef } from 'react';

const MapContext = createContext();

const MapProvider = ({ children }) => {
    const mapRef = useRef(null);
    const markersRef = useRef([]);

    return (
        <MapContext.Provider value={{ mapRef, markersRef }}>
            {children}
        </MapContext.Provider>
    );
};

const useMap = () => {
    const context = useContext(MapContext);
    if (!context) {
        throw new Error('useMap must be used within a MapProvider');
    }
    return context;
}

export { MapProvider, useMap };