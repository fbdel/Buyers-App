// import * as firebase from "firebase";
const firebase = require('firebase');
const config = {
    apiKey: 'AIzaSyAQHf0O3YXXMjF5wAoVzMJrx3AIEfAUrK8',
    authDomain: 'buyer-app-d455c.firebaseio.com',
    databaseURL: 'https://buyer-app-d455c.firebaseio.com',
    projectId: 'buyer-app-d455c',
    storageBucket: 'buyer-app-d455c.appspot.com',
    messagingSenderId: '73842735952',
};
export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();