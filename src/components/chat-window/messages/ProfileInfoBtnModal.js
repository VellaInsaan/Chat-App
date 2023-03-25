import { Button, Modal } from 'rsuite';
import { useModalState } from '../../../misc/custom-hooks';
import ProfileAvatar from '../../dashboard/ProfileAvatar';

const ProfileInfoBtnModal = ({ profile, children, ...btnProps }) => {
  const { isOpen, open, close } = useModalState();
  const { name, avatar, createdAt } = profile;
  const memeberSince = new Date(createdAt).toLocaleDateString();
  const shortName = profile.name.split(' ')[0];
  return (
    <div>
      <Button {...btnProps} onClick={open}>
        {shortName}
      </Button>
      <Modal open={isOpen} onClose={close}>
        <Modal.Header>
          <Modal.Title className='font-bolder text-black-70'>
            {shortName} profile
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='text-center'>
          <ProfileAvatar
            src={avatar}
            name={name}
            className='width-200 height-200 img-fullsize font-huge'
          />
          <h4 className='mt-2'>{name}</h4>
          <p>Member since : {memeberSince}</p>
        </Modal.Body>
        <Modal.Footer>
          {children}
          <Button block onClick={close}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProfileInfoBtnModal;
