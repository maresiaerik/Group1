import React, { Component } from "react";
import axios from "axios";
import Token from "../Auth/token";
import Loading from "../Styles/Loading";

class Result extends Component {
    constructor(props) {
        super(props);
        this.getAnswersGiven = this.getAnswersGiven.bind(this);
        this.state = {
            answer_given: [],
            questions: [],
            answers: [],
            result: 0,
            results: []
        };
    }

    componentDidMount() {
        this.getAnswersGiven();
        setTimeout(
            function() {
                this.check();
            }.bind(this),
            500
        );
    }

    check() {
        const { answer_given, answers, questions } = this.state;
        var percent = 100 / answer_given.length;
        var correct = 0;
        for (let i in answer_given) {
            for (let j in answers) {
                if (answers[j].id === answer_given[i].answer_id) {
                    // let q = questions[answer_given[i].question_id - 1].question;
                    let q = '';
                    for(let k = 0; k < questions.length; k++) {
                        if(answer_given[i].question_id === questions[k].id) {
                            q = questions[k].question;
                            break;
                        }
                    }
                    let a = answers[j].answer;
                    let c = answers[j].correct_answer;
                    this.setState(({ results }) => ({
                        results: results.concat([
                            { answer: a, correct_answer: c, question: q }
                        ])
                    }));
                    correct += c;
                }
            }
        }
        var resultPercent = Math.round(correct * percent);
        this.setState({ result: resultPercent });
        const { result } = this.state;
        const quiz_instance = this.props.match.params.id;
        axios.post("http://localhost:4000/result/", {
            headers: { authorization: Token },
            result,
            quiz_instance
        });
    }

    getAnswersGiven() {
        const HEADERS = { headers: { authorization: Token } };
        axios
            .get(
                "http://localhost:4000/result/instance/" +
                    this.props.match.params.id,
                HEADERS
            )
            .then(res => {
                this.setState({ answer_given: res.data });
                axios
                    .get("http://localhost:4000/result/answers", HEADERS)
                    .then(res => {
                        this.setState({ answers: res.data });
                        axios
                            .get(
                                "http://localhost:4000/result/questions",
                                HEADERS
                            )
                            .then(res => {
                                console.log(res);
                                this.setState({ questions: res.data });
                            });
                    });
            });
    }

    render() {
        while (!this.state.results.length) return <Loading />;
        return (
            <div className="content">
                <div className="subject-container">
                    <div className="results-heading">
                        <h1>
                            {this.state.answer_given[0].quizname} -{" "}
                            {this.state.result}%
                        </h1>
                        {this.state.result < 100 && (
                            <h2>
                                <a
                                    href={`/study/material/${
                                        this.state.answer_given[0]
                                            .quizmaterialid
                                    }`}
                                >
                                    Need help?
                                </a>
                            </h2>
                        )}
                    </div>
                    <div className="list-container">
                        <div className="result-container">
                            {this.state.result >= 0 &&
                                this.state.results.map(
                                    result => (
                                        result.correct_answer == 1 &&
                                            this.state.style,
                                        (
                                            <div
                                                className="result-box"
                                                style={{
                                                    borderColor: result.correct_answer
                                                        ? "#65d173"
                                                        : "#f20d0d"
                                                }}
                                                key={result.question}
                                                value={result.correct_answer}
                                            >
                                                <h3>{result.question}</h3>

                                                <h4>{result.answer}</h4>
                                            </div>
                                        )
                                    )
                                )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Result;
