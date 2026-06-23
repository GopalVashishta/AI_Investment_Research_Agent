import React from 'react';

function ResearchOutput({ result }) {
  if (!result) {
    return null;
  }

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-bold mb-4">Research Report for {result.companyName}</h2>
      
      {result.decision && (
        <div className="mb-4">
          <p className="text-lg font-semibold">
            Decision: <span className={result.decision === 'Invest' ? 'text-green-600' : 'text-red-600'}>
              {result.decision}
            </span>
          </p>
        </div>
      )}

      {result.confidence != null && (
        <div className="mb-4">
          <p className="text-lg font-semibold">
            Confidence: <span className="font-normal">{result.confidence}</span>
          </p>
        </div>
      )}

      {result.positives && result.positives.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Positives</h3>
          <ul className="list-disc pl-5 text-gray-800">
            {result.positives.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {result.risks && result.risks.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Risks</h3>
          <ul className="list-disc pl-5 text-gray-800">
            {result.risks.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {result.reasoning && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Reasoning</h3>
          <p className="whitespace-pre-wrap text-gray-800">{result.reasoning}</p>
        </div>
      )}

      {result.sourcesUsed && result.sourcesUsed.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Sources Used</h3>
          <ul className="list-disc pl-5 text-gray-800">
            {result.sourcesUsed.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {result.error && (
        <div className="mt-4 text-red-500">
          <p>Error: {result.error}</p>
        </div>
      )}
    </div>
  );
}

export default ResearchOutput;