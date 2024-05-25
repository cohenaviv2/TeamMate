import { initializeApp } from "firebase/app";

const API_KEY = "AIzaSyC724SEEduQyjo8JEfU5RHqKci24zhxZ6A";
const PROJECT_ID = "teammate-d711b";
const DATABASE_NAME = "teammate-d711b-default-rtdb";
const APP_ID = "491582130065";

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: `${PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${DATABASE_NAME}.firebaseio.com`,
  projectId: PROJECT_ID,
  storageBucket: `${PROJECT_ID}.appspot.com`,
  messagingSenderId: "SENDER_ID",
  appId: APP_ID,
};

const firebase = initializeApp(firebaseConfig);

export default firebase;
