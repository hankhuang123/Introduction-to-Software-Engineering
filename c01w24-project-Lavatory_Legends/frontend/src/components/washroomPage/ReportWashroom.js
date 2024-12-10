import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import NavBar from '../navComponents/NavBar';
import BackButton from '../navComponents/BackButton';
import reportImg from '../../res/image/reports.svg';
import { LocationComponent, ScheduleComponent } from './WashroomObject'; 
import { LOCALHOST } from '../../Constants';
import "./ReportWashroom.css";

const ReportWashroom = () => {
    const history = useHistory();
    const [address, setAddress] = useState('');
    const [comment, setComments] = useState('');
    const [schedule, setSchedule] = useState({
        Monday: { open: '08:00', close: '18:00' }, 
        Tuesday: { open: '08:00', close: '18:00' },
        Wednesday: { open: '08:00', close: '18:00' },
        Thursday: { open: '08:00', close: '18:00' },
        Friday: { open: '08:00', close: '18:00' },
        Saturday: { open: '08:00', close: '18:00' },
        Sunday: { open: '08:00', close: '18:00' },
    });
    const [issue, setIssue] = useState({
        'Location Wrong': false,
        'Opening Schedule Wrong': false,
        'Other Issue': false
    });

    const handleChange = (event) => {
        const { name, checked } = event.target;
        setIssue(prev => ({
            ...prev,
            [name]: checked,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem('userToken');
            const washroomId = localStorage.getItem('washroomId');

            const issueReportData = {
                issueType: Object.keys(issue).filter(key => issue[key]),
                location: address,
                schedule,
                comment,
            };

            await fetch(`${LOCALHOST}/post/reportIssue/${washroomId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(issueReportData)
            }).then(async (response) => {
                if (!response.ok) {
                    console.log("Unable to submit the issue.");
                    alert("Unable to submit the issue.");
                } else {
                    console.log("Issue submitted successfully.");
                    alert("Issue submitted successfully.\nYou will see the changes if approved by admins.");
                    history.goBack();
                }
            });
        } catch (error) {
            console.error('Failed to report issue: ', error);
        }
    }

    return (
        <div class="content-container">
        <div className="report-container">
            <BackButton />
            <div className="header">Report an Issue</div>
            <div className="prompt">Something wrong with the washroom? Tell Us!</div>
            <div className="issue-type">Type of Issue:</div>
            <form onSubmit={handleSubmit} style={PageStyle.formStyle}>
            {Object.entries(issue).map(([issueType, isChecked]) => (
                <div key={issueType} style={PageStyle.issueWrapper}>
                    <label style={PageStyle.labelStyle}>
                        <input
                            type="checkbox"
                            name={issueType}
                            checked={isChecked}
                            onChange={handleChange} 
                        />   
                        {issueType}
                    </label>
                    {issueType === 'Location Wrong' && isChecked && (
                        <LocationComponent setAddress={setAddress}/>
                    )}
                    {issueType === 'Opening Schedule Wrong' && isChecked && (
                        <ScheduleComponent
                            schedule={schedule}
                            setSchedule={setSchedule}
                        />
                    )}
                    {issueType === 'Other Issue' && isChecked && (
                        <textarea 
                            className="comment-box" 
                            placeholder="Leave your comment here!"
                            onChange={(e) => setComments(e.target.value)}
                        ></textarea>
                    )}
                </div>
                ))}
                <button className="submit-button">
                    <img src={reportImg} alt="Submit" className="button-icon" />
                    Submit
                </button>
                <NavBar />
            </form>
        </div>
    </div>
    );
}

export default ReportWashroom;

const PageStyle = {
    formStyle: {
        paddingLeft: "10%",
        paddingRight: "10%"
    },
    labelStyle: {
        display: "flex",
        flexDirection: "row",
        alignItems: "baseline",
    },
    issueWrapper : {
        display: "flex",
        flexDirection: "column",
        paddingBottom: "5%"
    }
};
