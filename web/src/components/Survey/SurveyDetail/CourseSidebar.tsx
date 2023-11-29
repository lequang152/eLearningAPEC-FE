import axios from "axios"
import Image from "next/image"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import { AuthenticationUserState } from "../../../constants/AuthenticationState"
import checkTimer from "../../../utils/check_timer"
import { makeErrorToast } from "../../../utils/toast"
import { ConfirmModal } from "../../Elements/Models/ConfirmModal"
import { api, startExam } from "../../../utils/api_call"
import { LocalStorageService, SURVEY_INPUT_KEY } from "../../../utils/local_survey"
import Spinner from "../../Elements/Spinner/Spinner"
import GlobalVariable from "../../../utils/GlobalVariable"
import { SurveyExceptionCode } from "../../../constants/exception"
import { AppDispatch } from "../../../redux/store"
import { ApiService } from "../../../utils/api_service"
import { useDispatch } from "react-redux"
import { logOut, refreshUnexpriredToken } from "../../../redux/Slice/Auth/authSlice"
import clearLocal from "../../Layout/Header/BurgerMenus"

interface pageProps {
    currentSurvey: any
    userInfo: AuthenticationUserState
    idSurveyDetails?: string
}

const CourseSidebar: React.FC<pageProps> = ({ currentSurvey, userInfo, idSurveyDetails }) => {
    const router = useRouter()
    const [isShow, setIsShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [inputFromLocal, setInputFromLocal] = useState<any>({})
    const GlobalVariableInstance = GlobalVariable.getInstance()
    const dispatch = useDispatch<AppDispatch>()

    const startExamSuccess = (res: any, accessToken: string, answerToken?: string, examCode?: string) => {
        const data = res.data
        const _answerToken = data.answerToken

        let userAnswers: any = {}

        if (!data.userAnswerData || data.userAnswerData.answers === undefined) {
            const keys = Object.keys(data.initialData)
            for (let i = 0; i < keys.length; i++) {
                if (data.initialData[keys[i]]) {
                    userAnswers = {
                        ...userAnswers,
                        ...data.initialData[keys[i]].questions,
                    }
                }
            }
        } else userAnswers = data.userAnswerData.answers

        const local = LocalStorageService.getLocalStorageInstance()
        const newState = {
            accessToken: accessToken,
            answerToken: _answerToken,
            answers: data.questions,
        }
        local.set([accessToken, data.answerToken], "answers", newState)
        data.questions = undefined
        const localData = local.get([SURVEY_INPUT_KEY])
        local.set([], SURVEY_INPUT_KEY, {
            ...localData,
            ...res.data,
            userAnswerData: undefined,
            examCode: examCode,
        })

        if (data && data.userAnswerData) {
            local.set([accessToken], data.answerToken, {
                answers: {
                    accessToken: accessToken,
                    answerToken: data.answerToken,
                    answers: userAnswers,
                },
                audio: data.userAnswerData.audio,
            })
        } else if (!data.userAnswerData) {
            local.set([accessToken], data.answerToken, {
                answers: {
                    accessToken: accessToken,
                    answerToken: data.answerToken,
                    answers: userAnswers,
                },
                audio: {},
            })
        }

        router.push(`/survey/full-test/${data?.accessToken}/${data?.answerToken}`)
    }

    useEffect(() => {
        const local = LocalStorageService.getLocalStorageInstance()
        setInputFromLocal(local.get([SURVEY_INPUT_KEY]))
    }, [])
    const handleStartTest = (accessToken: string, answerToken?: string, examCode?: string) => {
        if (accessToken && isLoading == false) {
            setIsLoading(true)

            startExam(accessToken, answerToken, examCode)
                .then((res) => {
                    startExamSuccess(res, accessToken, answerToken, examCode)
                })
                .catch((err: any) => {
                    if (err.response.status === 401) {
                        dispatch(refreshUnexpriredToken()).then(async (originalPromiseResult: any) => {
                            if (originalPromiseResult.type === "auth/refreshToken/fulfilled") {
                                startExam(accessToken, answerToken, examCode)
                                    .then((res) => {
                                        startExamSuccess(res, accessToken, answerToken, examCode)
                                    })
                                    .catch((err: any) => {
                                        localStorage.clear()
                                        dispatch(logOut())

                                        makeErrorToast("Error, please login again!")
                                        router.push("/sign-in")
                                    })
                                    .finally(() => {
                                        setIsLoading(false)
                                        setIsShow(false)
                                    })
                            }
                            if (originalPromiseResult.type === "auth/refreshToken/rejected") {
                                makeErrorToast("Error, please login again!")
                                localStorage.clear()
                                dispatch(logOut())

                                router.push("/sign-in")
                            }
                        })
                    } else {
                        const local = LocalStorageService.getLocalStorageInstance()
                        const localData = local.get([SURVEY_INPUT_KEY])
                        const newData = {
                            ...localData,
                            answerToken: undefined,
                        }
                        local.set([], SURVEY_INPUT_KEY, newData)
                        setInputFromLocal(newData)
                        makeErrorToast("Error, please try again!")
                    }
                })
                .finally(() => {
                    setIsLoading(false)
                    setIsShow(false)
                })
        }
    }
    const closeModal = () => {
        setIsShow(false)
    }
    const handleCreateInputExam = async () => {
        setIsShow(true)
    }
    return (
        <>
            {isLoading && <Spinner />}
            {isShow && (
                <ConfirmModal
                    header="Warning"
                    message={`${inputFromLocal.answerToken ? "Continue this test?" : "Are you ready for the Test ?"}`}
                    handleSubmit={(code) => {
                        handleStartTest(
                            inputFromLocal.accessToken,
                            inputFromLocal.answerToken,
                            code || inputFromLocal.examCode
                        )
                        GlobalVariableInstance.removeQuestionID()
                        GlobalVariableInstance.removeTotalQuestions()
                        GlobalVariableInstance.removeAnswers()
                        GlobalVariableInstance.removePageData()
                    }}
                    handleClose={() => closeModal()}
                    useInputBox={inputFromLocal.answerToken ? false : true}
                    inputBoxLabel="Exam code (optional)"
                />
            )}
            <div className="course__sidebar pl-70 p-relative">
                <div className="course__shape">
                    <Image
                        width={70}
                        height={110}
                        className="course-dot"
                        src="/assets/img/course/course-dot.png"
                        alt="img not found"
                    />
                </div>
                <div className="course__sidebar-widget-2 white-bg mb-20">
                    <div className="course__video">
                        <div className="course__video-content mb-9">
                            <ul>
                                {currentSurvey.timeLimit && (
                                    <li className="d-flex align-items-center">
                                        <div className="course__video-icon">
                                            <i className="fas fa-clock"></i>
                                        </div>
                                        <div className="course__video-info">
                                            <h5>
                                                <span>Duration:</span>
                                                {currentSurvey.isTimeLimited
                                                    ? currentSurvey.timeLimit + " minutes"
                                                    : "No limit"}
                                            </h5>
                                        </div>
                                    </li>
                                )}

                                <li className="d-flex align-items-center">
                                    <div className="course__video-icon">
                                        <i className="fas fa-globe"></i>
                                    </div>
                                    <div className="course__video-info">
                                        <h5>
                                            <span>Language:</span>English
                                        </h5>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div className="course__enroll-btn">
                            <div
                                className="e-btn e-btn-7 w-100 cursor-pointer transition"
                                onClick={() => handleCreateInputExam()}
                            >
                                {inputFromLocal.answerToken ? "Continue" : "Start Exam"}
                                <i className="fas fa-arrow-right"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CourseSidebar

// handleCreateInputExam(currentSurvey.accessToken)
