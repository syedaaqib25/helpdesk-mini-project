import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as api from '../api/api';
import { useAuth } from '../contexts/AuthContext';

const TicketDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const fetchTicket = async () => {
    try {
      const { data } = await api.fetchTicketById(id);
      setTicket(data);
      setError('');
    } catch (error) {
      console.error('Failed to fetch ticket', error);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.addComment(id, { text: comment });
      setComment('');
      fetchTicket(); // Refetch to show new comment
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
        await api.updateTicket(id, { status: newStatus, version: ticket.version });
        fetchTicket(); // Refetch to show updated status and version
    } catch (err) {
        if (err.response && err.response.status === 409) {
            setError('Conflict: This ticket was updated by someone else. Refreshing...');
            setTimeout(() => fetchTicket(), 2000);
        } else {
            setError('Failed to update status.');
        }
    }
  }

  if (!ticket) return <div>Loading...</div>;

  return (
    <div className="card ticket-detail-card">
      {error && <p style={{color: 'red'}}>{error}</p>}
      
      <div className="page-header">
         <h2>{ticket.title}</h2>
         <span className={`status-badge status-${ticket.status}`}>{ticket.status.replace('_', ' ')}</span>
      </div>

      <p><strong>Created by:</strong> {ticket.creator.name} on {new Date(ticket.createdAt).toLocaleString()}</p>
      <p><strong>SLA Deadline:</strong> {new Date(ticket.slaDeadline).toLocaleString()}</p>
      <hr/>
      <p>{ticket.description}</p>
      
      {user.role !== 'USER' && (
        <div style={{ margin: '1rem 0', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <h4>Admin/Agent Actions</h4>
            {/* Show this button only if the ticket is not already resolved */}
            {ticket.status !== 'RESOLVED' && (
              <button 
                onClick={() => handleStatusChange('RESOLVED')} 
                className="btn" 
                style={{ width: 'auto', padding: '0.5rem 1rem', backgroundColor: 'var(--success-color)' }}
              >
                Mark as Resolved
              </button>
            )}
             {ticket.status === 'RESOLVED' && (
                <p>This ticket has been resolved.</p>
             )}
        </div>
      )}

      <div className="comment-section">
        <h3>Comments</h3>
        {ticket.comments.map(c => (
          <div key={c.id} className="comment">
            <p><strong>{c.author.name} ({c.author.role}):</strong></p>
            <p>{c.text}</p>
          </div>
        ))}

        <form onSubmit={handleCommentSubmit} className="form-container" style={{boxShadow: 'none', padding: '1rem 0', margin: '1rem 0'}}>
          <div className="form-group">
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment..."/>
          </div>
          <button type="submit" className="btn" style={{width: 'auto', padding: '0.5rem 1rem'}}>Add Comment</button>
        </form>
      </div>

       <div className="comment-section">
         <h3>Timeline</h3>
         <ul>
             {ticket.timeline.map((event, index) => (
                 <li key={index} style={{ marginBottom: '0.5rem' }}>
                     {new Date(event.timestamp).toLocaleString()} - <strong>{event.actor}</strong>: {event.details}
                 </li>
             ))}
         </ul>
       </div>
    </div>
  );
};

export default TicketDetailPage;