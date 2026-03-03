import React from 'react';

export default function ChecklistItem({ text }) {
  return (
    <div className="flex items-start space-x-2">
      <svg className="flex-shrink-0 h-6 w-6 text-purple-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="text-gray-700 font-medium">{text}</span>
    </div>
  );
}
