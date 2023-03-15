import Home from '../pages/Home';
import { Navigate, Route, Routes } from 'react-router-dom';
const PrivateRoute = () => {
  const profile = false;

  if (!profile) {
    return <Navigate to='/signin' />;
  }

  return (
    <Routes>
      <Route path='/' element={<Home />} />
    </Routes>
  );
};

export default PrivateRoute;
