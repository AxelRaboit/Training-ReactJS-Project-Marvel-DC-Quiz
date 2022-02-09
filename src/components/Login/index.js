import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FirebaseContext } from '../Firebase';

const Login = (props) => {

    const firebase = useContext(FirebaseContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [btn, setBtn] = useState(false);

    const [error, setError] = useState('');

    useEffect(() => {
        if(password.length > 5 && email !== '') {
            setBtn(true);
        } else if (btn === true) {
            setBtn(false);
        }
    }, [password, email, btn])

    const loginButton = btn
        ? (<button>Connexion</button>)
        : (<button disabled>Connexion</button>)

    const handleSubmit = (e) => {
        e.preventDefault();
        firebase.loginUser(email, password)
        .then(user => {
            setEmail('');
            setPassword('');
            props.history.push('/welcome');
        })
        .catch(error => {
            setError(error);
            setEmail('');
            setPassword('');
        })
    }

    return (
        <div className='signUpLoginBox'>
            <div className="slContainer">
                <div className='formBoxLeftLogin'></div>
                <div className='formBoxRight'>
                    <div className='formContent'>

                        {error !== '' && <span>{error.message}</span>}

                        <h2>Connexion</h2>
                        <form onSubmit={handleSubmit}>
                            <div className='inputBox'>
                                <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" autoComplete="off" required />
                                <label htmlFor="email">Email</label>
                            </div>

                            <div className='inputBox'>
                                <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" autoComplete="off" required />
                                <label htmlFor="password">Mot de passe</label>
                            </div>

                            {loginButton}

                        </form>
                        <div className='linkContainer'>
                            <Link to="/signup" className='simpleLink'>Nouveau sur marvel dc quiz ? Inscrivez-vous maintenant !</Link>
                            <br />
                            <Link to="/forgetpassword" className='simpleLink'>Mot de passe oublié ? Récuperez le ici.</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Login;
