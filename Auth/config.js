const firebase = require('firebase/app');
require('firebase/auth');
require('firebase/firestore');
require('firebase/storage'); // Import Firebase Storage module

const firebaseConfig = {
    
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
