import { Notification, toaster } from 'rsuite';

export const MessageOnError = (error) => {
  const messageOnError = (
    <Notification type={'error'} header={'Error'} closable>
      {error}
    </Notification>
  );
  return toaster.push(messageOnError, { placement: 'topCenter' });
};

export const showMessage = (type, message) => {
  const notification = <Notification type={type} header={message} closable />;
  return toaster.push(notification, { placement: 'topCenter' });
};

export const getNameInitials = (name) => {
  const splitName = name.toUpperCase().split(' ');

  if (splitName.length > 1) {
    return splitName[0][0] + splitName[1][0];
  }

  return splitName[0][0];
};

export const transformToArr = (snapValue) => {
  return snapValue ? Object.keys(snapValue) : [];
};
export const transformToArrWithId = (snapValue) => {
  return snapValue
    ? Object.keys(snapValue).map((roomId) => {
        return { ...snapValue[roomId], id: roomId };
      })
    : [];
};

export const getUserUpdate = async (userId, keyToUpdate, value, db) => {
  const updates = {};

  updates[`/profiles/${userId}/${keyToUpdate}`] = value;

  const getMsgs = db
    .ref('/messages')
    .orderByChild('author/uid')
    .equalTo(userId)
    .once('value');

  const getRooms = db
    .ref('/rooms')
    .orderByChild('lastMessage/author/uid')
    .equalTo(userId)
    .once('value');

  const [msgSnap, roomSnap] = await Promise.all([getMsgs, getRooms]);

  msgSnap.forEach((msg) => {
    updates[`/messages/${msg.key}/author/${keyToUpdate}`] = value;
  });
  roomSnap.forEach((room) => {
    updates[`/rooms/${room.key}/lastMessage/author/${keyToUpdate}`] = value;
  });

  return updates;
};
