import { apiCall } from './api';

// Ticket API endpoints
export const createTicket = async (formData, token) => {
  return apiCall('/tickets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(formData)
  });
};

export const getUserTickets = async (token) => {
  return apiCall('/tickets', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const getTicketDetails = async (ticketId, token) => {
  return apiCall(`/tickets/${ticketId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const addTicketComment = async (ticketId, comment, token) => {
  return apiCall(`/tickets/${ticketId}/comments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ message: comment })
  });
};

export const closeTicket = async (ticketId, token) => {
  return apiCall(`/tickets/${ticketId}/close`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};