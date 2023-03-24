import { memo } from 'react';
import { Button, Modal } from 'rsuite';
import { useCurrentRoom } from '../../../context/current-room.context';
import { useModalState } from '../../../misc/custom-hooks';

const RoomInfoBtnModal = () => {
  const { isOpen, open, close } = useModalState();
  const description = useCurrentRoom((val) => val.description);
  const name = useCurrentRoom((val) => val.name);

  return (
    <>
      <Button appearance='link' className='px-0' onClick={open}>
        Room Info
      </Button>
      <Modal open={isOpen} onClose={close}>
        <Modal.Header>
          <h4 className='mb-1'>About {name}</h4>
        </Modal.Header>
        <Modal.Body>
          <h6 className='mb-1'>Description </h6>
          <p>{description}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button block onClick={close}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default memo(RoomInfoBtnModal);
