  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js";
  import firebase from 'firebase/app'
  import 'firebase/database'
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  console.error("testing error here")
  const firebaseConfig = {
    apiKey: "AIzaSyDk2JmN0NeoeNHHWsIxabeGb3rchbCeiPY",
    authDomain: "greetingletter-99bd9.firebaseapp.com",
    projectId: "greetingletter-99bd9",
    storageBucket: "greetingletter-99bd9.appspot.com",
    messagingSenderId: "65427478968",
    appId: "1:65427478968:web:0c252e9b24ab8efa25174d",
    measurementId: "G-MQ7M63YKH7"
  };
    // Initialize Firebase
  firebase.initializeApp(firebaseConfig)
  var db = firebase.database();
  console.log("Testing here");
 
  const analytics = getAnalytics(app);
