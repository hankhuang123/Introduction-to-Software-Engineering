import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import mapMarker from '../../res/image/map-marker-2.svg'
import clock from '../../res/image/clock-time.svg'
import reports from '../../res/image/reports.svg'
import ok from '../../res/image/ok.svg'
import cross from '../../res/image/cross.svg'
import BackButton from '../navComponents/BackButton';
import NavBar from '../navComponents/NavBar';
import { LOCALHOST } from '../../Constants';

const RequestApproval = () => {
  const [requestDetails, setRequestDetails] = useState(null);
  const { requestId } = useParams(); // Get the request ID from URL params
  let history = useHistory(); // For redirecting after action

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        const response = await axios.get(`${LOCALHOST}/admin/washrooms/${requestId}`);
        setRequestDetails(response.data);
      } catch (error) {
        console.error('Error fetching request details:', error);
      }
    };

    fetchRequestDetails();
  }, [requestId]);

  const handleApprove = async () => {
    try {
      const response = await axios.patch(`${LOCALHOST}/admin/washrooms/approveWashroom/${requestId}`);
      console.log(response.data.message); // Log the response message
      history.goBack(); // Redirects to the previous page
    } catch (error) {
      console.error('Error approving washroom:', error);
    }
  };
  
  const handleDeny = async () => {
    try {
      const response = await axios.patch(`${LOCALHOST}/admin/washrooms/denyWashroom/${requestId}`);
      console.log(response.data.message); // Log the response message
      history.goBack(); // Redirects to the previous page
    } catch (error) {
      console.error('Error denying washroom:', error);
    }
  };

  return (
    <div className="home-page">
      <BackButton/>
      <div className='home-header'>Request</div>
      <div className='home-footnotes'>User's request for submitting new washroom.</div>
      {requestDetails ? (
        <div className="approval-form">
          <header>
            <img src={mapMarker} width={15} height={15} alt='location'/>
            Location
          </header>
          <p>{requestDetails.location}</p>
          <header>
            <img src={clock} width={15} height={15} alt='opening schedule'/>
            Opening Schedule
          </header>
          <ul className='open-schedule'>
            {requestDetails.openingSchedule && Object.entries(requestDetails.openingSchedule).map(([day, { open, close }]) => (
                <li key={day}><span>{day}</span> <span className="hours">{open} - {close}</span></li>
            ))}
          </ul>
          <header>
            <img src={reports} width={15} height={15} alt='additional info'/>
            Additional Information
          </header>
          <p>{requestDetails.additionalInfo}</p>
          <div className='left-right-bottons'>
            <button className="btn-left" onClick={handleApprove}>
                <img src={ok} width={20} height={20} alt='Approve'/>
                Approve
            </button>
            <button className="btn-right" onClick={handleDeny}>
                <img src={cross} width={20} height={20} alt='Deny'/>
                Deny
            </button>
          </div>
        </div>
      ) : (
        <p className="no-request-error">No information found.</p>
      )}

      <NavBar/>
    </div>
  );
};

export default RequestApproval;
