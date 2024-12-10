import React from 'react';
import { useHistory } from 'react-router-dom';
import { sleep } from '../../GenericHelpers';
import Sponsors from '../sponsors/Sponsors';

const Homepage = () => {
    const history = useHistory();
    const username = localStorage.getItem('username');
    
    React.useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (!token) {
            history.push('/user/login'); // Redirect to login if no token
            return;
        }

        // wait and then go to map page
        async function goToMap() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    localStorage.setItem('currLat', position.coords.latitude);
                    localStorage.setItem('currLng', position.coords.longitude);
                });
            } else {
                console.log("Unable to set current location as default location.");
            }
            await sleep(2000);
            history.push('/map');
        }
        goToMap();

    }, [history]);

    return (
        <div className='content-container'>
            <div className="App">
                <div className="signup-form" style={{ maxWidth: '430px' }}>
                    <h2>Homepage</h2>
                    Welcome back, {username}!
                </div>
            </div>
            <h2>Big thanks to our sponsors!</h2>
            <Sponsors />
        </div>
        
    )
};

export default Homepage;
