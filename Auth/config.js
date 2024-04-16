const firebase = require('firebase/app');
require('firebase/auth');
require('firebase/firestore');
require('firebase/storage'); // Import Firebase Storage module

const firebaseConfig = {
    apiKey: "AIzaSyBPfDJsa-gVHxpcG3sf-Hbeqw3xGjAYVHE",
    authDomain: "node-js-api-d7072.firebaseapp.com",
    projectId: "node-js-api-d7072",
    storageBucket: "node-js-api-d7072.appspot.com",
    messagingSenderId: "894706229754",
    appId: "1:894706229754:web:8b37ae7fde35aa6b1d8443",
    measurementId: "G-ETH4YNWHNK"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage(); // Initialize Firebase Storage service

module.exports = {
    auth,
    db,
    storage
};
