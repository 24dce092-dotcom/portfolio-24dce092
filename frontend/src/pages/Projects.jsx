import { useEffect, useState } from 'react';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import AuthPanel from '../components/AuthPanel';
import { createTask, deleteTask, getTasks, updateTask } from '../api';

export default function Projects() {
  const [mode, setMode] = useState('tasks'); // 'tasks' | 'repos'

  // Tasks (backend)
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  function fetchTasks() {
    setLoading(true);
    setError(null);
    getTasks()
      .then((data) => setTasks(data))
      .catch((err) => setError(err.message || 'Error'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (mode === 'tasks' && user) fetchTasks();
  }, [mode, user]);

  function handleAuthenticated(authenticatedUser) {
    localStorage.setItem('user', JSON.stringify(authenticatedUser));
    setUser(authenticatedUser);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setTasks([]);
  }

  function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    setActionError(null);
    createTask({ title, description, priority })
      .then((task) => {
        setTasks((current) => [task, ...current]);
        setTitle('');
        setDescription('');
        setPriority('medium');
      })
      .catch((err) => setActionError(err.message || 'Create error'))
      .finally(() => setSaving(false));
  }

  function beginEdit(task) {
    setEditingId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setActionError(null);
  }

  function saveEdit(id) {
    setSaving(true);
    setActionError(null);
    updateTask(id, { title: editTitle, description: editDescription })
      .then((updatedTask) => {
        setTasks((current) => current.map((task) => (task._id === id ? updatedTask : task)));
        setEditingId(null);
      })
      .catch((err) => setActionError(err.message || 'Update error'))
      .finally(() => setSaving(false));
  }

  function toggleCompleted(task) {
    setSaving(true);
    setActionError(null);
    updateTask(task._id, { completed: !task.completed })
      .then((updatedTask) => {
        setTasks((current) => current.map((item) => (item._id === task._id ? updatedTask : item)));
      })
      .catch((err) => setActionError(err.message || 'Update error'))
      .finally(() => setSaving(false));
  }

  function handleDelete(id) {
    if (!window.confirm('Delete this task?')) return;
    setSaving(true);
    setActionError(null);
    deleteTask(id)
      .then(() => setTasks((current) => current.filter((task) => task._id !== id)))
      .catch((err) => setActionError(err.message || 'Delete error'))
      .finally(() => setSaving(false));
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
          {!user && <AuthPanel onAuthenticated={handleAuthenticated} />}
          {user && <p>Signed in as <strong>{user.email}</strong> <button onClick={logout}>Logout</button></p>}
          {user && <>
          <form onSubmit={handleCreate} style={{ marginBottom: 16 }}>
            <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ padding: 6, marginRight: 8 }} />
            <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} style={{ padding: 6, marginRight: 8 }} />
            <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ padding: 6, marginRight: 8 }}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Create'}</button>
          </form>

          {loading && <Spinner />}
          {error && <ErrorMessage message={error} onRetry={fetchTasks} />}
          {actionError && <ErrorMessage message={actionError} onRetry={() => setActionError(null)} />}

          {!loading && !error && (
            <ul>
              {tasks.length === 0 && <li>No tasks yet</li>}
              {tasks.map((task) => (
                <li key={task._id} style={{ marginBottom: 12 }}>
                  {editingId === task._id ? (
                    <>
                      <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required style={{ padding: 6, marginRight: 8 }} />
                      <input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} style={{ padding: 6, marginRight: 8 }} />
                      <button onClick={() => saveEdit(task._id)} disabled={saving}>Save</button>
                      <button onClick={() => setEditingId(null)} style={{ marginLeft: 6 }}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <strong style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</strong>
                      {task.description && <div>{task.description}</div>}
                      <small>Priority: {task.priority}</small>
                      <div>
                        <button onClick={() => toggleCompleted(task)} disabled={saving} style={{ marginRight: 6 }}>
                          {task.completed ? 'Mark incomplete' : 'Mark complete'}
                        </button>
                        <button onClick={() => beginEdit(task)} style={{ marginRight: 6 }}>Edit</button>
                        <button onClick={() => handleDelete(task._id)} disabled={saving}>Delete</button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
          </>}
        </>
      )}

      {mode === 'repos' && (
        <>
          <div style={{ marginBottom: 12 }}>
            <input placeholder="GitHub username" value={githubUser} onChange={(e) => setGithubUser(e.target.value)} style={{ padding: 6, marginRight: 8 }} />
            <button onClick={() => fetchRepos(githubUser)}>Fetch Repos</button>
          </div>

          {reposLoading && <Spinner />}
          {reposError && <ErrorMessage message={reposError} onRetry={() => fetchRepos(githubUser)} />}

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
