import React, { useState } from 'react';

function App() {
  const [question, setQuestion] = useState('');
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // IMPORTANT: Replace this with your actual API endpoint
  // This is a placeholder for demonstration purposes.
  // For a real API, this endpoint would receive the question and return a relevant response.
  const API_ENDPOINT = 'http://localhost:8080/api/gemini/generate'; // Example: a mock API that accepts POST requests

  const handleAsk = async () => {
    setLoading(true);
    setApiResponse(null);
    setError(null);

    if (!question.trim()) {
      setError('Please enter a question.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(API_ENDPOINT, {
        method: 'POST', // Use POST method to send data
        headers: {
          'Content-Type': 'application/json',
          // Add any other headers your API might require, e.g., Authorization tokens
        },
        body: JSON.stringify({
          question: question,
          // You can add other parameters here if your API expects them
        }),
      });

      if (!res.ok) {
        // Attempt to read error message from response if available
        const errorText = await res.text();
        throw new Error(`HTTP error! Status: ${res.status}. Response: ${errorText}`);
      }

      const data = await res.text(); // Expecting JSON response     
      
      setApiResponse(data);
    } catch (err) {
      console.error("API call error:", err);
      setError(`Failed to get response from API: ${err.message}. Please check the API endpoint and ensure it's configured correctly.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Question API Caller</h1>

        <div className="mb-6">
          <label htmlFor="question-input" className="block text-gray-700 text-sm font-semibold mb-2">
            Enter your question:
          </label>
          <input
            type="text"
            id="question-input"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="e.g., What is the capital of France?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>

        <button
          onClick={handleAsk}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md shadow-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || !question.trim()}
        >
          {loading ? 'Asking API...' : 'Ask API'}
        </button>

        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {apiResponse && (
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md shadow-inner max-h-96 overflow-auto">
            <h2 className="text-xl font-bold text-gray-700 mb-2">API Response:</h2>
            <pre className="whitespace-pre-wrap text-sm text-gray-800 break-words">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
export default App;