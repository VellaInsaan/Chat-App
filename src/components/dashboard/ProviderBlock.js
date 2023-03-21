import { useState } from 'react';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import { Button, Tag } from 'rsuite';
import { Icon } from '@rsuite/icons';
import { auth } from '../../misc/firebase';

import firebase from 'firebase';
import { MessageOnError, showMessage } from '../../misc/helpers';

const ProviderBlock = () => {
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
      showMessage('info', `Disconnected from ${providerID}`);
    } catch (error) {
      MessageOnError(error.message);
    }
  };

  const unlinkGoogle = () => {
    unlink('google.com');
  };
  const unlinkFacebook = () => {
    unlink('facebook.com');
  };

  const link = async (provider) => {
    try {
      await auth.currentUser.linkWithPopup(provider);

      updateIsConnected(provider.providerId, true);
      showMessage('success', `Linked to ${provider.providerId}`);
    } catch (error) {
      MessageOnError(error.message);
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
