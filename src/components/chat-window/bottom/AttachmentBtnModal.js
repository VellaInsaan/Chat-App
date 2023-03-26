import { InputGroup, Modal, Button, Uploader } from 'rsuite';
import { Icon } from '@rsuite/icons';
import { IoMdAttach } from 'react-icons/io';
import { useModalState } from '../../../misc/custom-hooks';
import { useState } from 'react';
import { storage } from '../../../misc/firebase';
import { useParams } from 'react-router';
import { MessageOnError } from '../../../misc/helpers';

const MAX_FILE_SIZE = 1000 * 1024 * 5;
const AttachmentBtnModal = ({ afterUpload }) => {
  const { isOpen, open, close } = useModalState();
  const [fileList, setFileList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { chatId } = useParams();

  const onChange = (fileArr) => {
    const filtered = fileArr
      .filter((el) => el.blobFile.size <= MAX_FILE_SIZE)
      .slice(0, 5);

    setFileList(filtered);
  };

  const onUpload = async () => {
    try {
      const uploadPromises = fileList.map((file) => {
        return storage
          .ref(`/chat/${chatId}`)
          .child(Date.now() + file.name)
          .put(file.blobFile, {
            cacheControl: `public , max-age = ${3600 * 24 * 3}`,
          });
      });

      const uploadSnapshots = await Promise.all(uploadPromises);

      const shapePromises = uploadSnapshots.map(async (snap) => {
        return {
          contentType: snap.metadata.contentType,
          name: snap.metadata.name,
          url: await snap.ref.getDownloadURL(),
        };
      });
      const files = await Promise.all(shapePromises);

      await afterUpload(files);
      setIsLoading(false);
      close();
    } catch (err) {
      setIsLoading(false);
      MessageOnError(err.message);
    }
  };
  return (
    <>
      <InputGroup.Button onClick={open}>
        <Icon as={IoMdAttach} size='1.2em' />
      </InputGroup.Button>
      <Modal open={isOpen} onClose={close}>
        <Modal.Header>
          <Modal.Title>Upload files</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Uploader
            fileList={fileList}
            multiple
            autoUpload={false}
            action=''
            onChange={onChange}
            listType='picture-text'
            className='w-100 '
            disabled={isLoading}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button block onClick={onUpload} disabled={isLoading}>
            Send to chat
          </Button>
          <div className='text-right mt-2'>
            <small>* only files less than 5Mb are allowed</small>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AttachmentBtnModal;
