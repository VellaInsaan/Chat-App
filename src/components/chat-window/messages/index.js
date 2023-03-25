import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { database } from '../../../misc/firebase';
import { showMessage, transformToArrWithId } from '../../../misc/helpers';
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

  return (
    <ul className='msg-list custom-scroll'>
      {isChatEmpty && <li> No messages yet...</li>}
      {canShowMsgs &&
        messages.map((msg) => (
          <MessageItem key={msg.id} message={msg} handleAdmin={handleAdmin} />
        ))}
    </ul>
  );
};

export default Messages;
