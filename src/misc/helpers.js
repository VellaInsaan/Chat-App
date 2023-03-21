import { Notification, toaster } from 'rsuite';

export const MessageOnError = (error) => {
  const messageOnError = (
    <Notification type={'error'} header={'Error'}>
      {error}
    </Notification>
  );
  return toaster.push(messageOnError, { placement: 'topCenter' });
};

export const showMessage = (type, message) => {
  const notification = <Notification type={type} header={message} />;
  return toaster.push(notification, { placement: 'topCenter' });
};

export const getNameInitials = (name) => {
  const splitName = name.toUpperCase().split(' ');

  if (splitName.length > 1) {
    return splitName[0][0] + splitName[1][0];
  }

  return splitName[0][0];
};
