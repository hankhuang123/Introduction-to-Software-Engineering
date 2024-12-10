import React from 'react';
import ListButton from '../navComponents/ListButton';
import NavBar from '../navComponents/NavBar';
import BackButton from '../navComponents/BackButton';
import { useHistory } from 'react-router-dom';

const SettingsPage = () => {
    const history = useHistory();

    const handleLogout = () => {
        localStorage.setItem('userToken', '');
        localStorage.setItem('username', '');
        localStorage.setItem('isAdmin', false);
        localStorage.setItem('isBusinessOwner', false);
        history.push(`/`);
    };

    let buttons = [
        { name: "Logout", handleClick: handleLogout },
        { name: "My Profile", handleClick: () => {} },
        { name: "Location Permissions", handleClick: () => {} },
        { name: "Privacy Policy", handleClick: () => {} }
    ];
    const isBusinessOwner = localStorage.getItem('isBusinessOwner');
    const isAdmin = localStorage.getItem('isAdmin');
    if (isBusinessOwner === "true") {
        buttons.push({ name: "View My Business", handleClick: () => history.push("/business/modify") });
    } else if (isAdmin === "false") {
        buttons.push({ name: "Create A Business", handleClick: () => history.push("/business/register") });
    }

    return (
        <div className='content-container'>
            <div style={AdminManagementStyle.formStyle}>
                <BackButton />
                <div>
                    <div className='home-header'>Settings</div>
                    <div style={AdminManagementStyle.buttonsContainer}>
                        {buttons.map(ListButton, this)}
                    </div>
                </div>
                <NavBar />
            </div>
        </div>
    );
};

export default SettingsPage;

const AdminManagementStyle = {
    formStyle: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        width: "100%",
        height: "100%",
    },
    buttonsContainer: {
        display: "flex",
        flexDirection: "column"
    }
}