import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { LOCALHOST } from '../../Constants';
import { LocationComponent, ScheduleComponent } from './WashroomObject';
import NavBar from '../navComponents/NavBar';
import BackButton from '../navComponents/BackButton';
import reportImg from '../../res/image/reports.svg';
import okImg from '../../res/image/ok.svg';

function WashroomForm() {
    const history = useHistory();
    const [address, setAddress] = useState('');
    const [comments, setComments] = useState('');
    const [schedule, setSchedule] = useState({
        Monday: { open: '08:00', close: '18:00' }, 
        Tuesday: { open: '08:00', close: '18:00' },
        Wednesday: { open: '08:00', close: '18:00' },
        Thursday: { open: '08:00', close: '18:00' },
        Friday: { open: '08:00', close: '18:00' },
        Saturday: { open: '08:00', close: '18:00' },
        Sunday: { open: '08:00', close: '18:00' },
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('userToken'); 
        const washroomData = { location: address, openingSchedule: schedule, additionalInfo: comments };
        try {
            const response = await fetch(`${LOCALHOST}/post/addWashroom`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, 
                },
                body: JSON.stringify(washroomData),
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            console.log('Success:', data);
            alert("Washroom request sent successfully!\nYou will see it if it's approved by an admin.");
            history.push("/map");
        } catch (error) {
            console.error('Failed to submit washroom:', error);
            alert('Failed to submit the new washroom request.');
        }
    };

    return (
        <div className="content-container">
            <BackButton />
            <div className="washroomForm" style={PageStyle.formStyle}>
                <h2>Finding a new washroom</h2>
                <form onSubmit={handleSubmit}>
                    <LocationComponent setAddress={setAddress}/>
                    <br />
                    <ScheduleComponent 
                        schedule={schedule} 
                        setSchedule={setSchedule}
                    />
                    <br />
                    <label style={PageStyle.commentsWrapper}>
                        <div>
                            <img src={reportImg} alt="Info" className="section-icon" />
                            Additional Infomation:
                        </div>
                        <textarea
                            className='comment-box'
                            placeholder="Leave your comments here!" 
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                        />
                    </label>
                    <button type="submit" className="button-with-image">
                        <img src={okImg} alt="Submit" />
                        Submit
                    </button>
                </form>
            </div>
            <NavBar />
    </div>
    );
}

export default WashroomForm;

const PageStyle = {
    formStyle: {
        paddingLeft: "10%",
        paddingRight: "10%"
    },
    commentsWrapper: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        alignItems: "baseline"
    },
};
