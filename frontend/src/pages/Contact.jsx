import { useState } from 'react';

export default function Contact() {
  const [message, setMessage] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  return (
    <section>
      <h2>Contact</h2>
      <div>
        <label>
          Message:
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
          />
        </label>
        <p>Live preview: {message}</p>
      </div>
      <div>
        <button onClick={() => setShowHelp((s) => !s)}>
          {showHelp ? 'Hide' : 'Show'} Help
        </button>
        {showHelp && (
          <div style={{ marginTop: 8 }}>
            <em>Enter a short message and press submit (not implemented).</em>
          </div>
        )}
      </div>
    </section>
  );
}
