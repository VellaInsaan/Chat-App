import { BiBarChartSquare } from 'react-icons/bi';
import { Button, Drawer } from 'rsuite';
import { Icon } from '@rsuite/icons';
import { useModalState } from '../../misc/custom-hooks';
import Dashboard from '.';
import { useMediaQuery } from '../../misc/custom-hooks';
import { useCallback } from 'react';
import { auth } from '../../misc/firebase';
import { showMessage } from '../../misc/helpers';

const DashboardToggle = () => {
  const { isOpen, open, close } = useModalState();
  const isMobile = useMediaQuery('(max-width: 992px');

  const onSignOut = useCallback(() => {
    showMessage('info', 'Signed Out');
    auth.signOut();

    close();
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
