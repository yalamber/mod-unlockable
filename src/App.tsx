import { AppWrapper } from './contexts/AppContext';
import { ModContractWrapper } from './contexts/ModContractContext';
import { Routes, Route } from 'react-router-dom';
import { Connect, Items } from './page';
import './styles/main.scss';

function App() {
  return (
    <AppWrapper>
      <ModContractWrapper>
        <Routes>
          <Route path="/" element={<Connect />} />
          <Route path="items" element={<Items />} />
        </Routes>
      </ModContractWrapper>
    </AppWrapper>
  );
}

export default App;
