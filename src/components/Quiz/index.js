import React, { Component } from 'react';
import { QuizMarvel } from '../quizMarvel';
import Levels from '../Levels';
import ProgressBar from '../ProgressBar';

class Quiz extends Component {

    state = {
        levelNames: ['debutant', 'confirme', 'expert'],
        quizLevel: 0,
        maxQuestions: 10,
        storedQuestions: [],
        question: null,
        options: [],
        idQuestion: 0,
        btnDisabled: true,
        userAnswer: null,
    }

    loadQuestions = (level) => {

        const fetchedArrayQuiz = QuizMarvel[0].quizz[level];

        if(fetchedArrayQuiz.length >= this.state.maxQuestions){

            /* Remove 'answer' but keep the rest via destructuring and put datas into a new array.
            that's for hide answer if a user try to search into the reactdevtools */
            const newArray = fetchedArrayQuiz.map(({ answer, ...rest }) => rest);

            this.setState({
                storedQuestions: newArray
            })

        } else {

            console.log('Pas assez de questions');
        }
    }

    componentDidMount() {
        this.loadQuestions(this.state.levelNames[this.state.quizLevel])
    }

    componentDidUpdate(prevProps, prevState){
        if(this.state.storedQuestions !== prevState.storedQuestions) {
            this.setState({
                question: this.state.storedQuestions[this.state.idQuestion].question,
                options: this.state.storedQuestions[this.state.idQuestion].options
            })
        }
    }

    submitAnswer = (selectedAnswer) => {
        this.setState({
            userAnswer: selectedAnswer,
            btnDisabled: false
        })
    }

    render() {

        /* const { email, pseudo } = this.props.userData; */

        const displayOptions = this.state.options.map((option, index) => {
            return (
                <p key={index}
                    className={`answerOptions ${this.state.userAnswer === option ? 'selected' : null}`}
                    onClick={() => this.submitAnswer(option)}
                
                >
                    { option }
                </p>
            )
        })
        
        return (
            <div>
                <Levels />
                <ProgressBar/>
                <h2>{this.state.question}</h2>

                { displayOptions }

                <button disabled={this.state.btnDisabled} className="btnSubmit">Suivant</button>
            </div>
        )
    }
};

export default Quiz;
