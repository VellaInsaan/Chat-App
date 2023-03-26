import { Icon } from '@rsuite/icons';
import { useCallback, useState } from 'react';
import { RiSendPlaneFill } from 'react-icons/ri';
import { Input, InputGroup } from 'rsuite';
import firebase from 'firebase/app';
import { useProfile } from '../../../context/profile.context';
import { useParams } from 'react-router';
import { database } from '../../../misc/firebase';
import { MessageOnError } from '../../../misc/helpers';
import AttachmentBtnModal from './AttachmentBtnModal';

const assembleMessages = (profile, chatId) => {
  return {
    roomId: chatId,
    author: {
      name: profile.name,
      uid: profile.uid,
      createdAt: profile.createdAt,
      ...(profile.avatar ? { avatar: profile.avatar } : {}),
    },
    createdAt: firebase.database.ServerValue.TIMESTAMP,
    likeCount: 0,
  };
};

const Bottom = () => {
  const { profile } = useProfile();
  const { chatId } = useParams();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onInputChange = useCallback((value) => {
    setInput(value);
  }, []);

  const onClickSend = async () => {
    if (input.trim() === '') return;

    const msgData = assembleMessages(profile, chatId);
    msgData.text = input;

    const updates = {};

    const messageId = database.ref('messages').push().key;

    updates[`/messages/${messageId}`] = msgData;
    updates[`/rooms/${chatId}/lastMessage`] = {
      ...msgData,
      msgId: messageId,
    };
    setIsLoading(true);
    try {
      await database.ref().update(updates);
      setInput('');
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      MessageOnError(err.message);
    }
  };

  const onKeyDown = (ev) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      onClickSend();
    }
  };

  return (
    <div>
      <InputGroup>
        <AttachmentBtnModal />
        <Input
          placeholder='Write a message here'
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          value={input}
        />
        <InputGroup.Button
          color='blue'
          appearance='primary'
          onClick={onClickSend}
          disabled={isLoading}
        >
          <Icon as={RiSendPlaneFill} size='1.3em' />
        </InputGroup.Button>
      </InputGroup>
    </div>
  );
};

export default Bottom;
