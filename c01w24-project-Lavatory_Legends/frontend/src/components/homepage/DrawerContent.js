import React from 'react';
import {ReactComponent as FlagImage} from '../../res/image/map-marker.svg';
import Autocomplete from "react-google-autocomplete";
import { apiKey } from '../../Constants';

const DrawerContent = (props) => {
    return (
        <div style={DrawerStyle.bar}>
            <Autocomplete 
                apiKey={apiKey}
                options={{types: ['street_address', 'locality', 'postal_code', 'neighborhood', 'intersection']}}
                onPlaceSelected={(place) => {
                    if (!place || place.name === '') {
                        console.log("place null or invalid");
                        return;
                    }
                    console.log(place);
                    console.log("address: ", place.formatted_address);
                    props.setLocation({
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng()
                    });
                }}
                style={DrawerStyle.autocompleteInput}
            />
            <button 
                style={ DrawerStyle.buttonStyle } 
                onClick={ props.setCurrentLocation }
            >
                <FlagImage style={DrawerStyle.buttonImage}/>
            </button>
        </div>
    );
};

export default DrawerContent;

const DrawerStyle = {
    bar: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        boxShadow: "0 -1px 0 #000",
    },
    buttonWrapper: {
        display: "grid",
    },
    buttonStyle: {
        fontSize: "20px",
        color: 'black',
        backgroundColor: "white"
    },
    buttonImage: { 
        maxWidth: "25px",
        maxHeight: "25px"
    },
    autocompleteInput: {
        marginTop: "0%",
    }
}
