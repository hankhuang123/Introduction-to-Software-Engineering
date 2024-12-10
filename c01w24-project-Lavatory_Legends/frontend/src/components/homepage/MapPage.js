import React, { useEffect, useState } from 'react';
import NavBar from '../navComponents/NavBar';
import DrawerContent from './DrawerContent';
import { Map, APIProvider, useMap } from '@vis.gl/react-google-maps';
import ApprovedWashroomsMarker from './ApprovedWashroomsMarker';
import { NotificationPopup, checkHasNotification } from '../notificationPopup/Notification';
import { apiKey } from '../../Constants';

const UpdateMap = (props) => {
    const map = useMap();
    const coordinates = props.coordinates;

    useEffect(() => {
        if (!map || !coordinates) {
            console.log("map is null");
            return;
        }
        map.setCenter(coordinates);
        map.setZoom(17);
    
    }, [map, coordinates])

    return null;
};

const MapPage = () => {
    const [coordinates, setCoordinates] = useState({lat: 43.7764, lng: -79.3832}); // toronto
    const [hasNotification, setHasNotification] = useState(false);

    const setLocation = (coords) => {
        if (!coords) { 
            console.log("lat or lng is null");
            return;
        }
        setCoordinates(coords);
        console.log("Set coordinates to: ", coords);
    }

    const setCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                console.log("Getting current location...");
                setLocation({lat: position.coords.latitude, lng: position.coords.longitude});
            });
        } else {
            console.log("Unable to get current location.");
        }
    }

    useEffect(() => {
        const lat = localStorage.getItem('currLat');
        const lng = localStorage.getItem('currLng');
        if (lat && lng) {
            setCoordinates({lat: parseFloat(lat), lng: parseFloat(lng)});
        }

        const getIfHasNotification = async () => {
            setHasNotification(await checkHasNotification());
        };
        getIfHasNotification();
        
    }, [setCoordinates, setHasNotification, checkHasNotification]);

    return (
            <div style={MapStyle.pageStyle}>
                <APIProvider apiKey={apiKey} style={MapStyle.mapStyle}>
                    <div style={MapStyle.contentContainer}>
                        {hasNotification ? <NotificationPopup />: null }
                        <Map 
                            defaultCenter={ coordinates }
                            defaultZoom={ 20 }
                            gestureHandling={ 'greedy' }
                            disableDefaultUI={ true }
                        >
                            <ApprovedWashroomsMarker />
                        </Map>
                        <DrawerContent 
                                setLocation={ setLocation } 
                                setCurrentLocation={ setCurrentLocation }
                        />  
                        <UpdateMap coordinates={coordinates} />  
                    </div>
                </APIProvider>
                <NavBar />
            </div>
    );
}

export default MapPage;

const MapStyle = {
    pageStyle : {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        width: "100%"
    },
    contentContainer : {
        height: "93%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        paddingBottom: "5pc",
    },
    mapStyle : {
        width: "100%",
    }
};
