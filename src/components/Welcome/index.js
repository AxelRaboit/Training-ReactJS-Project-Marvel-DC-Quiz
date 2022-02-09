import React, { useState, useContext, Fragment, useEffect } from 'react';
import Logout from '../Logout';
import Quiz from '../Quiz';
import { FirebaseContext } from '../Firebase';

const Welcome = (props) => {

    const firebase = useContext(FirebaseContext);

    const [userSession, setUserSession] = useState(null);

    useEffect(() => {
        let listener = firebase.auth.onAuthStateChanged(user => {
            user
                ? setUserSession(user)
                : props.history.push('/')
        })

        return () => {
            //Permet de cleaner l'effet
            listener()
        }
    },[])

    return userSession === null ? (
        <Fragment>
            <div className="loader">
                <p>Loading ...</p>
            </div>
        </Fragment>
    ) : (
        <div className='quiz-bg'>
            <div className="container">
                <Logout />
                <Quiz />
            </div>
        </div>
    )
};

export default Welcome;
