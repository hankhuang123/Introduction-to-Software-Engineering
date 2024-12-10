import React from 'react';
import { useHistory } from 'react-router-dom';
import ListButton from '../navComponents/ListButton';
import NavBar from '../navComponents/NavBar';
import BackButton from '../navComponents/BackButton';

const AdminManagement = () => {
    let history = useHistory();
    let buttons = [
        { name: "Notifications", handleClick: () => history.push('/admin/postNotification') },
        { name: "Add Administrators", handleClick: () => history.push('/admin/register') },
        { name: "Sponsors", handleClick: () => history.push('/sponsors') }
    ];
    const footnotes = 'Post notifications and add other administrators.';

    return (
        <div className='content-container'>
            <div style={AdminManagementStyle.formStyle}>
                <BackButton />
                <div>
                    <div className='home-header'>Management</div>
                    <div className='home-footnotes'>{footnotes}</div>
                    <div style={AdminManagementStyle.buttonsContainer}>
                        {buttons.map(ListButton, this)}
                    </div>
                </div>
                <NavBar />
            </div>
        </div>
    );
};

export default AdminManagement;

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