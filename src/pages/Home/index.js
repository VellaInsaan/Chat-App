import { Route, Routes } from 'react-router';
import { Col, Grid, Row } from 'rsuite';
import Sidebar from '../../components/Sidebar';
import { RoomsProvider } from '../../context/rooms.context';
import { useMediaQuery } from '../../misc/custom-hooks';
import { useResolvedPath } from 'react-router-dom';
import Chat from './Chat';

const Home = () => {
  const isDesktop = useMediaQuery('(min-width: 992px');
  const resolvedPath = useResolvedPath();
  const strictlyMatchesHome = resolvedPath.pathname === '/';
  // const isOnChatPage = resolvedPath.pathname.startsWith('/chat');
  const canRenderSidebar = isDesktop || strictlyMatchesHome;

  return (
    <RoomsProvider>
      <Grid fluid className='h-100'>
        <Row className='h-100'>
          {canRenderSidebar && (
            <Col xs={24} md={8} className='h-100'>
              <Sidebar />
            </Col>
          )}

          <Routes>
            <Route
              path='/chat/:chatId'
              element={
                <Col xs={24} md={16} className='h-100'>
                  <Chat />
                </Col>
              }
            />
            <Route
              path='/'
              element={
                isDesktop && (
                  <Col xs={24} md={16} className='h-100'>
                    <h6 className='text-center mt-page'>Please select chat</h6>
                  </Col>
                )
              }
            />
          </Routes>
        </Row>
      </Grid>
    </RoomsProvider>
  );
};

export default Home;
