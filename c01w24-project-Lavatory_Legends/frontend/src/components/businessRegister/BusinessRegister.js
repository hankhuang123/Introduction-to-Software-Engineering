import { useState } from 'react'
import { useHistory } from 'react-router-dom';
import Autocomplete from "react-google-autocomplete";
import { apiKey, LOCALHOST } from '../../Constants';
import NavBar from '../navComponents/NavBar';
import BackButton from '../navComponents/BackButton';

const BusinessRegister = () => {
    const userToken = localStorage.getItem("userToken");

    const [businessName, setBusinessname] = useState('');
    const [address, setAddress] = useState('');
    const history = useHistory();
    const [status, setStatus] = useState("");
    
    const [error, setError] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("Loading...");
        try {
            await fetch(`${LOCALHOST}/business/register`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${ userToken }`
                },
                body: JSON.stringify({
                    bname: businessName,
                    address: address,
                }),
            }).then(async (response) => {
                if (!response.ok) {
                    setStatus("Error trying to register!");
                    // alert("Served failed: "+ response.status);
                    console.log("Served failed:", response.status);
                } else {
                    await response.json().then(() => {
                        localStorage.setItem('isBusinessOwner', true);
                        alert("Register sucessfully!");
                        history.push(`/map`); // Redirect to the map page
                })};
            });
        } catch (error) {
            setStatus("Error trying to register");
            console.error('Registration error', error);
            // Handle register error
        }
    };

    return (
        <div className="App">
        <div className="signup-form" style={{ maxWidth: '430px' }}>
        <BackButton />
            <h2>Create Business</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input 
                    type="text"
                    placeholder="Business Name"
                    value={businessName}
                    onChange={(e) => setBusinessname(e.target.value)}
                />
                <Autocomplete
                    apiKey={apiKey}
                    options={{types: ['street_address']}}
                    onPlaceSelected={(place) => {
                        if (!place || place.name === '') {
                            console.log("place null or invalid");
                            return;
                        }
                        console.log(place);
                        console.log("address: ", place.formatted_address);
                        setAddress(place.formatted_address);
                    }}
                    required
                />
                <button type="submit">SIGN UP</button>
                {status}
            </form>
            <div className="signin-links">
            </div>
        </div>
        <NavBar />
        </div>
    ) 
}

export default BusinessRegister;