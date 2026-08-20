import React from 'react';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div style={{ margin: '8px 0' }}>
      <p style={{ color: 'crimson', margin: 0 }}>Error: {message}</p>
      {onRetry && (
        <button onClick={onRetry} style={{ marginTop: 8 }}>
          Retry
        </button>
      )}
    </div>
  );
}
