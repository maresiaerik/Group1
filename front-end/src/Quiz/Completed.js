import React, { Component } from "react";
import axios from "axios";
import Token from "../Auth/token";

export default class Completed extends Component {
    constructor() {
        if (!Token) {
            window.location = "/Login";
        }
        super();
        this.result = this.result.bind(this);
        this.state = {
            completedQuizzes: []
        };
    }
    componentDidMount() {
        axios
            .get("http://localhost:4000/quiz_landing/complete", {
                headers: { authorization: Token }
            })
            .then(res => {
                this.setState({ completedQuizzes: res.data });
                console.log(res.data)
            });
    }
    result(id) {
        window.location = "result/" + id;
    }

    render() {
        return (
            <div className="content">
                <div className="subject-container">
                    <h1>Completed Quizzes</h1>
                    <div className="list-container">
                        <div className="list">
                            {this.state.completedQuizzes.map(completed => (
                                <div
                                    className="box"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        this.result(completed.quiz_instance_id);
                                    }}
                                >
                                
                                    <h4>{completed.name}</h4>
                                    <div>View result</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
