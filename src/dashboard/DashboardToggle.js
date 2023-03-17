import { BiBarChartSquare } from 'react-icons/bi';
import { Button, Drawer } from 'rsuite';
import { Icon } from '@rsuite/icons';
import { useModalState } from '../misc/custom-hooks';
import Dashboard from '.';
import { useMediaQuery } from '../misc/custom-hooks';

const DashboardToggle = () => {
  const { isOpen, open, close } = useModalState();
  const isMobile = useMediaQuery('(max-width: 992px');

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
        <Dashboard />
      </Drawer>
    </>
  );
};

export default DashboardToggle;
