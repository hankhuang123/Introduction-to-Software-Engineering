import React from 'react'
import { useHistory } from 'react-router-dom'
import hurryImg from '../../res/image/hurry_image.jpg'

const Openpage = () => {
    let history = useHistory();

    function handleGetStartedClick(){
        history.push('/user/login');
    }

    return (
        <div className="App">
        <div className="signup-form" style={{ maxWidth: '430px' }}>
            <img src={hurryImg} alt='hurry'/>
            <h1>Need to find a nearby washroom?</h1>
            <div className="small-note">
                <p>You know where to go, when you have to go</p>
            </div>
            <button onClick={handleGetStartedClick}>
                Get Started
            </button>
        </div>
        </div>
    )
}

export default Openpage