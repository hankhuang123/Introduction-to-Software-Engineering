import React from 'react';
import Autocomplete from "react-google-autocomplete";
import { apiKey } from '../../Constants';
import mapMarkerImg from '../../res/image/map-marker-2.svg';
import clockImg from '../../res/image/clock-time.svg';

const LocationComponent = (props) => {
    const setAddress = props.setAddress;

    return (
        <label style={PageStyle.labelStyle}>
            <div>
                <img src={mapMarkerImg} alt="Location" className="location-marker" />
                Location
            </div>
            <Autocomplete
                apiKey={apiKey}
                options={{types: ['street_address']}}
                onPlaceSelected={(place) => {
                    if (!place || place.name === '') {
                        console.log("place null or invalid");
                        return;
                    }
                    setAddress(place.formatted_address);
                }}
                required
            />
        </label>
    );
};

const ScheduleComponent = (props) => {
    const schedule = props.schedule;
    const setSchedule = props.setSchedule;

    const handleScheduleChange = (day, openClose, value) => {
        setSchedule(prev => ({
            ...prev,
            [day]: { ...prev[day], [openClose]: value },
        }));
    };

    return (
        <div className="schedule-container" style={PageStyle.scheduleContainer}>
            <img src={clockImg} alt="Clock" className="section-icon" />
            Schedule (Open - Close):
            {Object.entries(schedule).map(([day, times]) => (
                <div key={day} style={PageStyle.scheduleStyle}>
                    <label>{day}:</label>
                    <div style={PageStyle.timesContainer}>
                    <input
                        type="time"
                        value={times.open}
                        style={PageStyle.timeInput}
                        onChange={(e) => handleScheduleChange(day, 'open', e.target.value)}
                    />
                    -
                    <input
                        type="time"
                        value={times.close}
                        style={PageStyle.timeInput}
                        onChange={(e) => handleScheduleChange(day, 'close', e.target.value)}
                    />

                    </div>
                    
                </div>
            ))}
        </div>
    );
};

export { LocationComponent, ScheduleComponent };

const PageStyle = {
    labelStyle: {
        display: "flex",
        flexDirection: "row",
        alignItems: "baseline",
        width: "100%",
        justifyContent: "space-between"
    },
    scheduleStyle: {
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between"
    },
    scheduleContainer: {
        paddingTop: "5%"
    },
    timesContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "baseline",
        width: "100%",
        justifyContent: "end"
    },
    timeInput: {
        width: "fit-content"
    }
};