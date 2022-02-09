import React, { Component } from 'react';
import Levels from '../Levels';
import ProgressBar from '../ProgressBar';

class Quiz extends Component {

    render() {

        /* const { email, pseudo } = this.props.userData; */
        
        return (
            <div>
                <Levels />
                <ProgressBar/>
                <h2>Notre question Quiz</h2>
                <p className="answerOptions">Question 1</p>
                <p className="answerOptions">Question 1</p>
                <p className="answerOptions">Question 1</p>
                <p className="answerOptions">Question 1</p>
                <button className="btnSubmit">Suivant</button>
            </div>
        )
    }
};

export default Quiz;
