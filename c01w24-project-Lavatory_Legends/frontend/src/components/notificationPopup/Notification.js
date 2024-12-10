import React, { useEffect, useState } from "react";
import Popup from 'reactjs-popup';
import { LOCALHOST } from "../../Constants";

const checkHasNotification = async () => {
    const currToken = localStorage.getItem('userToken');
    let hasNotification = false;

    try {
        await fetch(`${LOCALHOST}/notification/hasNotification`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${currToken}`
            }
        }).then(async (response) => {
            if (!response.ok) {
                console.log("Unable to check notification DB:", response.status);
                hasNotification = false;
            } else {
                await response.json().then((data) => {
                    hasNotification = data.value;
                });
            };
        });

        return hasNotification;
    } catch (error) {
        console.error(`Get notification failed: `, error);
    }
};

const NotificationPopup = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [postedDate, setPostedDate] = useState(new Date());

    useEffect(() => {
        const getNotification = async () => {
            const currToken = localStorage.getItem('userToken');
    
            try {
                await fetch(`${LOCALHOST}/notification/latestNotification`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${currToken}`
                    }
                }).then(async (response) => {
                    if (!response.ok) {
                    console.log("Served failed:", response.status);
                    } else {
                    await response.json().then(async (data) => {
                        if (!data || !data.response){
                            console.log("Unable to retrieve notification data");
                            return;
                        }
                        const postedDate = new Date(data.response[0].postedDate).toUTCString();

                        setTitle(data.response[0].title);
                        setContent(data.response[0].content);
                        setPostedDate(postedDate);
                    })};
                });
            } catch (error) {
                console.error("Error when getting notification:", error);
            }
        };

        getNotification();
    }, []);

    return (
        <div>
            <Popup 
                trigger={ <button style={ NotificationStyle.buttonStyle }> Notification </button> }
                modal
                nested
                style={NotificationStyle.modal}
            >
                {close => (
                    <div style={NotificationStyle.popupStyle}>
                        <p>{ postedDate.toString() }</p>
                        <h1>{title}</h1>
                        <p>{content}</p>
                
                        <button onClick={() => close()} style={NotificationStyle.closeButton}>
                            Close Notification
                        </button>
                    </div>
                )}
            </Popup>    
        </div>
    );
}

export { NotificationPopup, checkHasNotification };

const NotificationStyle = {
    buttonStyle: {
        position: "absolute",
        top: "8px",
        left: "8px",
        backgroundColor: "red",
        color: "white",
        margin: "8px 8px",
        border: "none",
        width: "25%",
        borderRadius: "16px",
        zIndex: "100"
    },
    closeButton: {
        backgroundColor: "red",
        color: "white",
        margin: "8px 8px",
        border: "none",
        borderRadius: "16px"
    },
    popupStyle: {
        backgroundColor: "white",
        maxHeight: "80%",
        maxWidth: "100%",
        padding: "20px",
        display: "flex",
        flexDirection:"column",
        justifyContent: "center",
        alignItems: "center"
    },
    modal: {
        display: "flex",
        flexDirection:"column",
        justifyContent: "center",
        alignItems: "center"
    }
};