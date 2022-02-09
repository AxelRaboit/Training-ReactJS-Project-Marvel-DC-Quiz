import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
    apiKey: "AIzaSyDIXuJLirZM-HLX1OylTg0RXSw310E9qw8",
    authDomain: "marvel-dc-quiz-579ee.firebaseapp.com",
    projectId: "marvel-dc-quiz-579ee",
    storageBucket: "marvel-dc-quiz-579ee.appspot.com",
    messagingSenderId: "446349184951",
    appId: "1:446349184951:web:af92312f021d6e22bd6232"
};

class Firebase {
    constructor() {
        app.initializeApp(config);
        this.auth = app.auth();
        this.db = app.firestore();
    }

    // create an account
    signupUser = (email, password) => 
    this.auth.createUserWithEmailAndPassword(email, password);

    // connect to an account
    loginUser = (email, password) => 
    this.auth.signInWithEmailAndPassword(email, password);

    // disconnect an account
    signoutUser = () => this.auth.signOut();

    // retrieve the password
    passwordReset = email => this.auth.sendPasswordResetEmail(email); 

    // firestore
    user = uid => this.db.doc(`users/${uid}`);

}

export default Firebase;