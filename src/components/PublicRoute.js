import { Navigate, Route, Routes } from 'react-router-dom';
import { Container, Loader } from 'rsuite';
import { useProfile } from '../context/profile.context';
import SignIn from '../pages/SignIn';
const PublicRoute = () => {
  const { profile, isLoading } = useProfile();

  if (!profile && isLoading) {
    return (
      <Container>
        <Loader center vertical size='md' content='loading' speed='slow' />
      </Container>
    );
  }

  if (profile && !isLoading) {
    return <Navigate to='/' />;
  }

  return (
    <Routes>
      <Route path='/' element={<SignIn />} />
    </Routes>
  );
};

export default PublicRoute;
