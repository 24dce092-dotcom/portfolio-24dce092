import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';

export default function NavBar({ onToggleTheme, theme }) {
  const location = useLocation();

  return (
    <nav className="nav">
      <ul>
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/">Home</Link>
        </li>
        <li className={location.pathname === '/projects' ? 'active' : ''}>
          <Link to="/projects">Projects</Link>
        </li>
        <li className={location.pathname === '/contact' ? 'active' : ''}>
          <Link to="/contact">Contact</Link>
        </li>
      </ul>
      <div className="nav-actions">
        <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? 'Dark' : 'Light'}
        </button>
      </div>
    </nav>
  );
}
