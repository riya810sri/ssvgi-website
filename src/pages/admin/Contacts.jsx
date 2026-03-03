import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getContacts } from '../../utils/api';

export default function Contacts() {
  const { token } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchContacts = useCallback(async () => {
    try {
      const queryParams = {};
      if (filter !== 'all') queryParams.status = filter;

      const response = await getContacts(token, queryParams);
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  }, [filter, token]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'read': return 'bg-yellow-100 text-yellow-800';
      case 'replied': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Contact Messages</h1>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Messages</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {contacts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
            No messages found
          </div>
        ) : (
          contacts.map((contact) => (
            <div key={contact._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{contact.name}</h3>
                  <p className="text-sm text-gray-500">{contact.email}</p>
                  {contact.phone && <p className="text-sm text-gray-500">{contact.phone}</p>}
                </div>
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(contact.status)}`}>
                  {contact.status}
                </span>
              </div>
              <div className="mb-2">
                <h4 className="text-sm font-semibold text-gray-700 mb-1">Subject: {contact.subject}</h4>
                <p className="text-gray-600">{contact.message}</p>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500 mt-4">
                <span>Received: {new Date(contact.submittedAt).toLocaleString()}</span>
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                  Reply
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
