import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
  apiKey: 'AIzaSyCMCWmbp7CHJq4LgmB_XuzIu6RkGTiB_Ws',
  authDomain: 'chat-web-app-ff849.firebaseapp.com',
  projectId: 'chat-web-app-ff849',
  storageBucket: 'chat-web-app-ff849.appspot.com',
  messagingSenderId: '859603218050',
  appId: '1:859603218050:web:b8508cad0320c08bff0e9b',
  databaseURL:
    'https://chat-web-app-ff849-default-rtdb.asia-southeast1.firebasedatabase.app/',
};

const app = firebase.initializeApp(config);
export const auth = app.auth();
export const database = app.database();
