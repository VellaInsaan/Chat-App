import { useState } from 'react';
import { Button, Modal, Notification, useToaster } from 'rsuite';
import { useModalState } from '../../misc/custom-hooks';
import AvatarEditor from 'react-avatar-editor';

const AvatarBtnUpload = () => {
  const toaster = useToaster();
  const filesInputType = '.jpg, .jpeg, .png';
  const { isOpen, open, close } = useModalState();
  const acceptedFilesFmt = ['image/jpeg', 'image/pjpeg', 'image/png'];
  const [img, setImg] = useState(null);
  const isValid = (file) => acceptedFilesFmt.includes(file.type);
  const onChangeFileInput = (ev) => {
    const currFile = ev.target.files;

    if (currFile.length === 1) {
      const file = currFile[0];

      if (isValid(file)) {
        setImg(file);
        open();
      } else {
        const messageOnMismatch = (
          <Notification
            type={'warning'}
            header={`Wrong file format ${file.type}`}
          />
        );
        return toaster.push(messageOnMismatch, { placement: 'topCenter' });
      }
    }
  };

  return (
    <div className='mt-3 text-center'>
      <div>
        <label
          htmlFor='avatar-upload'
          className='d-block cursor-pointer padded'
        >
          Select new avatar
          <input
            id='avatar-upload'
            type='file'
            className='d-none'
            accept={filesInputType}
            onChange={onChangeFileInput}
          />
        </label>

        <Modal open={isOpen} onClose={close}>
          <Modal.Header>
            <Modal.Title>Adjust and upload new avatar</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='d-flex  justify-content-center align-items-center   h-100 '>
              {img && (
                <AvatarEditor
                  image={img}
                  width={200}
                  height={200}
                  border={10}
                  borderRadius={100}
                  rotate={0}
                />
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button appearance='ghost' block>
              Upload new avatar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default AvatarBtnUpload;
