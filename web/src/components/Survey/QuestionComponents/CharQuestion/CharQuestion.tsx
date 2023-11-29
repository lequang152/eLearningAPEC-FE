import { QuestionProps } from "../../../../constants/props"
import React from "react"
import Input from "@mui/joy/Input"
import GlobalVariable from "../../../../utils/GlobalVariable"


export const CharQuestion = ({ question, state }: QuestionProps) => {
    const { answers, setAnswers } = state
    const value = answers?.answers && answers.answers[question.questionId];
    const stateValue = value ? value.value : ""
    return (
        <div className="input-wrapper">
            <Input
                placeholder="Type your answer here..."
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
                }}
                name={question.questionId + ""}
                value={stateValue}
                variant="outlined"
                color="success"
                className="mt-3 "
            />
        </div>
    )
}

{
    /* <input
                type="number"
                className="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                id="exampleFormControlInputNumber"
                placeholder="Example label"
            />
            <label
                htmlFor="exampleFormControlInputNumber"
                className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
            >
                Number input
            </label> */
}
