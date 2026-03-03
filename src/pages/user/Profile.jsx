import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [saving, setSaving] = React.useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // TODO: Wire to API when profile update endpoint is ready
      await new Promise(r => setTimeout(r, 800)); // Simulate API call
      setIsEditing(false);
    } catch (err) {
      alert(err.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Profile</h2>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="px-3 py-1 bg-blue-600 text-white rounded">
            Edit Profile
          </button>
        )}
      </div>
      
      <div className="bg-white rounded shadow p-4 max-w-md">
        {!isEditing ? (
          <>
            <div className="mb-3">
              <span className="text-sm text-gray-500">Name</span>
              <div className="font-medium">{user?.name || 'Guest'}</div>
            </div>
            <div className="mb-3">
              <span className="text-sm text-gray-500">Email</span>
              <div className="font-medium">{user?.email || '—'}</div>
            </div>
            <div className="mb-3">
              <span className="text-sm text-gray-500">Phone</span>
              <div className="font-medium">{user?.phone || '—'}</div>
            </div>
            <div className="mb-3">
              <span className="text-sm text-gray-500">Address</span>
              <div className="font-medium">{user?.address || '—'}</div>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm text-gray-500 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-500 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-500 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-500 mb-1">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                rows={3}
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
