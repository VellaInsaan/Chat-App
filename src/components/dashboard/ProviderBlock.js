import { useState } from 'react';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import { Button, Notification, Tag, useToaster } from 'rsuite';
import { Icon } from '@rsuite/icons';
import { auth } from '../../misc/firebase';

import firebase from 'firebase';

const ProviderBlock = () => {
  const toaster = useToaster();
  const [isConnected, setIsConnected] = useState({
    'google.com': auth.currentUser.providerData.some(
      (data) => data.providerId === 'google.com'
    ),
    'facebook.com': auth.currentUser.providerData.some(
      (data) => data.providerId === 'facebook.com'
    ),
  });

  const updateIsConnected = (providerID, value) => {
    setIsConnected((p) => {
      return { ...p, [providerID]: value };
    });
  };

  const unlink = async (providerID) => {
    try {
      if (auth.currentUser.providerData.length === 1) {
        throw new Error(`You cannot disconnect from ${providerID}`);
      }

      await auth.currentUser.unlink(providerID);

      updateIsConnected(providerID, false);
      const messageOnEmpty = (
        <Notification
          type={'info'}
          header={`Disconnected from ${providerID}`}
        />
      );

      toaster.push(messageOnEmpty, { placement: 'topCenter' });
    } catch (error) {
      const messageOnError = (
        <Notification type={'error'} header={error.message} />
      );
      return toaster.push(messageOnError, { placement: 'topCenter' });
    }
  };

  const unlinkGoogle = () => {
    unlink('google.com');
  };
  const unlinkFacebook = () => {
    unlink('facebook.com');
  };

  const link = (provider) => {
    try {
      auth.currentUser.linkWithPopup(provider);

      const messageOnSuccess = (
        <Notification
          type={'info'}
          header={`Linked to ${provider.providerId}`}
        />
      );
      toaster.push(messageOnSuccess, {
        placement: 'topCenter',
      });
      updateIsConnected(provider.providerId, true);
    } catch (error) {
      const messageOnError = (
        <Notification type={'error'} header={error.message} />
      );
      return toaster.push(messageOnError, { placement: 'topCenter' });
    }
  };
  const linkGoogle = () => {
    link(new firebase.auth.GoogleAuthProvider());
  };
  const linkFacebook = () => {
    link(new firebase.auth.FacebookAuthProvider());
  };

  return (
    <div>
      {isConnected['google.com'] && (
        <Tag color='green' closable onClose={unlinkGoogle}>
          <Icon as={FaGoogle} size='1.4em' /> Connected
        </Tag>
      )}

      {isConnected['facebook.com'] && (
        <Tag color='blue' closable onClose={unlinkFacebook}>
          <Icon as={FaFacebook} size='1em' /> Connected
        </Tag>
      )}

      <div className='mt-2'>
        {!isConnected['google.com'] && (
          <Button color='green' appearance='primary' block onClick={linkGoogle}>
            <Icon as={FaGoogle} size='1.4em' /> Link to Google
          </Button>
        )}

        {!isConnected['facebook.com'] && (
          <Button
            color='blue'
            appearance='primary'
            block
            onClick={linkFacebook}
          >
            <Icon as={FaFacebook} size='1.4em' /> Link to Facebook
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProviderBlock;
