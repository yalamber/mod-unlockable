import { AppWrapper } from './contexts/AppContext';
import { Routes, Route } from 'react-router-dom';
import { Home, About } from './page';
import './styles/main.scss';

function App() {
  return (
    <AppWrapper>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} />
      </Routes>
    </AppWrapper>
  );
}

export default App;
