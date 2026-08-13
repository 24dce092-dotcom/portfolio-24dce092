import Header from './components/Header';
import About from './components/About';
import Skills from './components/Skills';
import Footer from './components/Footer';
import './App.css';

function App() {
  const skillList = ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript'];

  return (
    <>
      <Header name="Kalp Patel" themeColor="#2563eb" />
      <main>
        <About />
        <Skills skillList={skillList} />
      </main>
      <Footer />
    </>
  );
}

export default App;
