import { use, useEffect, useRef, useState } from "react"
import { QuestionProps } from "../../../../constants/props"

import axios, { AxiosHeaders } from "axios"
import { useSelector } from "react-redux"
import { userAuthSelector } from "../../../../redux/Selector/userAuthorSelector"
import { makeErrorToast } from "../../../../utils/toast"
import AudioTag, { LocalAudioData } from "../Audio/Audio"
import { request } from "http"
import React from "react"
import { SpecQuestionProps } from "../../FullTest/Factory/SpecQuestionFactory"
import { LocalStorageService } from "../../../../utils/local_survey"
import { ApiService } from "../../../../utils/api_service"

const AudioQuestion = (
    {
        question,
        answerToken,
        accessToken,
        audio,
    }: SpecQuestionProps & {
        audio: HTMLAudioElement
    } // audio,
) => {
    const useInfoRedux = useSelector(userAuthSelector)
    const [showErr, setShowErr] = useState({
        bool: false,
    })

    const local = LocalStorageService.getLocalStorageInstance()

    const data: LocalAudioData = local.get([accessToken, answerToken, "audio", question.questionId + ""]) ?? {}

    data.requests = data.requests || 0

    async function onPlayAudio(audio: HTMLAudioElement, id: number) {
        try {
            const service = new ApiService()
            service.setAccessToken(accessToken)
            service.setAnswerToken(answerToken)

            const header = {
                Authorization: `Bearer ${useInfoRedux.token}`
            }
            const getAudio = await service.getAudioQuestion(id, header)
            
            const data: LocalAudioData = local.get([accessToken, answerToken, "audio", question.questionId + ""]) || {}

            data.requests = getAudio.data[question.questionId].requests
            local.set([accessToken, answerToken, "audio"], question.questionId + "", data)

            setShowErr({
                bool: false,
            })
        } catch (error: any) {
            audio.pause()
            setShowErr({
                bool: true,
            })
            makeErrorToast("Your time limit to play this audio is exceeded!", "bottom-right")
            throw {}
        }
    }

    return (
        <>
            {/* <Player src={question.audioFilename!} /> */}
            <div
                className="text-center mb-4"
                dangerouslySetInnerHTML={{ __html: question.title.en_US }}
            />
            {/* <div className="text-center">
                <p className="text-red-400 font-bold italic">
                    You have{" "}
                    <span className="text-green-1 font-bold ">{question.limitListeningTimes - data.requests}</span>{" "}
                    times left to listen to this record.
                </p>
                <span className="text-red-400 italic">
                    You will not be able to listen again if you run out of listens
                </span>
            </div> */}
            <div className="flex justify-center items-center flex-col flex-1">
                <AudioTag
                    src={question.audioFilename!}
                    onPlay={() => {
                        return onPlayAudio(audio, question.questionId)
                    }}
                    id={question.questionId}
                    audio={audio}
                    answerToken={answerToken}
                    accessToken={accessToken}
                />
            </div>
        </>
    )
}

export default AudioQuestion
