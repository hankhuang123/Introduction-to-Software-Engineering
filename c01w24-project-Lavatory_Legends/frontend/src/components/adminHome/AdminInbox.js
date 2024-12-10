import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import NavBar from '../navComponents/NavBar';
import { LOCALHOST } from '../../Constants';

const AdminInbox = () => {
  const [requests, setRequests] = useState([]);
  const [washroomsWithIssues, setWashroomsWithIssues] = useState([]);
  let history = useHistory(); // For redirecting to the detailed view

  useEffect(() => {
    fetchPendingWashrooms();
    fetchPendingIssues();
  }, []);

  const fetchPendingWashrooms = async () => {
    try {
      const response = await fetch(`${LOCALHOST}/admin/washrooms/pendingWashrooms`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching pending washrooms:', error);
    }
  };

  const fetchPendingIssues = async () => {
    try {
      const response = await fetch(`${LOCALHOST}/admin/washrooms/pendingIssues`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const washrooms = await response.json();
      setWashroomsWithIssues(washrooms);
    } catch (error) {
      console.error('Error fetching pending issues:', error);
    }
  };

  const goToRequest = (requestId) => {
    // Pushes a new entry onto the history stack, which navigates to the request approval page
    history.push(`/request/${requestId}`);
  };

  const goToIssue = (washroomId, issueId) => {
    history.push(`/issue/${washroomId}/${issueId}`);
  };

  return (
    <div className="App">
      <div className='home-page'>
        <div className='home-header'>Inbox</div>
        <div className='home-footnotes'>User's request for updating washroom's information.</div>
        {requests.length > 0 && (
          <div className="request-list">
            {requests.map((request) => (
              <div
                className="request-item"
                key={request._id}
                onClick={() => goToRequest(request._id)}
                >
                <header>New Washroom Request</header>
                <info>{request.location}</info>
              </div>
            ))}
          </div>
        )}
        {washroomsWithIssues.length > 0 && (
          <div className="request-list">
            {washroomsWithIssues.map((washroom) => (
              washroom.issues.map((issue) => (
                <div
                  className="request-item"
                  key={issue._id}
                  onClick={() => goToIssue(washroom._id, issue._id)}
                  >
                  <header>Reported Issues</header>
                  <info>{washroom.location}</info>
                </div>
                ))
            ))}
          </div>
        )}
        {requests.length === 0 && washroomsWithIssues.length === 0 && (
            <p className="no-request-error">No pending requests or issues.</p>
        )}
        <NavBar/>
      </div>
    </div>
  );
};

export default AdminInbox;
