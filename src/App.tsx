import { AppWrapper } from './contexts/AppContext';
import { Routes, Route } from 'react-router-dom';
import { Connect, Items } from './page';
import './styles/main.scss';

function App() {
  return (
    <AppWrapper>
      <Routes>
        <Route path="/" element={<Connect />} />
        <Route path="items" element={<Items />} />
      </Routes>
    </AppWrapper>
  );
}

export default App;
