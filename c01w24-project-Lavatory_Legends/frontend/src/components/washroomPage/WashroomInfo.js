import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import mapMarker from '../../res/image/map-marker.svg'
import phone from '../../res/image/phone.svg'
import report from '../../res/image/reports.svg'
import BackButton from '../navComponents/BackButton';
import NavBar from '../navComponents/NavBar';
import { LOCALHOST } from '../../Constants';

const WashroomInfo = () => {
  const [requestDetails, setRequestDetails] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [commentText, setCommentText] = useState('');
  const { washroomId } = useParams(); // Get the request ID from URL params
  const currentUserName = localStorage.getItem('username'); // Get current user name
  let history = useHistory(); // For redirecting after action

  useEffect(() => {
    fetchRequestDetails();
    localStorage.setItem('washroomId', washroomId);
  }, [washroomId]);

  const fetchRequestDetails = async () => {
    try {
      const response = await axios.get(`${LOCALHOST}/admin/washrooms/${washroomId}`);
      setRequestDetails(response.data);
    } catch (error) {
      console.error('Error fetching request details:', error);
    }
  };

  const handleCommentClick = (comment) => {
    setSelectedComment(comment);
    setShowDetailModal(true);
  };

  const postComment = async () => {
    try {
      const token = localStorage.getItem('userToken');
      console.log(`Token: ${token}`); // Add this line to debug
      await axios.post(`${LOCALHOST}/post/postComment/${washroomId}`, { commentText }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCommentText('');
      setShowPostModal(false);
      fetchRequestDetails(); // Refresh comments after posting
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.delete(`${LOCALHOST}/post/deleteComment/${washroomId}/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setShowDetailModal(false); // Close the detail modal
      fetchRequestDetails(); // Refresh comments after deletion
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };
  
  const handleReport = async () => {
    try {
        history.push(`/reportIssue/${washroomId}`);
    } catch (error) {
        console.error('Error denying washroom:', error);
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2); // months are 0-based
    const day = (`0${date.getDate()}`).slice(-2);
    const hour = (`0${date.getHours()}`).slice(-2);
    const minute = (`0${date.getMinutes()}`).slice(-2);
  
    return `${year}-${month}-${day} ${hour}:${minute}`;
  };

  return (
    <div className="home-page">
      <BackButton/>
      {requestDetails ? (
        <div className='home-header'>{requestDetails.location}</div>
      ) : (
        <div className='home-header'>Get location error.</div>
      )}
      {requestDetails ? (
        <div className='washroom-info'>
          <div className='save-button'> <img src={mapMarker} width={15} height={12} alt='save'/> SAVE</div>
          <ul className='open-schedule'>
            {requestDetails.openingSchedule && Object.entries(requestDetails.openingSchedule).map(([day, { open, close }]) => (
              <li key={day}><span className="day">{day}</span> <span className="hours">{open} - {close}</span></li>
            ))}
          </ul>
          <div className='left-right-bottons'>
            <button className="btn-left" onClick={() => setShowPostModal(true)}>
              <img src={phone} width={20} height={20} alt='comment'/>
              Comment
            </button>
            <button className="btn-right" onClick={handleReport}>
              <img src={report} width={20} height={20} alt='report'/>
              Report
            </button>
          </div>
          <div className='small-header'>Comments</div>
          <div className='request-list'>
            {requestDetails.comments ? (
              requestDetails.comments.map((comment) => (
                <div key={comment._id} className="request-item" onClick={() => handleCommentClick(comment)}>
                  {comment.text.length > 67 ? `${comment.text.substring(0, 67)}...` : comment.text}
                </div>
              ))
            ) : null }
          </div>
          {showDetailModal && (
            <div className="modal" onClick={() => setShowDetailModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <span className="close" onClick={() => setShowDetailModal(false)}>&times;</span>
                <h3>{selectedComment?.username}</h3>
                <div className='footnotes'>{formatDate(selectedComment?.timestamp)}</div>
                <p>{selectedComment?.text}</p>
                {/* Conditionally render the Delete button */}
                {selectedComment?.username === currentUserName && (
                  <button onClick={() => {setShowDeleteConfirm(true); setShowDetailModal(false);}}>Delete Comment</button>
                )}
              </div>
            </div>
          )}

          {/* Confirmation modal for deletion */}
          {showDeleteConfirm && (
            <div className="modal" onClick={() => setShowDeleteConfirm(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Are you sure you want to delete this comment?</h3>
                <div className='left-right-bottons'>
                  <button className="btn-left" onClick={() => {deleteComment(selectedComment?._id); setShowDeleteConfirm(false);}}>
                      Yes, Delete It.
                    </button>
                    <button className="btn-right" onClick={() => setShowDeleteConfirm(false)}>
                      No, Go Back.
                    </button>
                  </div>
                </div>
            </div>
          )}

          {showPostModal && (
            <div className="modal" onClick={() => setShowPostModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <span className="close" onClick={() => setShowPostModal(false)}>&times;</span>
                <h3>Post a Comment</h3>
                <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)}></textarea>
                <button onClick={postComment}>Submit</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="no-request-error">No information found.</p>
      )}
        
        
      <NavBar/>
    </div>
  );
};

export default WashroomInfo;