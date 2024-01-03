import { SurveyQuestionType } from '../../../../constants/QuestionType';
import { Question } from '../../../../constants/question.types';
import { LocalAnswerExam } from '../../../../hook/useLocalAnswerExam';
import AudioQuestion from '../../ListeningTest/AudioSection/AudioQuestion';
import { ReadingQuestion } from '../../ReadingTest/ReadingQuestion';

export type SpecQuestionProps = {
    question: Question;
    accessToken: string;
    answerToken: string;
};

export function SpecQuestionFactory(question: Question, accessToken: string, answerToken: string) {
    switch (question.questionType) {
        case SurveyQuestionType.AUDIO:
            const regularEx = question.audioFilename?.match(/\/file\/d\/(.+?)\/(view|\?usp=sharing|$)/);
            const fileId = regularEx ? regularEx[1] : null;
            const getAudioFileName = `https://drive.google.com/uc?export=download&id=${fileId}`;
            return (
                <AudioQuestion
                    accessToken={accessToken}
                    answerToken={answerToken}
                    question={question}
                    audio={new Audio(getAudioFileName!)}
                />
            );
        case SurveyQuestionType.ONLY_TITLE:
            return (
                <ReadingQuestion
                    // accessToken={accessToken}
                    // answerToken={answerToken}
                    question={question}
                />
            );
    }
}
