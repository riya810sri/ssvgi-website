import React from 'react';

export default function SignUp() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-blue-800">Registration Disabled</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Contact administrator to create an account</p>
        </div>

        <div className="bg-white rounded-xl shadow p-8 text-center">
          <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
            User registration is currently disabled. Please contact the system administrator to create an account.
          </div>

          <div className="mt-4 text-sm text-center">
            <a href="/login" className="text-indigo-600 hover:underline">Already have an account? Sign in</a>
          </div>
        </div>
      </div>
    </div>
  );
}
