import About from '../components/About';
import Skills from '../components/Skills';

export default function Home({ skillList = [] }) {
  return (
    <section>
      <About />
      <Skills skillList={skillList} />
    </section>
  );
}
