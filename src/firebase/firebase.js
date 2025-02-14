"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
var app_1 = require("firebase/app");
var firestore_1 = require("firebase/firestore");
var firebaseConfig = {
    apiKey: "AIzaSyDxgXYG_1TIEV9CieBtZcwpKFJpR5hcoO4",
    authDomain: "cody-matchmaker.firebaseapp.com",
    projectId: "cody-matchmaker",
    storageBucket: "cody-matchmaker.firebasestorage.app",
    messagingSenderId: "983435578576",
    appId: "1:983435578576:web:ce56172b4153be679c62d5",
};
// Initialize Firebase
var app = (0, app_1.initializeApp)(firebaseConfig);
// Initialize Firestore
exports.db = (0, firestore_1.getFirestore)(app);
