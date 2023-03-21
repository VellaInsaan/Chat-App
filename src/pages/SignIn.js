import {
  Button,
  ButtonToolbar,
  Col,
  Container,
  Grid,
  Panel,
  Row,
} from 'rsuite';
import firebase from 'firebase/app';
import { FaFacebookF, FaGoogle } from 'react-icons/fa';
import { Icon } from '@rsuite/icons';
import { auth, database } from '../misc/firebase';
import { MessageOnError, showMessage } from '../misc/helpers';

const SignIn = () => {
  const signInWithProvider = async (provider) => {
    try {
      const { additionalUserInfo, user } = await auth.signInWithPopup(provider);

      if (additionalUserInfo.isNewUser) {
        database.ref(`/profiles/${user.uid}`).set({
          name: user.displayName,
          createdAt: firebase.database.ServerValue.TIMESTAMP,
        });
      }

      showMessage('success', 'Signed In');
    } catch (error) {
      MessageOnError(error.message);
    }
  };

  const onClickFacebookSignIn = () => {
    signInWithProvider(new firebase.auth.FacebookAuthProvider());
  };

  const onClickGoogleSignIn = () => {
    signInWithProvider(new firebase.auth.GoogleAuthProvider());
  };

  return (
    <Container>
      <Grid className='mt-page'>
        <Row>
          <Col xs={24} md={12} mdOffset={6}>
            <Panel>
              <div className='text-center'>
                <h2>Welcome to Chat</h2>
                <p>A chat platform for neophytes</p>
              </div>

              <div className='mt-3'>
                <ButtonToolbar>
                  <Button
                    block
                    color='blue'
                    appearance='primary'
                    onClick={onClickFacebookSignIn}
                  >
                    <Icon as={FaFacebookF} size='1.3em' /> Continue with
                    Facebook
                  </Button>
                  <Button
                    block
                    color='green'
                    appearance='primary'
                    onClick={onClickGoogleSignIn}
                  >
                    <Icon as={FaGoogle} size='1.3em' /> Continue with Google
                  </Button>
                </ButtonToolbar>
              </div>
            </Panel>
          </Col>
        </Row>
      </Grid>
    </Container>
  );
};

export default SignIn;
