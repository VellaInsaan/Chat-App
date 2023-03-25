import { useParams } from 'react-router';
import { Button, Drawer } from 'rsuite';
import { useCurrentRoom } from '../../../context/current-room.context';
import { useMediaQuery, useModalState } from '../../../misc/custom-hooks';
import { database } from '../../../misc/firebase';
import { MessageOnError, showMessage } from '../../../misc/helpers';
import EditableInput from '../../EditableInput';

const EditRoomDrawerBtn = () => {
  const { isOpen, close, open } = useModalState();
  const name = useCurrentRoom((v) => v.name);
  const description = useCurrentRoom((v) => v.description);
  const { chatId } = useParams();
  const isMobile = useMediaQuery('(max-width : 992px)');

  const updateData = (key, value) => {
    database
      .ref(`rooms/${chatId}`)
      .child(key)
      .set(value)
      .then(() => {
        showMessage('success', 'Successfully updated');
      })
      .catch((err) => {
        MessageOnError(err.message);
      });
  };

  const onNameSave = (newName) => {
    updateData('name', newName);
  };
  const onDescriptionSave = (newDesc) => {
    updateData('description', newDesc);
  };

  const drawerHandler = () => {
    if (isMobile) {
      return 'full';
    }
  };
  return (
    <div>
      <Button
        className='br-circle'
        size='sm'
        color='red'
        appearance='primary'
        onClick={open}
      >
        A
      </Button>
      <Drawer
        size={drawerHandler()}
        open={isOpen}
        onClose={close}
        placement='right'
      >
        <Drawer.Header>
          <Drawer.Title>Edit Room</Drawer.Title>
          <Drawer.Actions>
            <Button block appearance='primary' color='red' onClick={close}>
              Close
            </Button>
          </Drawer.Actions>
        </Drawer.Header>
        <Drawer.Body>
          <EditableInput
            initialValue={name}
            onSave={onNameSave}
            label={<h6 className='mb-2'>Name</h6>}
            emptyMsg='Name can not be empty'
            placeholder='Enter room name'
          />
          <EditableInput
            initialValue={description}
            rows={5}
            onSave={onDescriptionSave}
            emptyMsg='Description can not be empty'
            wrapperClassName='mt-3'
            placeholder='Enter description'
          />
        </Drawer.Body>
      </Drawer>
    </div>
  );
};

export default EditRoomDrawerBtn;
