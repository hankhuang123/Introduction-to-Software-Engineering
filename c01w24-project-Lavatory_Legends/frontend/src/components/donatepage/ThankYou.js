import {useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { sleep } from '../../GenericHelpers';

const CompletionPage = (props) => {
    const history = useHistory();

    useEffect(() => {
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
            await sleep(3000);
            history.push('/map');
        }
        goToMap();

    }, [history]);

    return (
        <h1>Thank you so much for your supporting! 🎉🎉🎉</h1>
    );
  }
  
export default CompletionPage;