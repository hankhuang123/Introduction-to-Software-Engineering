import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import mapMarker from '../../res/image/map-marker-2.svg';
import clock from '../../res/image/clock-time.svg';
import reports from '../../res/image/reports.svg'
import ok from '../../res/image/ok.svg'
import cross from '../../res/image/cross.svg'
import NavBar from '../navComponents/NavBar';
import BackButton from '../navComponents/BackButton';
import { LOCALHOST } from '../../Constants';

const IssueApprovalPage = () => {
  const [washroomDetails, setWashroomDetails] = useState(null);
  const [issueDetails, setIssueDetails] = useState(null);
  const { washroomId, issueId } = useParams();
  let history = useHistory();

  useEffect(() => {
    const fetchWashroomDetails = async () => {
        try {
        const response = await axios.get(`${LOCALHOST}/admin/washrooms/${washroomId}`);
        setWashroomDetails(response.data);
        const issue = response.data.issues.find(issue => issue._id === issueId);
        setIssueDetails(issue);
        } catch (error) {
        console.error('Error fetching washroom details:', error);
        }
    };

    fetchWashroomDetails();
  }, [washroomId, issueId]);

  const handleApprove = async () => {
    try {
      await axios.patch(`${LOCALHOST}/admin/washrooms/approveIssue/${washroomId}/${issueId}`);
      history.goBack();
    } catch (error) {
      console.error('Error approving issue:', error);
    }
  };

  const handleDeny = async () => {
    try {
      await axios.patch(`${LOCALHOST}/admin/washrooms/denyIssue/${washroomId}/${issueId}`);
      history.goBack();
    } catch (error) {
      console.error('Error denying issue:', error);
    }
  };

  return (
    <div className="home-page">
      <BackButton />
      <div className='home-header'>Issue Details</div>
      <div className='home-footnotes'>Review and take action on the reported issue.</div>
      {issueDetails ? (
        <div className="approval-form">
          {/* Original and Updated Location */}
          {issueDetails['Location Wrong'] && (
            <>
              <header>
                <img src={mapMarker} width={15} height={15} alt="Location"/>
                Original Location
              </header>
              <p>{washroomDetails.location}</p>
              <header>
                <img src={mapMarker} width={15} height={15} alt="New Location"/>
                Proposed Location
              </header>
              <p>{issueDetails['Location Wrong']}</p>
            </>
          )}

          {/* Original and Updated Opening Schedule */}
          {issueDetails['Opening Schedule Wrong'] && (
            <>
              <header>
                <img src={clock} width={15} height={15} alt="Opening Schedule"/>
                Original Opening Schedule
              </header>
              <ul>
                {washroomDetails.openingSchedule && Object.entries(washroomDetails.openingSchedule).map(([day, { open, close }]) => (
                  <li key={day}><span>{day}</span> <span className="hours">{open} - {close}</span></li>
                ))}
              </ul>
              <header>
                <img src={clock} width={15} height={15} alt="Proposed Opening Schedule"/>
                Proposed Opening Schedule
              </header>
              <ul>
                {issueDetails['Opening Schedule Wrong'] && Object.entries(issueDetails['Opening Schedule Wrong']).map(([day, { open, close }]) => (
                  <li key={day}><span>{day}</span> <span className="hours">{open} - {close}</span></li>
                ))}
              </ul>
            </>
          )}

        {issueDetails['Other Issue'] && (
            <>
              <header>
                <img src={reports} width={15} height={15} alt="Other issue"/>
                Other Issues
              </header>
              <p>{issueDetails['Other Issue']}</p>
            </>
          )}

          <div className='left-right-buttons'>
            <button className="btn-left" onClick={handleApprove}>
                <img src={ok} width={20} height={20} alt="Approve"/>
                Approve
            </button>
            <button className="btn-right" onClick={handleDeny}>
                <img src={cross} width={20} height={20} alt="Deny" />
                Deny
            </button>
          </div>
        </div>
      ) : (
        <p className="no-request-error">No information found.</p>
      )}
      <NavBar />
    </div>
  );
};

export default IssueApprovalPage;

