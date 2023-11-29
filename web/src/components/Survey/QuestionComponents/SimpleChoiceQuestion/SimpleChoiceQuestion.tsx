"use client"
import { Radio } from "@mui/joy"
import { RadioGroup } from "@mui/material"
import { QuestionProps } from "../../../../constants/props"
import { Answer } from "../../../../constants/question.types"
import { setAnswer } from "../../../../redux/Slice/AnswerExam/AnswerExamSlice"
import { asc } from "../SelectQuestion/SelectQuestion"
import GlobalVariable from "../../../../utils/GlobalVariable"
import { useState } from "react"


export const SimpleChoiceQuestion = ({ question, state }: QuestionProps) => {
    const { answers, setAnswers } = state
    const _value = answers.answers && answers.answers[question.questionId]
    
    const stateValue = _value ? (_value.value == "" ? [] : _value.value) : []
    const global = GlobalVariable.getInstance()

    question.suggestedAnswers = (question.suggestedAnswers! as Answer[]).sort(asc)

    return (
        <>
            <RadioGroup
                onChange={(e) => {
                    setAnswer({
                        questionId: question.questionId,
                        value: e.target.value,
                    })
                }}
                className="flex"
            >
                {(question.suggestedAnswers as Answer[]).map((answer, aindex) => {
                    return (
                        <div
                            key={aindex}
                            className="flex flex-row items-center mb-2"
                        >
                            <Radio
                                checked={stateValue.find((id: number) => id == answer.id) != undefined}
                                onChange={(e) => {
                                    if(question.suggestedAnswers) {
                                        const suggestAns = question.suggestedAnswers as Answer[]
                                        const userAns = suggestAns.find((ans) => ans.id.toString() === e.target.value)
                                        const newValue: object = {[question.questionId]: userAns?.value.en_US}
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

                                    }
                                    const element = e.target as HTMLInputElement
                                    setAnswers({
                                        questionId: question.questionId,
                                        value: [Number(element.value)],
                                        accessToken: state.answers.accessToken,
                                        answerToken: state.answers.answerToken,
                                        questionType: question.questionType,
                                    })
                                }}
                                value={answer.id}
                                name={question.questionId + ""}
                                color="success"
                            />
                            <p className="ml-3 pr-4 text-left mb-0">{answer.value.en_US}</p>
                        </div>
                    )
                })}
            </RadioGroup>
        </>
    )
}
{
    /* <FormControlLabel
name={question.questionId + ""}
checked={stateValue.find((id: number) => id == answer.id) != undefined}
value={answer.id}
onChange={(e) => {
    const element = e.target as HTMLInputElement
    setAnswers({
        questionId: question.questionId,
        value: [Number(element.value)],
        accessToken: state.answers.accessToken,
        answerToken: state.answers.answerToken,
        questionType: question.questionType,
    })
}}
control={<Radio />}
label={answer.value.en_US}
key={aindex}
/> */
}
