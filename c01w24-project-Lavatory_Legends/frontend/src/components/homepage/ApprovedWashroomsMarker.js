import React, { useEffect, useState } from 'react';
import { Marker } from '@vis.gl/react-google-maps';
import { useHistory } from 'react-router-dom';
import { apiKey, LOCALHOST } from '../../Constants'; 

const ApprovedWashroomsMarker = () => {
  const [washrooms, setWashrooms] = useState([]);
  const history = useHistory();
  const redMarkerIcon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';

  const goToWashroInfo = (washroomId) => {
    history.push(`/washroominfo/${washroomId}`);
  };

  useEffect(() => {
    const fetchUrl = `${LOCALHOST}/admin/washrooms/approvedWashrooms`;

    const geocodeAddress = async (address) => {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === 'OK') {
        const { lat, lng } = data.results[0].geometry.location;
        return { lat, lng };
      } else {
        throw new Error(`Geocoding failed for address: ${address}`);
      }
    };
    
    const fetchApprovedWashrooms = async () => {
      try {
        const response = await fetch(fetchUrl);
        const data = await response.json();
        const geocodedWashrooms = await Promise.all(data.map(async (washroom) => {
          try {
            const position = await geocodeAddress(washroom.location);
            return { ...washroom, position };
          } catch (error) {
            console.error(`Failed to geocode address "${washroom.location}":`, error);
            return null;
          }
        }));
        setWashrooms(geocodedWashrooms.filter(washroom => washroom !== null));
      } catch (error) {
        console.error('Failed to fetch approved washrooms:', error);
      }
    };

    fetchApprovedWashrooms();
  }, []);

  return (
    <>
      {washrooms.map((washroom) => washroom.position && (
        <Marker
          key={washroom._id.toString()} 
          position={washroom.position}
          icon={redMarkerIcon}
          onClick={() => goToWashroInfo(washroom._id)}
        />
      ))}
    </>
  );
};

export default ApprovedWashroomsMarker;



