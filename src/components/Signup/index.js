import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FirebaseContext } from '../Firebase';

const Signup = (props) => {

    const firebase = useContext(FirebaseContext);

    const data = {
        pseudo: '', 
        email: '',
        password: '',
        confirmPassword: ''
    }

    const [loginData, setLoginData] = useState(data);
    const [error, setError] = useState('')

    const handleChange = (e) => {
        /* Dans la ligne de code ci dessous, nous voulons set les datas de plusieurs  données,
        à savoir pseudo,email, password, confirmPassword, mais pour faire de façon dynamique
        nous pouvons ciblé les éléments par leurs id, par exemple, l'input pseudo à un id='pseudo'
        ce dernier est accessible via l'event, e.target.id, puis nous y ajoutons la valeur. */
        setLoginData({...loginData, [e.target.id]: e.target.value})
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const { email, password, pseudo } = loginData;
        firebase.signupUser(email, password)
        .then( authUser => {
            return firebase.user(authUser.user.uid).set({
                pseudo: pseudo, //We can also just saying 'pseudo' both elements are called in the same way.
                email: email,
            })
        })
        .then(() => {
            //Permet d'effacer les variables d'état pour les remettres à l'état initial
            setLoginData({...data});
            props.history.push('/welcome');
        })
        .catch(error => {
            setError(error);
            setLoginData({...data})
        })
    }

    const { pseudo, email, password, confirmPassword } = loginData;

    const btn = pseudo === '' || email === '' || password === '' || password !== confirmPassword
        ? (<button disabled>Inscription</button>)
        : (<button>Inscription</button>)

    const errorMsg = error !== '' && <span>{error.message}</span>

    return (
        <div className='signUpLoginBox'>
            <div className='slContainer'>
                <div className='formBoxLeftSignup'>
                
                </div>
                <div className='formBoxRight'>
                    <div className='formContent'>
                        {errorMsg}
                        <h2>Inscription</h2>
                        <form onSubmit={handleSubmit}>
                            <div className='inputBox'>
                                <input onChange={handleChange} value={pseudo} type="text" id="pseudo"  autoComplete="off" required />
                                <label htmlFor="pseudo">Pseudo</label>
                            </div>

                            <div className='inputBox'>
                                <input onChange={handleChange} value={email} type="email" id="email"  autoComplete="off" required />
                                <label htmlFor="email">Email</label>
                            </div>

                            <div className='inputBox'>
                                <input onChange={handleChange} value={password} type="password" id="password"  autoComplete="off" required />
                                <label htmlFor="password">Mot de passe</label>
                            </div>

                            <div className='inputBox'>
                                <input onChange={handleChange} value={confirmPassword} type="password" id="confirmPassword"  autoComplete="off" required />
                                <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                            </div>
                            {btn}
                        </form>
                        <div className='linkContainer'>
                            <Link to="/login" className='simpleLink'>Déjà inscrit ? Connectez-vous !</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Signup;
