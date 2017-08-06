import Rebase from 're-base';
import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyBRKdCIxhSQn0QnOxrbqPtEykz2kpLRH1g",
  authDomain: "touching-cloth.firebaseapp.com",
  databaseURL: "https://touching-cloth.firebaseio.com",
  projectId: "touching-cloth",
  storageBucket: "touching-cloth.appspot.com",
  messagingSenderId: "289116526958"
};

const app = firebase.initializeApp(config);
const fire = Rebase.createClass(app.database());

export default fire;
