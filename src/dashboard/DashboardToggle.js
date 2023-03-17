import { BiBarChartSquare } from 'react-icons/bi';
import { Button, Drawer } from 'rsuite';
import { Icon } from '@rsuite/icons';
import { useModalState } from '../misc/custom-hooks';
import Dashboard from '.';

const DashboardToggle = () => {
  const { isOpen, open, close } = useModalState();
  return (
    <>
      <Button block color='blue' appearance='primary' onClick={open}>
        <Icon as={BiBarChartSquare} size='1.3em' /> Dashboard
      </Button>
      <Drawer open={isOpen} onClose={close} placement={'left'}>
        <Dashboard />
      </Drawer>
    </>
  );
};

export default DashboardToggle;
