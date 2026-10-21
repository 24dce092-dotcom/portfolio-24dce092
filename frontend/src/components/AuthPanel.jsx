import { useState } from 'react';
import { login, register } from '../api';

export default function AuthPanel({ onAuthenticated }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const action = mode === 'login' ? login({ email, password }) : register({ name, email, password });
    action.then(({ token, user }) => {
      localStorage.setItem('token', token);
      onAuthenticated(user);
    }).catch((err) => setError(err.message)).finally(() => setBusy(false));
  }

  return (
    <form onSubmit={submit} style={{ marginBottom: 16 }}>
      <h3>{mode === 'login' ? 'Login to manage tasks' : 'Create an account'}</h3>
      {mode === 'register' && <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />}
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} minLength="6" required />
      <button type="submit" disabled={busy}>{busy ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}</button>
      <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
        {mode === 'login' ? 'Create account' : 'Back to login'}
      </button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}