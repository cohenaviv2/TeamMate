import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
const projectId = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;
const databaseName = process.env.EXPO_PUBLIC_FIREBASE_DATABASE_NAME;
const appId = process.env.EXPO_PUBLIC_FIREBASE_APP_ID;

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: `${projectId}.firebaseapp.com`,
  projectId: projectId,
  databaseURL: `https://${databaseName}.firebaseio.com`,
  storageBucket: `${projectId}.appspot.com`,
  messagingSenderId: "SENDER_ID",
  appId: appId,
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});


export const Firebase = {
  app,
  db,
  auth,
};
