import ProfileAvatar from '../../dashboard/ProfileAvatar';
import TimeAgo from 'timeago-react';
import ProfileInfoBtnModal from './ProfileInfoBtnModal';
import PresenceDot from '../../PresenceDot';
import { Button } from 'rsuite';
import { useCurrentRoom } from '../../../context/current-room.context';
import { auth } from '../../../misc/firebase';
import { useHover, useMediaQuery } from '../../../misc/custom-hooks';
import IconBtnControl from './IconBtnControl';
import { FaHeart } from 'react-icons/fa';
import { GrClose } from 'react-icons/gr';
import ImgBtnModal from './ImgBtnModal';

const renderFileMessage = (file) => {
  if (file.contentType.includes('image')) {
    return (
      <div className='height-220'>
        <ImgBtnModal src={file.url} fileName={file.name} />
      </div>
    );
  }
  if (file.contentType.includes('audio')) {
    return (
      <audio controls>
        <source src={file.url} type='audio/mp3' />
        Your browser doesn't support the audio element
      </audio>
    );
  }

  return <a href={file.url}>Download {file.name}</a>;
};

const MessageItem = ({ message, handleAdmin, handleLike, handleDelete }) => {
  const { createdAt, text, author, file, likes, likeCount } = message;

  const isAdmin = useCurrentRoom((val) => val.isAdmin);
  const admins = useCurrentRoom((val) => val.admins);

  const isMsgAuthorAdmin = admins.includes(author.uid);
  const isAuthor = auth.currentUser.uid === author.uid;
  const canGrantAdmin = isAdmin && !isAuthor;
  const [selfRef, isHovered] = useHover();
  const isLiked = likes && Object.keys(likes).includes(auth.currentUser.uid);
  const isMobile = useMediaQuery('(max-width : 992px)');
  const canShowIcons = isMobile || isHovered;
  return (
    <li
      className={`padded mb-1 cursor-pointer ${isHovered ? 'bg-black-02' : ''}`}
      ref={selfRef}
    >
      <div className='d-flex align-items-center font-bolder mb-1'>
        <PresenceDot uid={author.uid} />
        <ProfileAvatar
          src={author.avatar}
          name={author.name}
          className='ml-1'
          size='xs'
        />
        <ProfileInfoBtnModal
          profile={author}
          appearance='link'
          className='p-0 ml-1 text-black'
        >
          {canGrantAdmin && (
            <Button
              block
              appearance='primary'
              color='blue'
              onClick={() => handleAdmin(author.uid)}
            >
              {isMsgAuthorAdmin
                ? 'Remove admin permission'
                : 'Give admin in this room'}
            </Button>
          )}
        </ProfileInfoBtnModal>
        <TimeAgo
          datetime={createdAt}
          className='font-normal text-black-45 ml-2'
        />
        <IconBtnControl
          color={isLiked ? 'red' : ''}
          isVisible={canShowIcons}
          iconName={FaHeart}
          tooltip='Like this message'
          onClick={() => {
            handleLike(message.id);
          }}
          badgeContent={likeCount}
        />
        {isAdmin && (
          <IconBtnControl
            isVisible={canShowIcons}
            iconName={GrClose}
            tooltip='Delete this message'
            onClick={() => {
              handleDelete(message.id, file);
            }}
          />
        )}
      </div>
      <div>
        {text && <span className='word-break-all'>{text}</span>}
        {file && renderFileMessage(file)}
      </div>
    </li>
  );
};

export default MessageItem;
