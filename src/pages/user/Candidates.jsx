import React from 'react';

export default function Candidates() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Candidates</h2>
      <div className="bg-white rounded shadow p-4">
        <p className="text-gray-700">Candidate list and profiles will be shown here.</p>
        <div className="mt-4 text-sm text-gray-500">Placeholder: no candidates found.</div>
      </div>
    </div>
  );
}
