import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const apiKey = process.env.EXPO_PUBLIC_API_KEY;
const projectId = process.env.EXPO_PUBLIC_PROJECT_ID;
const databaseName = process.env.EXPO_PUBLIC_DATABASE_NAME;
const appId = process.env.EXPO_PUBLIC_APP_ID;

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: `${projectId}.firebaseapp.com`,
  databaseURL: `https://${databaseName}.firebaseio.com`,
  projectId: projectId,
  storageBucket: `${projectId}.appspot.com`,
  messagingSenderId: "SENDER_ID",
  appId: appId,
};

const firebase = initializeApp(firebaseConfig);

const db = getDatabase(firebase);
const auth = getAuth(firebase);

export const Firebase = {
  app:firebase,
  db,
  auth
}
