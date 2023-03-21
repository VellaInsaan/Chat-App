import { useRef, useState } from 'react';
import { Button, Modal, Notification, useToaster } from 'rsuite';
import { useModalState } from '../../misc/custom-hooks';
import AvatarEditor from 'react-avatar-editor';
import { database, storage } from '../../misc/firebase';
import { useProfile } from '../../context/profile.context';

const AvatarBtnUpload = () => {
  const toaster = useToaster();
  const { profile } = useProfile();
  const filesInputType = '.jpg, .jpeg, .png';
  const { isOpen, open, close } = useModalState();
  const acceptedFilesFmt = ['image/jpeg', 'image/pjpeg', 'image/png'];
  const [img, setImg] = useState(null);
  const isValid = (file) => acceptedFilesFmt.includes(file.type);
  const avatarEditorRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const getBlob = (canvas) => {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('File processing error'));
        }
      });
    });
  };

  const onClickUpload = async () => {
    const canvas = avatarEditorRef.current.getImageScaledToCanvas();

    setIsLoading(true);
    try {
      const blob = await getBlob(canvas);
      const avatarFileRef = storage
        .ref(`/profiles/${profile.uid}`)
        .child('avatar');

      const uploadAvatarData = await avatarFileRef.put(blob, {
        cacheControl: `public , max-age=${3600 * 24 * 3}`,
      });

      const downloadURL = await uploadAvatarData.ref.getDownloadURL();

      const userAvatarRef = database
        .ref(`/profiles/${profile.uid}`)
        .child('avatar');

      await userAvatarRef.set(downloadURL);
      setIsLoading(false);

      const messageOnEmpty = (
        <Notification type={'info'} header={`Avatar has been uploaded`} />
      );

      toaster.push(messageOnEmpty, { placement: 'topCenter' });
    } catch (error) {
      setIsLoading(false);
      const messageOnError = (
        <Notification type={'error'} header={'ERROR'}>
          {error.message}
        </Notification>
      );
      return toaster.push(messageOnError, { placement: 'topCenter' });
    }
  };

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
                  ref={avatarEditorRef}
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
            <Button
              appearance='ghost'
              block
              onClick={onClickUpload}
              disabled={isLoading}
            >
              Upload new avatar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default AvatarBtnUpload;
