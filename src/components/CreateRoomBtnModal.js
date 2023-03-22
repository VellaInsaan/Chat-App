import { Icon } from '@rsuite/icons';
import { forwardRef, useCallback, useRef, useState } from 'react';
import { HiOutlineLightBulb } from 'react-icons/hi';
import { Button, Form, Input, Modal, Schema } from 'rsuite';
import firebase from 'firebase';
import { useModalState } from '../misc/custom-hooks';
import { database } from '../misc/firebase';
import { MessageOnError, showMessage } from '../misc/helpers';

const { StringType } = Schema.Types;

const model = Schema.Model({
  name: StringType().isRequired('Chat room name is required'),
  description: StringType().isRequired('Description is required'),
});

const INITIAL_FORM = {
  name: '',
  description: '',
};

const Textarea = forwardRef((props, ref) => (
  <Input {...props} as='textarea' ref={ref} />
));
const CreateRoomBtnModal = () => {
  const [formValue, setFormValue] = useState(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef();
  const { isOpen, close, open } = useModalState();

  const onFormChange = useCallback((value) => {
    setFormValue(value);
  }, []);

  const onSubmit = async () => {
    if (!formRef.current.check()) {
      return;
    }

    console.log(formValue);
    setIsLoading(true);
    const newRoomData = {
      ...formValue,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
    };

    try {
      await database.ref('rooms').push(newRoomData);
      setIsLoading(false);
      setFormValue(INITIAL_FORM);
      close();
      showMessage('info', `${formValue.name} room has been created`);
    } catch (error) {
      setIsLoading(false);
      MessageOnError(error.message);
    }
  };

  return (
    <div className='mt-1'>
      <Button block color='green' appearance='primary' onClick={open}>
        <Icon as={HiOutlineLightBulb} /> Create new chat room
      </Button>

      <Modal open={isOpen} onClose={close}>
        <Modal.Header>
          <Modal.Title>New chat room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            fluid
            onChange={onFormChange}
            formValue={formValue}
            model={model}
            ref={formRef}
          >
            <Form.Group>
              <Form.ControlLabel>Room name</Form.ControlLabel>
              <Form.Control
                name='name'
                placeholder='Enter chat room name ...'
              />
            </Form.Group>

            <Form.Group>
              <Form.ControlLabel>Description</Form.ControlLabel>
              <Form.Control
                accepter={Textarea}
                rows={5}
                placeholder='Enter chat room description ...'
                name='description'
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            block
            appearance='primary'
            onClick={onSubmit}
            disabled={isLoading}
          >
            Create new chat room
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CreateRoomBtnModal;
