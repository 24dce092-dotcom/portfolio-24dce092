import { useEffect, useState } from 'react';

const API = import.meta.env.VITE_API_BASE || '/api';

export default function Projects() {
  const [mode, setMode] = useState('tasks'); // 'tasks' | 'repos'

  // Tasks (backend)
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
    if (mode === 'tasks') fetchTasks();
  }, [mode]);

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

  // GitHub repos
  const [githubUser, setGithubUser] = useState('');
  const [repos, setRepos] = useState([]);
  const [reposLoading, setReposLoading] = useState(false);
  const [reposError, setReposError] = useState(null);
  const [filter, setFilter] = useState('');

  function fetchRepos(username) {
    if (!username) return setReposError('Please enter a GitHub username');
    setReposLoading(true);
    setReposError(null);
    setRepos([]);
    fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos`)
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
        return r.json();
      })
      .then((data) => setRepos(data || []))
      .catch((err) => setReposError(err.message || 'Failed to fetch'))
      .finally(() => setReposLoading(false));
  }

  const visibleRepos = repos.filter((r) => r.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <section>
      <h2>Projects / Tasks</h2>

      <div style={{ marginBottom: 12 }}>
        <button onClick={() => setMode('tasks')} disabled={mode === 'tasks'} style={{ marginRight: 8 }}>
          Show Tasks
        </button>
        <button onClick={() => setMode('repos')} disabled={mode === 'repos'}>
          Show GitHub Repos
        </button>
      </div>

      {mode === 'tasks' && (
        <>
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
        </>
      )}

      {mode === 'repos' && (
        <>
          <div style={{ marginBottom: 12 }}>
            <input placeholder="GitHub username" value={githubUser} onChange={(e) => setGithubUser(e.target.value)} style={{ padding: 6, marginRight: 8 }} />
            <button onClick={() => fetchRepos(githubUser)}>Fetch Repos</button>
          </div>

          {reposLoading && <p>Loading repositories…</p>}
          {reposError && (
            <div>
              <p style={{ color: 'red' }}>Error: {reposError}</p>
              <button onClick={() => fetchRepos(githubUser)}>Retry</button>
            </div>
          )}

          {!reposLoading && !reposError && repos.length > 0 && (
            <>
              <input placeholder="Filter by name" value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: 6, marginBottom: 8, display: 'block' }} />
              <ul>
                {visibleRepos.map((r) => (
                  <li key={r.id} style={{ marginBottom: 8 }}>
                    <a href={r.html_url} target="_blank" rel="noreferrer">
                      <strong>{r.name}</strong>
                    </a>
                    {r.description && <div>{r.description}</div>}
                  </li>
                ))}
                {visibleRepos.length === 0 && <li>No repositories match</li>}
              </ul>
            </>
          )}

          {!reposLoading && !reposError && repos.length === 0 && <p>No repositories loaded. Enter a username and click "Fetch Repos".</p>}
        </>
      )}
    </section>
  );
}
