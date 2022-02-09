import React, { Fragment } from 'react'

const ProgressBar = ({ idQuestion, maxQuestions }) => {

    const getPercentage = (totalQuestions, questionId) => {
        return (100 / totalQuestions) * questionId;
    }

    const currentQuestion = idQuestion + 1;
    const progressPercentage = getPercentage(maxQuestions, currentQuestion);

    return (
        <Fragment>
            <div className='percentage'>
                <div className='progressPercent'>{`Question: ${currentQuestion}/${maxQuestions}`}</div>
                <div className='progressPercer'>{`Progression: ${progressPercentage}%`}</div>
            </div>
            <div className='progressBar'>
                <div className='progressBarChange' style={{width: `${progressPercentage}%`}}></div>
            </div>
        </Fragment>
        
    )
}

export default React.memo(ProgressBar)