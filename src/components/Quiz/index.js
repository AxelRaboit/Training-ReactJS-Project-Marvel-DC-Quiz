import React, { Component, Fragment } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { QuizMarvel } from '../quizMarvel';
import ProgressBar from '../ProgressBar';
import Levels from '../Levels';
import StageComplete from '../StageComplete';
import { FaChevronRight } from 'react-icons/fa';


toast.configure();

const initialState = {
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

const levelNames = ['debutant', 'confirme', 'expert'];

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

            this.setState({storedQuestions: newArray})

        }
    }

    showToastMsg = (pseudo) => {
        if(!this.state.showWelcomeMsg) {

            this.setState({showWelcomeMsg: true})

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
        this.loadQuestions(levelNames[this.state.quizLevel])
    }

    nextQuestion = () => {
        //When we arrive to the last question -> 9/10
        if(this.state.idQuestion === this.state.maxQuestions - 1) {
            this.setState({quizEnd: true })
        } else {
            this.setState((prevState) => ({idQuestion: prevState.idQuestion + 1}))
        }

        const goodAnswer = this.storedDataRef.current[this.state.idQuestion].answer;
        if(this.state.userAnswer === goodAnswer) {
            
            this.setState( prevState => ({score: prevState.score + 1}))

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

        const {
            maxQuestions,
            storedQuestions,
            idQuestion,
            score,
            quizEnd,
        } = this.state;

        if((storedQuestions !== prevState.storedQuestions) && storedQuestions.length) {

            this.setState({
                question: storedQuestions[idQuestion].question,
                options: storedQuestions[idQuestion].options
            })
        }

        //If the question is validated and the button was pressed
        if((idQuestion !== prevState.idQuestion) && storedQuestions.length) {
            this.setState({
                question: storedQuestions[idQuestion].question,
                options: storedQuestions[idQuestion].options,
                userAnswer: null,
                btnDisabled: true
            })
        }

        if ( quizEnd !== prevState.quizEnd ) {
            const gradePercent = this.getPercentage(maxQuestions, score);
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
        this.loadQuestions(levelNames[param]);
    }

    render() {

        const {
            quizLevel,
            maxQuestions,
            options,
            idQuestion,
            btnDisabled,
            userAnswer,
            score,
            quizEnd,
            percent
        } = this.state;

        const displayOptions = options.map((option, index) => {
            return (
                <p key={index}
                    className={`answerOptions ${userAnswer === option ? 'selected' : null}`}
                    onClick={() => this.submitAnswer(option)}
                >
                <FaChevronRight /> { option }
                </p>
            )
        })

        return quizEnd
            ? (<StageComplete
                    ref={this.storedDataRef}
                    levelNames={levelNames}
                    score={score}
                    maxQuestions={maxQuestions}
                    quizLevel={quizLevel}
                    percent={percent}
                    loadLevelQuestions={this.loadLevelQuestions}
                />
            )
            : (
                <Fragment>
                    <Levels
                        levelNames={levelNames}
                        quizLevel={quizLevel}
                    />
                    <ProgressBar
                        idQuestion={idQuestion}
                        maxQuestions={maxQuestions}
                    />
                    <h2>{this.state.question}</h2>

                    { displayOptions }

                    <button
                        disabled={btnDisabled}
                        className="btnSubmit"
                        onClick={this.nextQuestion}    
                    >
                        {idQuestion < maxQuestions - 1 ? 'Suivant' : 'Terminer'}
                    </button>
                </Fragment>
            )
    }
};

export default Quiz;
