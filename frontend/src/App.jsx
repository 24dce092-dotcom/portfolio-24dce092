import Header from './components/Header';
import Footer from './components/Footer';
import NavBar from './components/NavBar';
import { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

const Home = lazy(() => import('./pages/Home'));
const Projects = lazy(() => import('./pages/Projects'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  const skillList = ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript'];
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('theme');
      return saved || 'light';
    } catch (e) {
      return 'light';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      // ignore
    }
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }

  return (
    <div className={`app-root ${theme}`}>
      <Header name="Kalp Patel" themeColor="#2563eb" />
      <NavBar onToggleTheme={toggleTheme} theme={theme} />
      <main>
        <Suspense fallback={<div className="route-loading" role="status">Loading page...</div>}>
          <Routes>
            <Route path="/" element={<Home skillList={skillList} />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
