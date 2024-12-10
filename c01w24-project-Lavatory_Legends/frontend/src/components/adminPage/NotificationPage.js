import React,{ useState } from 'react'
import NavBar from '../navComponents/NavBar'
import BackButton from '../navComponents/BackButton'
import { LOCALHOST } from '../../Constants'

const NotificationPage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState("");

    const handlePostNotification = async (e) => {
        e.preventDefault();
        setStatus("Loading...");
        const currToken = localStorage.getItem('userToken');
        try {
            await fetch(`${LOCALHOST}/notification/postNotification`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${currToken}`
                },
                body: JSON.stringify({
                    title: title,
                    content: content
                }),
            }).then(async (response) => {
                if (!response.ok) {
                    setStatus("Unable to post notification.");
                    console.log("Unable to post notification:", response.status);
                } else {
                    setStatus(`Posting notification '${title}' successful.`);
                    console.log(`Posting notification '${title}' successful.`);
                };
            });
        } catch (error) {
            setStatus(`Error trying to post notification '${title}'.`);
            console.error(`Post notification '${title}' failed: `, error);
        }
    };

    const handleClearNotification = async (e) => {
        e.preventDefault();
        setStatus("Loading...");
        const currToken = localStorage.getItem('userToken');
        try {
            await fetch(`${LOCALHOST}/notification/clearNotifications`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${currToken}`
                }
            }).then(async (response) => {
                if (!response.ok) {
                    setStatus("Unable to clear notifications.");
                    console.log("Unable to clear notifications:", response.status);
                } else {
                    setStatus(`Clearing all notifications successful.`);
                    console.log(`Clearing all notifications successful.`);
                };
            });
        } catch (error) {
            setStatus(`Error trying to clear notifications.`);
            console.error(`Deleting all notifications failed: `, error);
        }
    };

    return (
        <div className='content-container'>
            <BackButton />
            {status}
            <div>
                <h1>Post Notification</h1>
                <form onSubmit={handlePostNotification} style={NotificationStyle.formStyle}>
                    <label style={ NotificationStyle.userInput }>
                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </label>
                    <label style={ NotificationStyle.userInput }>
                        <input
                            type="text"
                            placeholder="Content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </label>
                    <div style={NotificationStyle.buttonWrapper}>
                        <button type="submit" style={NotificationStyle.buttonStyle}>
                            POST
                        </button>
                    </div>
                </form>

                <h1>Clear Notifications</h1>
                <button onClick={handleClearNotification} style={NotificationStyle.clearButton}>
                    CLEAR ALL NOTIFICATIONS
                </button>
            </div>
            <NavBar />
        </div>
    )
}

export default NotificationPage;

const NotificationStyle = {
    formStyle: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "70%",
        width: "100%",
    },
    buttonWrapper: {
        display: "flex",
        flexDirection: "row-reverse",
        alignContent: "flex-end",
    },
    buttonStyle: {
        backgroundColor: "red",
        color: "white",
        margin: "8px 8px",
        border: "none",
        width: "100%",
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
    },
    clearContainer: {
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "center",
    },
    clearButton: {
        width: "60%",
        backgroundColor: "red",
        color: "white",
        margin: "8px 8px",
        border: "none",
        borderRadius: "16px",
    }
}