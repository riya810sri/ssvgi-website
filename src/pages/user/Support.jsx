import React from 'react';

import { useAuth } from '../../context/AuthContext';
import { createTicket, getUserTickets } from '../../utils/api-tickets';

export default function Support() {
  const { token } = useAuth();
  const [tickets, setTickets] = React.useState([]);
  const [showForm, setShowForm] = React.useState(false);
  const [formData, setFormData] = React.useState({
    subject: '',
    message: '',
    priority: 'normal'
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getUserTickets(token);
        setTickets(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newTicket = await createTicket(formData, token);
      setTickets(prev => [newTicket, ...prev]);
      setShowForm(false);
      setFormData({ subject: '', message: '', priority: 'normal' });
    } catch (err) {
      alert(err.message || 'Failed to create ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Support</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          New Ticket
        </button>
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded shadow p-4 mb-4">
        <h3 className="font-medium mb-2">Contact Information</h3>
        <p className="text-gray-700">If you need immediate help, please contact the administration:</p>
        <ul className="mt-3 text-sm text-gray-600 space-y-1">
          <li>Phone: +91-8954544644</li>
          <li>Email: admissions@tesmento.com</li>
          <li>Office hours: Mon-Fri 10:00 - 17:00</li>
        </ul>
      </div>

      {/* Ticket Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Create Support Ticket</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-500">Close</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-1">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-1">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  rows={4}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-1">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tickets List */}
      <div className="bg-white rounded shadow">
        <div className="p-4 border-b">
          <h3 className="font-medium">Your Support Tickets</h3>
        </div>
        {loading ? (
          <div className="p-4 text-gray-500">Loading tickets...</div>
        ) : error ? (
          <div className="p-4 text-red-500">Error: {error}</div>
        ) : tickets.length === 0 ? (
          <div className="p-4 text-gray-500">No support tickets yet.</div>
        ) : (
          <div className="divide-y">
            {tickets.map(ticket => (
              <div key={ticket.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{ticket.subject}</div>
                  <div className="text-sm text-gray-500">
                    Created: {new Date(ticket.created).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 text-xs rounded ${
                    ticket.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {ticket.status.toUpperCase()}
                  </span>
                  <button className="px-3 py-1 border rounded text-sm">View</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
