import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import Autocomplete from "react-google-autocomplete";
import { apiKey, LOCALHOST } from '../../Constants';
import NavBar from '../navComponents/NavBar';
import BackButton from '../navComponents/BackButton';

const BusinessModify = () => {
    const userToken = localStorage.getItem("userToken");

    const [oldBusinessName, setOldBusinessname] = useState('');
    const [oldAddress, setOldAddress] = useState('');
    const [businessName, setBusinessname] = useState('');
    const [address, setAddress] = useState('');
    const history = useHistory();
    const [status, setStatus] = useState("");
    
    const [error, setError] = useState('');

    useEffect(() => {
        const getBusinessName = async () => {
            try {
                await fetch(`${LOCALHOST}/business/get-user-business`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${ userToken }`
                    }
                })
                .then(async (response) => {
                    if (!response.ok) {
                        console.log("Served failed:", response.status)
                    } else {
                        await response.json().then((data) => {
                            setOldBusinessname(data.businessName);
                            setOldAddress(data.address);
                        })
                    }
                })
            } catch (error) {
                console.log("Fetch function failed:", error)
            }
        }

        getBusinessName();
    }, [])
    
    const handleUpdate = async (e) => {
        e.preventDefault();
        setStatus("Loading...");
        try {
            console.log(userToken);
            await fetch(`${LOCALHOST}/business/update`, {
                method: 'PATCH',
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
                    setStatus("Error trying to update!");
                    // alert("Served failed: "+ response.status);
                    console.log("Served failed:", response.status);
                } else {
                    await response.json().then(() => {
                        localStorage.setItem('isBusinessOwner', true);
                        alert("Update sucessfully!");
                        history.push(`/map`); // Redirect to the map page
                })};
            });
        } catch (error) {
            setStatus("Error trying to update");
            console.error('Updating error', error);
            // Handle register error
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        setStatus("Loading...");
        try {
            await fetch(`${LOCALHOST}/business/delete`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${ userToken }`
                },
            }).then(async (response) => {
                if (!response.ok) {
                    setStatus("Error trying to delete!");
                    // alert("Served failed: "+ response.status);
                    console.log("Served failed:", response.status);
                } else {
                    await response.json().then(() => {
                        localStorage.setItem('isBusinessOwner', false);
                        alert("Properly deleted.");
                        history.push(`/map`); // Redirect to the map page
                })};
            });
        } catch (error) {
            setStatus("Error trying to delete");
            console.error('Deletion error', error);
            // Handle register error
        }
    };

    return (
        <div className="App">
        <div className="signup-form" style={{ maxWidth: '430px' }}>
        <BackButton />
            <h2>Modify Business Info</h2>
            {error && <p className="error">{error}</p>}
            <input 
                type="text"
                placeholder={oldBusinessName}
                value={businessName}
                onChange={(e) => setBusinessname(e.target.value)}
            />
            <Autocomplete
                apiKey={apiKey}
                placeholder={oldAddress}
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
            <button onClick={handleUpdate}>UPDATE</button>
            <button onClick={handleDelete}>DELETE MY BUSINESS</button>
            {status}
            <div className="signin-links">
            </div>
        </div>
        <NavBar />
        </div>
    ) 
}

export default BusinessModify;