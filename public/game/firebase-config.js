/* =========================================================
   FIREBASE CONFIG

   Paste the values from your Firebase project here
   (Firebase Console → Project settings → Your apps → Web app).

   Only apiKey + databaseURL are required for cloud credit sync,
   which uses the Realtime Database REST API (no SDK needed).

   Until real values are filled in, the game keeps working and
   simply saves everything locally on the device.
========================================================= */

window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyC27VYWmmze2ZldxNjUgbq0oRsEp1ZQWVc",
  authDomain: "astra-volt.firebaseapp.com",
  projectId: "astra-volt",
  // Realtime Database REST endpoint — adjust region suffix if your RTDB
  // was created outside the US (e.g. ...-default-rtdb.asia-southeast1.firebasedatabase.app)
  databaseURL: "https://astra-volt-default-rtdb.firebaseio.com",
  storageBucket: "astra-volt.firebasestorage.app",
  messagingSenderId: "937350126568",
  appId: "1:937350126568:web:de01d36be7395012d7e25d",
  measurementId: "G-WQCPBKR2GK",
};
