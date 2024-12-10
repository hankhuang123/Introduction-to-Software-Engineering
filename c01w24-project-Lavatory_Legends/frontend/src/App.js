import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Openpage from "./components/openpage/Openpage";
import UserLogin from "./components/userLogin/UserLogin";
import UserRegister from "./components/userRegister/UserRegister";
import BusinessRegister from "./components/businessRegister/BusinessRegister.js";
import BusinessModify from "./components/businessModify/BusinessModify.js";
import Homepage from "./components/homepage/Homepage";
import MapPage from "./components/homepage/MapPage";
import NewAdmin from "./components/adminPage/NewAdminPage";
import AdminManagement from './components/adminPage/AdminManagePage.js';
import AdminInbox from './components/adminHome/AdminInbox';
import RequestApproval from './components/adminHome/RequestApprovalPage';
import Reportwashroom from "./components/washroomPage/ReportWashroom.js";
import WashroomForm from "./components/washroomPage/WashroomForm.js"
import NotificationPage from './components/adminPage/NotificationPage.js';
import SettingsPage from './components/settingsPage/SettingsPage.js';
import WashroomInfo from './components/washroomPage/WashroomInfo.js';
import IssueApproval from './components/adminHome/IssueApprovalPage.js';
import AboutPage from './components/aboutPage/AboutPage.js';
import DonationPage from "./components/donatepage/DonatePage.js";
import CompletionPage from "./components/donatepage/ThankYou.js";
import SponsorPage from "./components/adminPage/SponsorPage.js";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Openpage} />
          <Route path="/user/login" component={UserLogin} />
          <Route path="/user/register" component={UserRegister} />
          <Route path="/business/register" component={BusinessRegister} />
          <Route path="/business/modify" component={BusinessModify} />
          <Route path="/home" component={Homepage} />
          <Route path="/map" component={MapPage} />
          <Route path="/admin/management" component={AdminManagement} />
          <Route path="/washroominfo/:washroomId" component={WashroomInfo} />
          <Route path="/admin/register" component={NewAdmin} />
          <Route path="/admin/postNotification" component={NotificationPage} />
          <Route path="/admin/home/inbox" component={AdminInbox} />
          <Route path="/request/:requestId" component={RequestApproval} />
          <Route path="/issue/:washroomId/:issueId" component={IssueApproval} />
          <Route path="/reportIssue/:washroomId" component={Reportwashroom} />
          <Route path="/washroomform" component={WashroomForm} />
          <Route path="/donate" component={DonationPage} />
          <Route path="/completion" component={CompletionPage} />
          <Route path="/settings" component={SettingsPage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/sponsors" component={SponsorPage} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
