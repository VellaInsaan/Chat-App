import React from 'react';
import { Button, Divider, Drawer, Notification, useToaster } from 'rsuite';
import { useProfile } from '../../context/profile.context';
import { database } from '../../misc/firebase';
import EditableInput from '../EditableInput';

const Dashboard = ({ onSignOut }) => {
  const toaster = useToaster();
  const { profile } = useProfile();
  const onSave = async (newData) => {
    const userNickName = database.ref(`profiles/${profile.uid}/`).child('name');

    try {
      await userNickName.set(newData);

      const messageOnSuccess = (
        <Notification type={'success'} header={'Nickname has been updated'} />
      );

      toaster.push(messageOnSuccess, { placement: 'topCenter' });
    } catch (error) {
      const messageOnError = (
        <Notification type={'error'} header={error.message} />
      );
      toaster.push(messageOnError, { placement: 'topCenter' });
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
        <Divider />
        <EditableInput
          name='nickname'
          initialValue={profile.name}
          onSave={onSave}
          label={<h6 className='mb-2'>Nickname</h6>}
        />
      </Drawer.Body>
    </>
  );
};

export default Dashboard;
