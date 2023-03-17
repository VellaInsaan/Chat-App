import React from 'react';
import { Button, Drawer } from 'rsuite';
import { useProfile } from '../context/profile.context';

const Dashboard = ({ onSignOut }) => {
  const { profile } = useProfile();

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
      </Drawer.Body>
    </>
  );
};

export default Dashboard;
