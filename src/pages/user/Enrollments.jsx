import React, { useEffect, useState } from 'react';
import UserEnrollmentCard from '../../components/UserEnrollmentCard';
import { useAuth } from '../../context/AuthContext';
import { getMyEnrollments } from '../../utils/api';

export default function Enrollments() {
  const { token } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      if (!token) return setLoading(false);
      try {
        setLoading(true);
        const res = await getMyEnrollments(token);
        setEnrollments(res.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load enrollments');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [token]);

  const update = (updated) => {
    const next = enrollments.map(e => (String(e._id || e.id) === String(updated._id || updated.id) ? updated : e));
    setEnrollments(next);
  };

  if (loading) return <div className="p-6 bg-white rounded shadow">Loading enrollments…</div>;
  if (error) return <div className="p-6 bg-white rounded shadow text-red-600">{error}</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Your Enrollments</h2>
      {enrollments.length === 0 ? (
        <div className="p-6 bg-white rounded shadow text-gray-500">No enrollments yet.</div>
      ) : (
        <div className="space-y-4">
          {enrollments.map(en => (
            <UserEnrollmentCard key={en._id || en.id} enrollment={en} onUpdate={update} token={token} />
          ))}
        </div>
      )}
    </div>
  );
}
