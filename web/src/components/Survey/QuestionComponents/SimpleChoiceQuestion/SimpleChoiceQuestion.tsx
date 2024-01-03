'use client';
import { Radio } from '@mui/joy';
import { RadioGroup } from '@mui/material';
import { QuestionProps } from '../../../../constants/props';
import { Answer } from '../../../../constants/question.types';
import { setAnswer } from '../../../../redux/Slice/AnswerExam/AnswerExamSlice';
import { asc } from '../SelectQuestion/SelectQuestion';
import GlobalVariable from '../../../../utils/GlobalVariable';
import { useState, useEffect } from 'react';
import style from './style.module.css';

export const SimpleChoiceQuestion = ({ question, state, isCorrectingQuestion, disable }: QuestionProps) => {
    const { answers, setAnswers } = state;
    const _value = answers.answers && answers.answers[question.questionId];
    const [titleOnTest, setTitleOnTest] = useState(question?.title?.en_US.replace(/{|}/g, ''));
    const stateValue = _value ? (_value.value == '' ? [] : _value.value) : [];
    const getLocalStorage = JSON.parse(localStorage.getItem('survey') || '{}');
    const accessToken = getLocalStorage.current_input?.accessToken;
    const answerToken = getLocalStorage.current_input?.answerToken;
    const getAnswersLocal = answerToken ? getLocalStorage[accessToken][answerToken]?.answers.answers : {};
    let studentAnswer = JSON.parse(localStorage.getItem('answerOnTest') || '{}');
    const [selectAnswer, setSelectAnswer] = useState('');
    const [idAnswer, setIdAnswer] = useState<number>(0);
    const inputElement = document.createElement('input');
    const [inputTag, setInputTag] = useState(GlobalVariable.getInstance().getQuestionToCorrect());

    useEffect(() => {
        let inputTagElement = document.getElementById(idAnswer.toString()) as HTMLInputElement | null;
        inputTagElement?.setAttribute('value', inputTag[idAnswer]);
    }, [inputTag]);

    useEffect(() => {
        const uTag = document.querySelectorAll('u');
        if (Object.keys(studentAnswer).length !== 0) {
            for (let i = 0; i < uTag.length; i++) {
                if (studentAnswer[question.questionId]) {
                    if (uTag[i].innerText === studentAnswer[question.questionId].split(':')[0]) {
                        uTag[i].style.color = 'red';
                        break;
                    }
                }
            }
        }
    }, [studentAnswer]);

    // useEffect(() => {
    //       const uTag = document.querySelectorAll('u');
    //       for (let i = 0; i < uTag.length; i++) {
    //         uTag[i].style.color = '#6d6e75';
    //       }

    //   }, [idAnswer]);

    useEffect(() => {
        let inputTagElement = document.getElementById(idAnswer.toString()) as HTMLInputElement | null;
        if (disable) {
            inputElement.setAttribute('disabled', 'true');
        }
        const handleChange = (e: Event) => {
            setInputTag({
                ...inputTag,
                [idAnswer]: (e.target as HTMLInputElement).value,
            });
            setAnswers({
                questionId: question.questionId,
                value: [{ id: idAnswer, value: (e.target as HTMLInputElement).value }],
                accessToken: state.answers.accessToken,
                answerToken: state.answers.answerToken,
                questionType: question.questionType,
            });

            const newValue: object = {
                [question.questionId]: `${selectAnswer}:${(e.target as HTMLInputElement).value}`,
            };
            if (Object.keys(studentAnswer).length === 0) {
                localStorage.setItem('answerOnTest', JSON.stringify(newValue));
            } else {
                studentAnswer = {
                    ...studentAnswer,
                    ...newValue,
                };

                localStorage.setItem('answerOnTest', JSON.stringify(studentAnswer));
            }
        };

        inputTagElement?.addEventListener('change', handleChange);

        return () => {
            inputTagElement?.removeEventListener('change', handleChange);
        };
    });

    const handleClickOnUTag = (e: any) => {
        let check: boolean = false;
        if (isCorrectingQuestion) {
            let elementOnTest = e.target;
            while (elementOnTest && elementOnTest !== e.currentTarget && elementOnTest.tagName !== 'U') {
                elementOnTest = elementOnTest.parentNode;
            }
            if (elementOnTest && elementOnTest.tagName === 'U') {
                Object.keys(GlobalVariable.getInstance().getQuestionToCorrect()).forEach((key) => {
                    const value = GlobalVariable.getInstance().getQuestionToCorrect()[key];
                    if (value === elementOnTest.innerText) {
                        check = true;
                        setIdAnswer(parseInt(key));
                        inputElement.setAttribute('id', key);
                        if (getAnswersLocal[question.questionId].value.length != 0) {
                            getAnswersLocal[question.questionId].value.forEach((item: any) => {
                                if (item.id === parseInt(key)) {
                                    setInputTag({
                                        ...inputTag,
                                        [parseInt(key)]: item.value,
                                    });
                                }
                            });
                        }
                    }
                });
                setSelectAnswer(elementOnTest.innerText);

                Object.keys(GlobalVariable.getInstance().getQuestionToCorrect()).forEach((key) => {
                    if (inputElement.id == key) {
                        if (inputElement.value === '') {
                            inputElement.setAttribute(
                                'value',
                                GlobalVariable.getInstance()
                                    .getQuestionToCorrect()
                                    [key].replace(/\(\d+\)/g, '')
                                    .replace(/[()]/g, ''),
                            );
                        }
                    }
                });

                inputElement.setAttribute('type', 'text');
                inputElement.setAttribute(
                    'style',
                    'border: 1px solid; max-width: 90px; margin-left: 4px; padding-left: 10px; padding-right: 10px; transition: ease 0.3s; border-radius: 4px;',
                );

                if (check) {
                    const titleReplace = `<u>${elementOnTest.innerText}</u>`;
                    const modifiedTitle = question?.title?.en_US
                        .replace(/{|}/g, '')
                        .replace(titleReplace, `${inputElement.outerHTML}`);
                    setTitleOnTest(modifiedTitle);
                }
            }
        }
    };

    question.suggestedAnswers = (question.suggestedAnswers! as Answer[]).sort(asc);

    return !isCorrectingQuestion ? (
        <>
            <RadioGroup
                onChange={(e) => {
                    setAnswer({
                        questionId: question.questionId,
                        value: e.target.value,
                    });
                }}
                className="flex"
            >
                {(question.suggestedAnswers as Answer[]).map((answer, aindex) => {
                    return (
                        <div key={aindex} className="flex flex-row items-center mb-2">
                            <Radio
                                checked={stateValue.find((id: number) => id == answer.id) != undefined}
                                onChange={(e) => {
                                    if (question.suggestedAnswers) {
                                        const suggestAns = question.suggestedAnswers as Answer[];
                                        const userAns = suggestAns.find((ans) => ans.id.toString() === e.target.value);
                                        const newValue: object = { [question.questionId]: userAns?.value.en_US };
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
                                    }
                                    const element = e.target as HTMLInputElement;
                                    setAnswers({
                                        questionId: question.questionId,
                                        value: [Number(element.value)],
                                        accessToken: state.answers.accessToken,
                                        answerToken: state.answers.answerToken,
                                        questionType: question.questionType,
                                    });
                                }}
                                value={answer.id}
                                name={question.questionId + ''}
                                color="success"
                                disabled={disable}
                            />
                            <p className="ml-3 pr-4 text-left mb-0">{answer.value.en_US}</p>
                        </div>
                    );
                })}
            </RadioGroup>
        </>
    ) : (
        <>
            {(question.suggestedAnswers as Answer[]).map((answer, aindex) => {
                GlobalVariable.getInstance().setQuestionToCorrect(answer.id, answer.value.en_US);
                return <div key={aindex}></div>;
            })}
            <div
                className="rounded-xl w-full h-fit flex text-left items-center flex-row mr-4 "
                id={`id-${question.questionId}`}
            >
                <div
                    className={`bg-green-600 ${
                        getAnswersLocal[question.questionId]?.label.length > 2 ? 'w-[50px] h-[30px]' : 'w-7 h-7'
                    } 
                        mb-0 rounded-full text-white ${style['round-index']}`}
                >
                    {getAnswersLocal[question.questionId]?.label}
                </div>

                <div
                    className="w-fit h-fit [&>*]:mb-0 ml-4"
                    dangerouslySetInnerHTML={{ __html: titleOnTest }}
                    onClick={handleClickOnUTag}
                />
            </div>
        </>
    );
};
