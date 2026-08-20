import Header from './components/Header';
import Footer from './components/Footer';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const skillList = ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript'];
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }

  return (
    <div className={`app-root ${theme}`}>
      <Header name="Kalp Patel" themeColor="#2563eb" />
      <NavBar onToggleTheme={toggleTheme} theme={theme} />
      <main>
        <Routes>
          <Route path="/" element={<Home skillList={skillList} />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
