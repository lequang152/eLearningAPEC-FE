import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { QuestionProps } from '../../../constants/props';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import MicOffIcon from '@mui/icons-material/MicOff';
import { SurveyQuestionType } from '../../../constants/QuestionType';
import axios, { AxiosResponse } from 'axios';

const AudioRecorder = ({ question, state }: QuestionProps) => {
    const [audioBlob, setAudioBlob] = useState<null | Blob>(null);
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const [isRecordingStarted, setIsRecordingStarted] = useState<boolean>(false);
    const getLocalStorage = JSON.parse(localStorage.getItem('survey') || '{}');
    const accessToken = getLocalStorage?.current_input?.accessToken;
    const answerToken = getLocalStorage?.current_input?.answerToken;
    const answerOnTest = getLocalStorage[accessToken][answerToken];

    const { status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } = useReactMediaRecorder({
        audio: true,
        onStop: (blobUrl, blob) => {
            setAudioBlob(blob);
            //change blob to base 64 to save

            const convertBlobToBase64 = (blob: Blob) => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(blob);

                    reader.onloadend = function () {
                        if (reader.result) {
                            resolve(reader.result);
                        } else {
                            reject(new Error('Error converting blob to base64'));
                        }
                    };
                });
            };

            convertBlobToBase64(blob)
                .then((base64data) => {
                    state.setAnswers({
                        accessToken: state.answers.accessToken,
                        answerToken: state.answers.answerToken,
                        questionId: question.questionId,
                        questionType: SurveyQuestionType.RECORDING,
                        value: blobUrl,
                        blobValue: base64data,
                    });
                })
                .catch((error) => {
                    console.error(error);
                });
        },
    });

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (status === 'recording') {
            intervalId = setInterval(() => {
                setElapsedTime((prevElapsedTime) => prevElapsedTime + 1);
            }, 1000);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [status]);

    const formatTime = (timeInSeconds: number) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    };

    const handleStartRecording = () => {
        setIsRecordingStarted(true);
        startRecording();
    };

    const handleStopRecording = () => {
        setIsRecordingStarted(false);
        stopRecording();
    };

    // const handleClearRecording = () => {
    //   clearBlobUrl();
    //   setAudioBlob(null);
    //   setElapsedTime(0);
    // };

    return (
        <div id={`id-${question.questionId}`}>
            {status === 'idle' && (
                <div className="flex flex-col justify-center items-center">
                    <button
                        disabled={answerOnTest.answers?.answers[question.questionId]?.value !== ''}
                        className="bg-green-1 text-white p-3 rounded-full w-fit h-fit"
                        onClick={handleStartRecording}
                    >
                        <KeyboardVoiceIcon className="transition-colors ease-in-out" />
                    </button>
                    <p>Press to Record</p>
                </div>
            )}
            {status === 'recording' && (
                <div className="flex flex-col justify-center items-center">
                    <div className="font-medium mb-2">Recording: {formatTime(elapsedTime)}</div>
                    <button
                        className="bg-red-600 text-white p-3 rounded-full w-fit h-fit"
                        onClick={handleStopRecording}
                    >
                        <MicOffIcon className="absolute transition-colors ease-in-out animate-ping" />
                        <MicOffIcon className="relative transition-colors ease-in-out" />
                    </button>
                    <p>Press to Stop</p>
                </div>
            )}
            {status === 'stopped' && audioBlob && (
                <div className="flex flex-col justify-center items-center">
                    <audio controls src={mediaBlobUrl} />
                    <p className="mt-2">Recording time: {formatTime(elapsedTime)}</p>
                    {/* <button onClick={handleClearRecording}>Clear Recording</button> */}
                </div>
            )}
        </div>
    );
};

export default AudioRecorder;
