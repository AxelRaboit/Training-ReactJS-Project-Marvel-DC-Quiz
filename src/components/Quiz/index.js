import React, { Component, Fragment } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { QuizMarvel } from '../quizMarvel';
import Levels from '../Levels';
import StageComplete from '../StageComplete';
import ProgressBar from '../ProgressBar';


toast.configure();

const initialState = {
    levelNames: ['debutant', 'confirme', 'expert'],
    quizLevel: 0,
    maxQuestions: 10,
    storedQuestions: [],
    question: null,
    options: [],
    idQuestion: 0,
    btnDisabled: true,
    userAnswer: null,
    score: 0,
    showWelcomeMsg: false,
    quizEnd: false,
    percent: null
}


class Quiz extends Component {
    
    constructor(props) {
        super(props)
        this.state = initialState;
        this.storedDataRef = React.createRef();
    }

    loadQuestions = (level) => {

        const fetchedArrayQuiz = QuizMarvel[0].quizz[level];

        if(fetchedArrayQuiz.length >= this.state.maxQuestions){

            this.storedDataRef.current = fetchedArrayQuiz;

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

    showToastMsg = (pseudo) => {
        if(!this.state.showWelcomeMsg) {

            this.setState({
                showWelcomeMsg: true
            })

            toast(`Bienvenue ${pseudo}, et bonne chance !`, {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false
            });
        }
    }

    componentDidMount() {
        this.loadQuestions(this.state.levelNames[this.state.quizLevel])
    }

    nextQuestion = () => {
        //When we arrive to the last question -> 9/10
        if(this.state.idQuestion === this.state.maxQuestions - 1) {
            this.setState({quizEnd: true })
        } else {
            this.setState((prevState) => ({
                idQuestion: prevState.idQuestion + 1
            }))
        }

        const goodAnswer = this.storedDataRef.current[this.state.idQuestion].answer;
        if(this.state.userAnswer === goodAnswer) {
            this.setState( prevState => ({
                score: prevState.score + 1
            }))

            toast.success('Bravo, bonne réponse !', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                bodyClassName: 'toastify-color'
            })
        } else {
            toast.error('Dommage, mauvaise réponse !', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                bodyClassName: 'toastify-color'
            })
        }
    }

    componentDidUpdate(prevProps, prevState){
        if((this.state.storedQuestions !== prevState.storedQuestions) && this.state.storedQuestions.length) {

            this.setState({
                question: this.state.storedQuestions[this.state.idQuestion].question,
                options: this.state.storedQuestions[this.state.idQuestion].options
            })
        }

        //If the question is validated and the button was pressed
        if((this.state.idQuestion !== prevState.idQuestion) && this.state.storedQuestions.length) {
            this.setState({
                question: this.state.storedQuestions[this.state.idQuestion].question,
                options: this.state.storedQuestions[this.state.idQuestion].options,
                userAnswer: null,
                btnDisabled: true
            })
        }

        if ( this.state.quizEnd !== prevState.quizEnd ) {
            const gradePercent = this.getPercentage(this.state.maxQuestions, this.state.score);
            this.stageComplete(gradePercent);
        }

        if(this.props.userData.pseudo !== prevProps.userData.pseudo){
            this.showToastMsg(this.props.userData.pseudo)
        }
    }

    submitAnswer = (selectedAnswer) => {
        this.setState({
            userAnswer: selectedAnswer,
            btnDisabled: false
        })
    }

    getPercentage = (maxQuestions, score) => (score / maxQuestions) * 100;

    stageComplete = (percent) => {

        if (percent >= 50) {
            this.setState({
                quizLevel: this.state.quizLevel + 1,
                percent: percent
            })
        } else {
            this.setState({percent: percent})
        }
    }

    loadLevelQuestions = (param) => {
        this.setState({...initialState, quizLevel: param})
        this.loadQuestions(this.state.levelNames[param]);
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

        
        
        return this.state.quizEnd
            ? (<StageComplete
                    ref={this.storedDataRef}
                    levelNames={this.state.levelNames}
                    score={this.state.score}
                    maxQuestions={this.state.maxQuestions}
                    quizLevel={this.state.quizLevel}
                    percent={this.state.percent}
                    loadLevelQuestions={this.loadLevelQuestions}
                />
            )
            : (
                <Fragment>
                    <Levels />
                    <ProgressBar
                        idQuestion={this.state.idQuestion}
                        maxQuestions={this.state.maxQuestions}
                    />
                    <h2>{this.state.question}</h2>

                    { displayOptions }

                    <button
                        disabled={this.state.btnDisabled}
                        className="btnSubmit"
                        onClick={this.nextQuestion}    
                    >
                        {this.state.idQuestion < this.state.maxQuestions - 1 ? 'Suivant' : 'Terminer'}
                    </button>
                </Fragment>
            )
    }
};

export default Quiz;
