import React from 'react'
import { useHistory } from 'react-router-dom'
import magnifier from '../../res/image/magnifier.svg'
import mailUpload from '../../res/image/mail-upload.svg'
import setting from '../../res/image/setting.svg'
import manageImg from '../../res/image/add-user.svg'
import lightbulbImb from '../../res/image/light-bulb.svg'

const NavBar = () => {
    const history = useHistory();

    let navBarInboxInfo;
    let navBarManageInfo;
    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin === "true") {
        navBarInboxInfo = {
            name: "Inbox",
            onClick: () => history.push('/admin/home/inbox')
        };

        navBarManageInfo = {
            name: "Manage",
            srcImage: manageImg,
            onClick: () => history.push('/admin/management')
        };
    } else {
        navBarInboxInfo = {
            name: "Submit",
            onClick: () => history.push('/washroomform')
        };

        navBarManageInfo = {
            name: "Info",
            srcImage: lightbulbImb,
            onClick: () => history.push('/about')
        };
    }

    return (
        <div className="footer-buttons">
            <button className="footer-button" onClick={() => history.push('/map')}>
                < img src={magnifier} alt="Explore" className="button-icon" />
                Explore
            </button>

            <button className="footer-button" onClick={navBarInboxInfo.onClick}>
                < img src={mailUpload} alt="Inbox" className="button-icon" />
                {navBarInboxInfo.name}
            </button>

            <button className="footer-button" onClick={navBarManageInfo.onClick}>
                < img src={navBarManageInfo.srcImage} alt="Inbox" className="button-icon" />
                {navBarManageInfo.name}
            </button>
            
            <button className="footer-button" onClick={() => history.push("/settings")}> 
                < img src={setting} alt="Settings" className="button-icon" />
                Settings
            </button>
        </div>
    );
}

export default NavBar;
