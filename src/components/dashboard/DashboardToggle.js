import { BiBarChartSquare } from 'react-icons/bi';
import { Button, Drawer } from 'rsuite';
import { Icon } from '@rsuite/icons';
import { useModalState } from '../../misc/custom-hooks';
import Dashboard from '.';
import { useMediaQuery } from '../../misc/custom-hooks';
import { useCallback } from 'react';
import { auth, database } from '../../misc/firebase';
import { MessageOnError, showMessage } from '../../misc/helpers';
import { isOfflineForDatabase } from '../../context/profile.context';

const DashboardToggle = () => {
  const { isOpen, open, close } = useModalState();
  const isMobile = useMediaQuery('(max-width: 992px');

  const onSignOut = useCallback(() => {
    database
      .ref(`/status/${auth.currentUser.uid}`)
      .set(isOfflineForDatabase)
      .then(() => {
        auth.signOut();
        showMessage('info', 'Signed Out');
        close();
      })
      .catch((err) => {
        MessageOnError(err.message);
      });
  }, [close]);

  const drawerHandler = () => {
    if (isMobile) {
      return 'full';
    }
  };

  return (
    <>
      <Button block color='blue' appearance='primary' onClick={open}>
        <Icon as={BiBarChartSquare} size='1.3em' /> Dashboard
      </Button>
      <Drawer
        size={drawerHandler()}
        open={isOpen}
        onClose={close}
        placement={'left'}
      >
        <Dashboard onSignOut={onSignOut} />
      </Drawer>
    </>
  );
};

export default DashboardToggle;
