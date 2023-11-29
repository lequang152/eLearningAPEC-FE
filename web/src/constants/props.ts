import {LocalAnswerExam} from "../hook/useLocalAnswerExam"
import {Question} from "./question.types"

export type QuestionProps = {
    state: LocalAnswerExam

    question: Question
}

export type QuestionsProps = {
    questions: Question[]
}
