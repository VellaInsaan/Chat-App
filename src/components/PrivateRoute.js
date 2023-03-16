import Home from '../pages/Home';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useProfile } from '../context/profile.context';
import { Container, Loader } from 'rsuite';
const PrivateRoute = () => {
  const { profile, isLoading } = useProfile();

  if (!profile && isLoading) {
    return (
      <Container>
        <Loader center vertical size='md' content='loading' speed='slow' />
      </Container>
    );
  }

  if (!profile && !isLoading) {
    return <Navigate to='/signin' />;
  }

  return (
    <Routes>
      <Route path='/' element={<Home />} />
    </Routes>
  );
};

export default PrivateRoute;
