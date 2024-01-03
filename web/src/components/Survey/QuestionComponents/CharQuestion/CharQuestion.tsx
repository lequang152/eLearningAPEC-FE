import { QuestionProps } from '../../../../constants/props';
import React from 'react';
import Input from '@mui/joy/Input';
import GlobalVariable from '../../../../utils/GlobalVariable';

export const CharQuestion = ({ question, state, disable }: QuestionProps) => {
    const { answers, setAnswers } = state;
    const value = answers?.answers && answers.answers[question.questionId];
    const stateValue = value ? value.value : '';

    return (
        <div className="input-wrapper">
            <Input
                placeholder="Type your answer here..."
                onChange={(e) => {
                    const newValue: object = { [question.questionId]: e.target.value };
                    let myAnswer: object = JSON.parse(localStorage.getItem('answerOnTest') || '{}');
                    if (Object.keys(myAnswer).length === 0) {
                        localStorage.setItem('answerOnTest', JSON.stringify(newValue));
                    } else {
                        myAnswer = {
                            ...myAnswer,
                            ...newValue,
                        };

                        localStorage.setItem('answerOnTest', JSON.stringify(myAnswer));
                    }

                    setAnswers({
                        questionId: question.questionId,
                        value: e.target.value,
                        accessToken: state.answers.accessToken,
                        answerToken: state.answers.answerToken,
                        questionType: question.questionType,
                    });
                }}
                name={question.questionId + ''}
                value={stateValue}
                variant="outlined"
                color="success"
                className="mt-3 "
                disabled={disable}
            />
        </div>
    );
};
