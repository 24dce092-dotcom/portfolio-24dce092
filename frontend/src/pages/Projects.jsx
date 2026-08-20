import { useEffect, useState } from 'react';

const API = 'http://localhost:5001/api';

export default function Projects() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  function fetchTasks() {
    setLoading(true);
    setError(null);
    fetch(`${API}/tasks`)
      .then((r) => {
        if (!r.ok) throw new Error(r.statusText || 'Fetch error');
        return r.json();
      })
      .then((data) => setTasks(data))
      .catch((err) => setError(err.message || 'Error'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  function handleCreate(e) {
    e.preventDefault();
    const payload = { title, description };
    fetch(`${API}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then(() => {
        setTitle('');
        setDescription('');
        fetchTasks();
      })
      .catch((err) => setError(err.message || 'Create error'));
  }

  return (
    <section>
      <h2>Projects / Tasks</h2>

      <form onSubmit={handleCreate} style={{ marginBottom: 16 }}>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ padding: 6, marginRight: 8 }} />
        <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} style={{ padding: 6, marginRight: 8 }} />
        <button type="submit">Create</button>
      </form>

      {loading && <p>Loading tasks…</p>}
      {error && (
        <div>
          <p style={{ color: 'red' }}>Error: {error}</p>
          <button onClick={fetchTasks}>Retry</button>
        </div>
      )}

      {!loading && !error && (
        <ul>
          {tasks.length === 0 && <li>No tasks yet</li>}
          {tasks.map((t) => (
            <li key={t.id}>
              <strong>{t.title}</strong>
              {t.description && <div>{t.description}</div>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
