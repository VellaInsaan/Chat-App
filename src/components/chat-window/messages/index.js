import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { auth, database, storage } from '../../../misc/firebase';
import {
  MessageOnError,
  showMessage,
  transformToArrWithId,
} from '../../../misc/helpers';
import MessageItem from './MessageItem';
const Messages = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState(null);
  const isChatEmpty = messages && messages.length === 0;
  const canShowMsgs = messages && messages.length > 0;

  useEffect(() => {
    const messageRef = database.ref('/messages');

    messageRef
      .orderByChild('roomId')
      .equalTo(chatId)
      .on('value', (snap) => {
        const data = transformToArrWithId(snap.val());
        setMessages(data);
      });

    return () => {
      messageRef.off('value');
    };
  }, [chatId]);

  const handleAdmin = useCallback(
    async (uid) => {
      const adminRef = database.ref(`rooms/${chatId}/admins`);
      let alertMsg;
      await adminRef.transaction((admins) => {
        if (admins) {
          if (admins[uid]) {
            admins[uid] = null;
            alertMsg = 'Admin permission revoked';
          } else {
            admins[uid] = true;
            alertMsg = 'Admin permission granted ';
          }
        }
        return admins;
      });
      showMessage('info', alertMsg);
    },
    [chatId]
  );

  const handleLike = useCallback(async (msgId) => {
    const { uid } = auth.currentUser;
    const messageRef = database.ref(`messages/${msgId}`);
    let alertMsg;
    await messageRef.transaction((msg) => {
      if (msg) {
        if (msg.likes && msg.likes[uid]) {
          msg.likeCount -= 1;
          msg.likes[uid] = null;
          alertMsg = 'Like removed';
        } else {
          msg.likeCount += 1;

          if (!msg.likes) {
            msg.likes = {};
          }
          msg.likes[uid] = true;
          alertMsg = 'Liked';
        }
      }
      return msg;
    });
    showMessage('info', alertMsg);
  }, []);

  const handleDelete = useCallback(
    async (msgId, file) => {
      if (!window.confirm('Delete this message ?')) {
        return;
      }

      const isLast = messages[messages.length - 1].id === msgId;

      const updates = {};

      updates[`/messages/${msgId}`] = null;

      if (isLast && messages.length > 1) {
        updates[`rooms/${chatId}/lastMessage`] = {
          ...messages[messages.length - 2],
          msdId: messages[messages.length - 2].id,
        };
      }

      if (isLast && messages.length === 1) {
        updates[`rooms/${chatId}/lastMessage`] = null;
      }

      try {
        await database.ref().update(updates);
        showMessage('info', 'Message has been deleted');
      } catch (err) {
        return MessageOnError(err.message);
      }

      if (file) {
        try {
          const fileRef = storage.refFromURL(file.url);
          await fileRef.delete();
        } catch (error) {
          MessageOnError(error.message);
        }
      }
    },
    [chatId, messages]
  );

  return (
    <ul className='msg-list custom-scroll'>
      {isChatEmpty && <li> No messages yet...</li>}
      {canShowMsgs &&
        messages.map((msg) => (
          <MessageItem
            key={msg.id}
            message={msg}
            handleAdmin={handleAdmin}
            handleLike={handleLike}
            handleDelete={handleDelete}
          />
        ))}
    </ul>
  );
};

export default Messages;
