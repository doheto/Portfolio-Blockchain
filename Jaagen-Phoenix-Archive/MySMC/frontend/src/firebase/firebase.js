import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

// Initialize Firebase
const config = {
apiKey: "AIzaSyCjyuuFas3icLyZuUpi_wG1dKPuCHTcqZQ",
authDomain: "mygreatsmc.firebaseapp.com",
databaseURL: "https://mygreatsmc.firebaseio.com",
projectId: "mygreatsmc",
storageBucket: "mygreatsmc.appspot.com",
messagingSenderId: "748375472834"
};

if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }
const db = firebase.database();
const auth = firebase.auth();

export {
    auth,
    db,
};