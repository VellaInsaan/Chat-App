import { Route, Routes } from 'react-router';
import 'rsuite/dist/rsuite.min.css';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';

import './styles/main.scss';

function App() {
  return (
    <Routes>
      <Route path='/signin' element={<PublicRoute />} />
      <Route path='/' element={<PrivateRoute />} />
    </Routes>
  );
}

export default App;
