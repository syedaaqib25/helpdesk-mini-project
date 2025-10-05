import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api/api';

const NewTicketPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    try {
      await api.createTicket({ title, description });
      navigate('/tickets');
    } catch (err) {
      console.error('Failed to create ticket', err);
      setError('Could not create the ticket. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-header">
          <h2>Submit a New Ticket</h2>
          <p>Please describe your issue in detail</p>
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input 
            id="title" 
            type="text" 
            placeholder="e.g., Cannot access my account" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea 
            id="description" 
            placeholder="Please provide as much detail as possible..." 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            required 
          />
        </div>

        <button type="submit" className="btn">Submit Ticket</button>
      </form>
    </div>
  );
};

export default NewTicketPage;