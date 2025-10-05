import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../api/api';

const TicketsListPage = () => {
  const [tickets, setTickets] = useState([]);
  
  useEffect(() => {
    const getTickets = async () => {
      try {
        const { data } = await api.fetchTickets();
        setTickets(data.tickets);
      } catch (error) {
        console.error(error);
      }
    };
    getTickets();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>My Tickets</h1>
        <Link to="/tickets/new" className="btn">Create New Ticket</Link>
      </div>
      <div className="ticket-grid">
        {tickets.length > 0 ? tickets.map(ticket => (
          <Link to={`/tickets/${ticket.id}`} key={ticket.id} className="ticket-card">
            <h3>{ticket.title}</h3>
            <div className="ticket-card-meta">
              <p>Status: 
                <span className={`status-badge status-${ticket.status}`}>
                  {ticket.status.replace('_', ' ')}
                </span>
              </p>
              <p>Created: {new Date(ticket.createdAt).toLocaleDateString()}</p>
            </div>
          </Link>
        )) : (
          <p>You have not created any tickets yet.</p>
        )}
      </div>
    </div>
  );
};

export default TicketsListPage;