import { Navigate, Route, Routes } from 'react-router-dom';
import SignIn from '../pages/SignIn';
const PublicRoute = () => {
  const profile = false;

  if (profile) {
    return <Navigate to='/' />;
  }

  return (
    <Routes>
      <Route path='/' element={<SignIn />} />
    </Routes>
  );
};

export default PublicRoute;
