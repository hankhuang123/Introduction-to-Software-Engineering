import React,{ useState } from 'react'
import { useHistory } from 'react-router-dom';
import { isAdmin, isBusinessOwner } from '../../GenericHelpers';
import { LOCALHOST } from '../../Constants';

const Loginpage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();
    const [status, setStatus] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setStatus("Loading...");
        try {
            await fetch(`${LOCALHOST}/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            }).then(async (response) => {
                if (!response.ok) {
                setStatus("Wrong Username or Password");
                console.log("Served failed:", response.status);
                } else {
                await response.json().then(async (data) => {
                    localStorage.setItem('userToken', data.token);
                    localStorage.setItem('username', data.username);
                    localStorage.setItem('isAdmin', await isAdmin());
                    localStorage.setItem('isBusinessOwner', await isBusinessOwner());
                    history.push(`/home/${data.token}`); // Redirect to the homepage
                })};
            });
        } catch (error) {
            setStatus("Error trying to login");
            console.error("Login failed:", error);
            // Handle login error
        }
    };

    return (
        <div className="App">
        <div className="signup-form" style={{ maxWidth: '430px' }}>
            <h2>Login</h2>
            <form onSubmit={handleLogin} style={PageStyle.inputContainer}>
                <label style={PageStyle.labelStyle}>
                    <input
                        type="text"
                        placeholder="User Name or Email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </label>
                <label style={PageStyle.labelStyle}>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <button type="submit">LOGIN</button>
                {status}
            </form>
            <div className="signin-links">
            <p>Don't have an account? <a href="/user/register">Sign up</a></p>
            </div>
        </div>
        </div>
    )
}

export default Loginpage;

const PageStyle = {
    inputContainer : {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    labelStyle: {
        width: "100%" 
    }
};
