"use client"
import { useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';

// Custom marker icon
const customIcon = new Icon({
  iconUrl: '/icon.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const locations = [
  { id: 1, name: 'Location 1', coordinates: [51.505, -0.09], description: 'Description for Location 1' },
  { id: 2, name: 'Location 2', coordinates: [51.51, -0.1], description: 'Description for Location 2' },
  { id: 3, name: 'Location 3', coordinates: [51.515, -0.08], description: 'Description for Location 3' },
];

const MapComponent = () => {
  const [activeLocation, setActiveLocation] = useState(null);

  return (
    <div className="w-full h-screen relative">
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={location.coordinates}
            icon={customIcon}
            eventHandlers={{
              click: () => setActiveLocation(location),
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg">{location.name}</h3>
                <p className="mt-1">{location.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {activeLocation && (
        <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg z-[1000]">
          <h3 className="font-bold text-lg">{activeLocation.name}</h3>
          <p className="mt-1">{activeLocation.description}</p>
          <button
            onClick={() => setActiveLocation(null)}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default MapComponent;