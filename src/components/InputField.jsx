import React from 'react';

export default function InputField({ label, type, placeholder }) {
  return (
    <div>
      <label htmlFor={label} className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <input
        type={type}
        id={label}
        name={label}
        placeholder={placeholder}
        className="block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      />
    </div>
  );
}
