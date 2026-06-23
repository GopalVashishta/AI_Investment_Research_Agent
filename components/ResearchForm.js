import React, { useState } from 'react';

function ResearchForm({ onSubmit, isLoading }) {
  const [companyName, setCompanyName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (companyName.trim()) {
      onSubmit(companyName);
      // setCompanyName(''); // Clear input after submission, or keep for easy re-runs
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Investigate Company</h2>
      <div className="mb-4">
        <label htmlFor="company" className="block text-gray-700 text-sm font-bold mb-2">
          Company Name:
        </label>
        <input
          type="text"
          id="company"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="e.g., Apple Inc."
          required
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={isLoading}
      >
        {isLoading ? 'Researching...' : 'Start Research'}
      </button>
    </form>
  );
}

export default ResearchForm;