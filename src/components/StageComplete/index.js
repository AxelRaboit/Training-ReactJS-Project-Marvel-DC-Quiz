import React, { Fragment, useEffect, useState } from 'react';
import { GiTrophyCup } from 'react-icons/gi';
import Loader from '../Loader';
import Modal from '../Modal';

const StageComplete = React.forwardRef((props, ref) => {

    const {levelNames, score, maxQuestions, quizLevel, percent, loadLevelQuestions} = props;
    
    const [askedQuestions, setAskedQuestions] = useState([]);

    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        setAskedQuestions(ref.current)
    }, [ref])

    const showModal = (id) => {
        setOpenModal(true);
    }

    const closeModal = () => {
        setOpenModal(false);
    }

    const averageGrade = maxQuestions / 2;

    if (score < averageGrade) {
        //To teleport the user at the beginning of the quiz (level 1)
        /* setTimeout(() => {
            loadLevelQuestions(0);
        }, 3000) */

        //To teleport the user at the start of the current quiz level
        setTimeout(() => {
            loadLevelQuestions(quizLevel);
        }, 3000)
    }

    const decision = score >= averageGrade
        ? (
            <Fragment>
                <div className='stepsBtnContainer'>
                    {
                        quizLevel < levelNames.length ?
                        (
                            <Fragment>
                                <p className='successMsg'>Bravo, passez au niveau suivant !</p>
                                <button 
                                    className='btnResult success'
                                    onClick={() => loadLevelQuestions(quizLevel)}
                                >Niveau suivant
                                </button>
                            </Fragment>
                        )
                        :
                        (
                            <Fragment>
                                <p className='successMsg'>
                                    <GiTrophyCup size='50px' />
                                    Bravo, vous êtes un expert !
                                </p>
                                <button
                                    className='btnResult success'
                                    onClick={() => loadLevelQuestions(0)}
                                >Accueil</button>
                            </Fragment>
                        )
                    }
                </div>
                <div className='percentage'>
                    <div className='progressPercent'>Réussite: {percent}%</div>
                    <div className='progressPercent'>Note: {score}/{maxQuestions}</div>
                </div>
            </Fragment>    
        )
        : (
            <Fragment>
                <div className='stepsBtnContainer'>
                    <p className='failureMsg'>Vous avez échoué !</p>
                </div>

                <div className='percentage'>
                    <div className='progressPercent'>Réussite: {percent}%</div>
                    <div className='progressPercent'>Note: {score}/{maxQuestions}</div>
                </div>
            </Fragment>
        )
    ;

    const questionAnswer = score >= averageGrade ? (
        askedQuestions.map((question) => {
            return (
                <tr key={question.id}>
                    <td>{question.question}</td>
                    <td>{question.answer}</td>
                    <td>
                        <button
                            className='btnInfo'
                            onClick={() => showModal(question.heroId)}
                        >
                        Infos
                        </button>
                    </td>
                </tr>
            )
        })
    )
    :
    (
        <tr>
            <td colSpan='3'>
                <Loader
                    loadingMsg={'Pas de réponse'}
                    styling={{textAlign: 'center', color: 'red'}}
                />
            </td>
        </tr>
    )
    

    return (
        <Fragment>
            {decision}

            <hr />

            <p>Les réponses aux questions posées:</p>

            <div className='answerContainer'>
                <table className='answers'>
                    <thead>
                        <tr>
                            <th>Questions</th>
                            <th>Réponses</th>
                            <th>Informations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questionAnswer}
                    </tbody>
                </table>
            </div>

            <Modal
                showModal={openModal}
                closeModal={closeModal}
            >
                <div className="modalHeader">
                    <h2>Titre</h2>
                </div>
                <div className="modalBody">
                    <h3>Titre 2</h3>
                </div>
                <div className="modalFooter">
                    <button className="modalBtn">Fermer</button>
                </div>
            </Modal>

        </Fragment>

    )
})


export default React.memo(StageComplete)