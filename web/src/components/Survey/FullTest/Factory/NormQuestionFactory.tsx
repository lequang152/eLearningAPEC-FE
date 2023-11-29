import { SurveyQuestionType } from "../../../../constants/QuestionType"
import { Question } from "../../../../constants/question.types"
import { LocalAnswerExam } from "../../../../hook/useLocalAnswerExam"
import { CharQuestion } from "../../QuestionComponents/CharQuestion/CharQuestion"
import { DateQuestion } from "../../QuestionComponents/DateQuestion/DateQuestion"
import { DateTimeQuestion } from "../../QuestionComponents/DateTimeQuestion/DateTimeQuestions"
import { MultipleChoiceQuestion } from "../../QuestionComponents/MultipleChoiceQuestion/MultipleChoiceQuestion"
import { NumericQuestion } from "../../QuestionComponents/NumericQuestion/NumericQuestion"
import SelectQuestion from "../../QuestionComponents/SelectQuestion/SelectQuestion"
import { SimpleChoiceQuestion } from "../../QuestionComponents/SimpleChoiceQuestion/SimpleChoiceQuestion"
import { TextQuestion } from "../../QuestionComponents/TextQuestion/TextQuestion"
const SpeakingQuestion = dynamic(() => import("../../SpeakingTest/SpeakingQuestion"))
// import SpeakingQuestion from "../../SpeakingTestElsa/SpeakingQuestion"
// import SpeakingQuestion from "../../SpeakingTest/SpeakingQuestion"
import dynamic from "next/dynamic"

export function NormQuestionFactory(question: Question | any, state: LocalAnswerExam) {
    switch (question.questionType) {
        case SurveyQuestionType.SIMPLE_CHOICE:
            return (
                <SimpleChoiceQuestion
                    question={question}
                    state={state}
                />
            )

        case SurveyQuestionType.MULTIPLE_CHOICE:
            return (
                <MultipleChoiceQuestion
                    question={question}
                    state={state}
                />
            )
        case SurveyQuestionType.DATE:
            return (
                <DateQuestion
                    question={question}
                    state={state}
                />
            )

        case SurveyQuestionType.DATETIME:
            return (
                <DateTimeQuestion
                    question={question}
                    state={state}
                />
            )

        case SurveyQuestionType.MULTIPLE_LINE:
            return (
                <TextQuestion
                    question={question}
                    state={state}
                />
            )
        case SurveyQuestionType.RECORDING:
            return (
                <SpeakingQuestion
                    state={state}
                    question={question}
                />
            )
        case SurveyQuestionType.SELECT:
            return (
                <SelectQuestion
                    state={state}
                    question={question}
                />
            )
        case SurveyQuestionType.NUMERIC:
            return (
                <NumericQuestion
                    state={state}
                    question={question}
                />
            )
        default:
            return (
                <CharQuestion
                    question={question}
                    state={state}
                />
            )
    }
}
