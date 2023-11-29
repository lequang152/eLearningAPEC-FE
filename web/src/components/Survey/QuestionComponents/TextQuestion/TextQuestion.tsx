import { QuestionProps } from "../../../../constants/props"
import { Textarea } from "@mui/joy"
import style from "../utils/style.module.css"
import React, { useState } from "react"
import GlobalVariable from "../../../../utils/GlobalVariable"


export const TextQuestion = ({ question, state }: QuestionProps) => {
    const { answers, setAnswers } = state
    const [wordCount, setWordCount] = useState(0)
    const value = answers.answers[question.questionId]
    const stateValue = value ? value.value : ""
    return (
        <div className="w-100">
            <Textarea
                minRows={5}
                className={`border ${style["full-width"]}`}
                onChange={(e) => {
                    const newValue: object = {[question.questionId]: e.target.value}
                    let myAnswer: object = JSON.parse(localStorage.getItem("answerOnTest") || "{}")
                    if(Object.keys(myAnswer).length === 0) {
                        localStorage.setItem("answerOnTest", JSON.stringify(newValue))
                    } else {
                        myAnswer = {
                            ...myAnswer, 
                            ...newValue
                        }
                                           
                        localStorage.setItem("answerOnTest", JSON.stringify(myAnswer))
                    }
                    setAnswers({
                        questionId: question.questionId,
                        value: e.target.value,
                        accessToken: state.answers.accessToken,
                        answerToken: state.answers.answerToken,
                        questionType: question.questionType,
                    })
                    const match = e.target.value.match(/([0-9a-zA-Z]+)/gm) || []

                    setWordCount(match.length)
                }}
                name={question.questionId + ""}
                value={stateValue}
                color="success"
            />
            <div className="pt-3">Word count: {wordCount}</div>
        </div>
    )
}
