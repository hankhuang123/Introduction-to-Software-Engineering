import React,{ useState } from 'react'
import NavBar from '../navComponents/NavBar'
import BackButton from '../navComponents/BackButton'
import { LOCALHOST } from '../../Constants'

const CreateAdminPage = () => {
    const [username, setUsername] = useState('');
    const [status, setStatus] = useState("");

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        setStatus("Loading...");
        const currToken = localStorage.getItem('userToken');
        try {
            await fetch(`${LOCALHOST}/admin/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${currToken}`
                },
                body: JSON.stringify({
                    username: username,
                }),
            }).then(async (response) => {
                if (!response.ok) {
                    setStatus("Registration of user as admin failed. Please check the username.");
                    console.log("Admin registration failed:", response.status);
                } else {
                    setStatus(`Registration of user '${username}' as admin successful.`);
                    console.log(`Registration of user '${username}' as admin successful.`);
                };
            });
        } catch (error) {
            setStatus(`Error trying to register user '${username}' as admin.`);
            console.error(`Register user '${username}' failed: `, error);
        }
    };

    return (
        <div className='content-container'>
            <BackButton />
            <div>
                <h1>Create Admin</h1>
                <form onSubmit={handleCreateAdmin} style={NotificationStyle.formStyle}>
                    <label style={ NotificationStyle.userInput }>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </label>
                    <div style={NotificationStyle.buttonWrapper}>
                        <button type="submit" style={NotificationStyle.buttonStyle}>
                            CREATE
                        </button>
                    </div>
                </form>
                {status}
                </div>
            <NavBar />
        </div>
    )
}

export default CreateAdminPage

const NotificationStyle = {
    formStyle: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        padding: "10%"
    },
    buttonWrapper: {
        display: "flex",
        flexDirection: "row-reverse",
        alignContent: "flex-end",
        paddingRight: "15%"
    },
    buttonStyle: {
        backgroundColor: "red",
        color: "white",
        margin: "8px 8px",
        border: "none",
        width: "25%",
        borderRadius: "16px",
    },
    userInput: {
        width: "80%",
        display: "flex",
        justifyContent: "center"
    },
    contentInput: {
        width: "80%",
        display: "flex",
        justifyContent: "center",
        height: "70%"
    }
}