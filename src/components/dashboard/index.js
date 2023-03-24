import React from 'react';
import { Button, Divider, Drawer } from 'rsuite';
import { useProfile } from '../../context/profile.context';
import { database } from '../../misc/firebase';
import { getUserUpdate, MessageOnError, showMessage } from '../../misc/helpers';
import EditableInput from '../EditableInput';
import AvatarBtnUpload from './AvatarBtnUpload';
import ProviderBlock from './ProviderBlock';

const Dashboard = ({ onSignOut }) => {
  const { profile } = useProfile();
  const onSave = async (newData) => {
    try {
      const updates = await getUserUpdate(
        profile.uid,
        'name',
        newData,
        database
      );

      await database.ref().update(updates);

      showMessage('success', 'Nickname has been updated');
    } catch (error) {
      MessageOnError(error.message);
    }
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Dashboard</Drawer.Title>
        <Drawer.Actions>
          <Button block color='red' appearance='primary' onClick={onSignOut}>
            Sign out
          </Button>
        </Drawer.Actions>
      </Drawer.Header>

      <Drawer.Body>
        <h3>Hey , {profile.name}</h3>
        <ProviderBlock />
        <Divider />
        <EditableInput
          name='nickname'
          initialValue={profile.name}
          onSave={onSave}
          label={<h6 className='mb-2'>Nickname</h6>}
        />
        <AvatarBtnUpload />
      </Drawer.Body>
    </>
  );
};

export default Dashboard;
