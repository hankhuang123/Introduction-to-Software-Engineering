import React,{ useState } from 'react'
import { useHistory } from 'react-router-dom';
import { LOCALHOST } from '../../Constants';

const UserRegister = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState("");
    const [error, setError] = useState('');
    const history = useHistory();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("Loading...");
        if (password !== confirmPassword) {
            alert("Passwords don't match.");
            return;
        }
        try {
            await fetch(`${LOCALHOST}/user/register`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password,
                }),
            }).then(async (response) => {
                if (!response.ok) {
                    setStatus("Error trying to register!");
                    // alert("Served failed: "+ response.status);
                    console.log("Served failed:", response.status);
                } else {
                    await response.json().then(() => {
                        history.push(`/user/login`); // Redirect to the login page
                })};
            });
        } catch (error) {
            setStatus("Error trying to post note");
            console.error('Registration error', error);
            setError(error);
            // Handle register error
        }
    };

    return (
        <div className="App">
        <div className="signup-form" style={{ maxWidth: '430px' }}>
            <h2>Create Account</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
            <input 
                type="text"
                placeholder="User Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input 
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
            />
            <input 
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input 
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button type="submit">SIGN UP</button>
            {status}
            </form>
            <div className="signin-links">
            <p>Already have an account? <a href="/user/login">Sign in</a></p>
            </div>
        </div>
        </div>
    ) 
}

export default UserRegister