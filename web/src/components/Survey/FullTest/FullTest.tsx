"use client"
import axios, { AxiosHeaders } from "axios"
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react"
import { SplitPane } from "react-collapse-pane"
import { useSelector } from "react-redux"
import { SurveyQuestionType } from "../../../constants/QuestionType"
import { SurveyExceptionCode } from "../../../constants/exception"
import { Question } from "../../../constants/question.types"
import { AnswerState, useLocalAnswerExam } from "../../../hook/useLocalAnswerExam"
import { userAuthSelector } from "../../../redux/Selector/userAuthorSelector"
import { handleSubmit } from "../../../utils/api_call"
import { LocalStorageService, SURVEY_INPUT_KEY } from "../../../utils/local_survey"
import ErrorMain from "../../Elements/Error/ErrorMain"
import { ConfirmModal } from "../../Elements/Models/ConfirmModal"
import Spinner from "../../Elements/Spinner/Spinner"
import TextSelection from "../../Elements/TextSelection"
import FooterTest from "../../Layout/Footer/FooterOnTest"
import HeaderTest from "../../Layout/Header/HeaderOnTest"
import PannelLeft from "./PannelLeft"
import PannelRight from "./PannelRight"
import css from '@emotion/styled'
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import GlobalVariable from "../../../utils/GlobalVariable"
import { ApiService } from "../../../utils/api_service"
import { useQueryState } from 'next-usequerystate'

type ErrorState = {
    err: boolean
    message: string | undefined
}
export function asc(x: Question, y: Question): number {
    if (x.sequence > y.sequence) {
        return 1
    }
    if (x.sequence < y.sequence) {
        return -1
    }
    if (x.sequence == y.sequence) {
        if (x.questionId > y.questionId) return 1
        if (x.questionId < y.questionId) return -1
    }
    return 0
}


const FullTest: React.FC<any> = ({ params }) => {
    const belongTo = {
        accessToken: params.slug[0],
        answerToken: params.slug[1],
    }
    const [mounted, setMounted] = useState(false)
    const state = useLocalAnswerExam(belongTo, {
        ...belongTo,
        answers: {}
    })
    const [jsonSurvey, setJsonSurvey] = useState<any>(null)
    const [paginateData, setPaginateData] = useState<{
        hasNextPage: boolean
        currentPage: number
        totalRecord: number
    }>(null!)
    const router = useRouter()
    
    const [pageNumber, setPageNumber] = useQueryState('page')
    const searchParams = useSearchParams()
   
    let initialPage: string = "1"
    if(searchParams.get("page")) {
        initialPage = String(searchParams.get("page"))
    } 
  
    const [page, setPage] = useState(parseInt(initialPage))
    const [currentInput, setCurrentInput] = useState<any>(null!)
    const [specialQuestion, setSpecialQuestion] = useState<Question[]>([])
    const [normalQuestion, setNormalQuestion] = useState<Question[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [windowWidth, setWindowWidth] = useState(0)

    const [isError, setIsError] = useState<ErrorState>({
        err: false,
        message: undefined,
    })

    const userInfo = useSelector(userAuthSelector)
    if (!params.slug || !params.slug[0] || !params.slug[1]) {
        return (
            <ConfirmModal
                header="Params not found!"
                message="This happends when you are mispassing some args to url."
                handleSubmit={() => {
                    return
                }}
            />
        )
    }
    const handleResize = () => {
        setWindowWidth(window.innerWidth)
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const local = LocalStorageService.getLocalStorageInstance()

        const header = {
            Authorization: `Bearer ${localStorage.getItem("TOKEN")}`
        }
        const getFullTestQuestions = ApiService.getFullTestQuestions(params.slug[0], params.slug[1], page, header)
       
        getFullTestQuestions
            .then((res) => {
                
                GlobalVariable.getInstance().setScoringType(res.data?.scoringType)
                let data = res.data.data.pages

                if (data.length == 0) {
                    setJsonSurvey(null)
                    setNormalQuestion([])
                    setSpecialQuestion([])
                    return
                }
                data = data[0]
                const sepcQuest: Question[] = []
                const norQuest: Question[] = []

                for (let item of data.questions as Question[]) {
                    if (
                        [SurveyQuestionType.ONLY_TITLE, SurveyQuestionType.AUDIO].includes(
                            item.questionType as SurveyQuestionType
                        ) &&
                        !item.isSubHeading
                    ) {
                        sepcQuest.push(item)
                    } else {
                        norQuest.push(item)
                    }
                }
                const input = local.get([SURVEY_INPUT_KEY])

                setCurrentInput(input)
                setJsonSurvey(data || [])

                setNormalQuestion(norQuest.sort(asc) || [])
                setSpecialQuestion(sepcQuest.sort(asc) || [])
                setPaginateData({
                    currentPage: res.data.data.currentPage,
                    hasNextPage: res.data.data.hasNextPage,
                    totalRecord: res.data.data.totalRecord,
                })
                setPageNumber(page.toString())                
            })
            .catch((err) => {
                setIsError(() => {
                    const scode = err.response?.data.scode
                    if (scode == SurveyExceptionCode.TOKEN_EXPIRED || scode == SurveyExceptionCode.CLOSED) {
                        // make new Thread
                        setTimeout(() => {
                            const input = local.get([SURVEY_INPUT_KEY])
                            if (input && input.accessToken && input.answerToken) {
                                // first : auto submit user's answer if it is present in local storage:
                                const userLocal = JSON.parse(localStorage.getItem("session") || "{}")

                                const userAnswer = local.get([input.accessToken, input.answerToken, "answers"])

                                handleSubmit({
                                    state: userAnswer as AnswerState,
                                    userInfo,
                                    userLocal,
                                    onBeginSubmit: () => {
                                        
                                        setIsError({
                                            err: true,
                                            message: "Auto submitting...",
                                        })
                                    },
                                    onSubmitDone: () => {
                                        // remove local data
                                        local.remove([input.accessToken], input.answerToken)
                                        input.answerToken = undefined
                                        local.set([], SURVEY_INPUT_KEY, input)
                                        router.push("/")
                                    },
                                    onSubmitSuccess: () => {
                                        GlobalVariable.getInstance().setIsSubmitted(true)
                                        router.push(`/survey/full-test/${params}/review`)
                                    },
                                    onError: () => {},
                                    signOut: () => {
                                        
                                    }
                                })
                            }
                        }, 500)
                    }
                    return {
                        err: true,
                        message: err.response.data.message || undefined,
                    }
                })
            })
            .finally(() => {
                setIsLoading(false)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])


    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        setMounted(true)
        handleResize()
        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    return (
        <>
        
            {isLoading && <Spinner />}
            {isError.err ? (
                <ErrorMain message={isError.message} />
            ) : (
                jsonSurvey && (
                    <div className=" flex flex-col justify-between h-screen overflow-hidden">
                        {mounted && <TextSelection />} 
                        <HeaderTest 
                            params={params.slug[1]}
                            state={state} 
                            timeLimit={{
                                isTimeLimit: currentInput.isTimeLimited,
                                timeLimit: currentInput.timeLimit,
                                startDateTime: currentInput.startDateTime,
                            }}
                            hasNextPage={paginateData.hasNextPage}
                        />
                        {
                            specialQuestion.length === 0 ? 
                            (
                                <div className="fulltest__section w-full h-4/6 flex-grow flex  item justify-center relative">
                                    <PannelRight
                                    questions={normalQuestion}
                                    state={state}
                                    isExpand={specialQuestion.length == 0}
                                    hasPanelLeft={false}
                                    />
                                </div>
                                
                            ) : (
                                <div className="fulltest__section w-full h-4/6 flex-grow flex lg:flex-row md:flex-col flex-col item justify-center relative">
                            
                                    <SplitPane 
                                        split={windowWidth < 821 ? "horizontal" : "vertical"}
                                        collapse={true}
                                    >
                                        
                                        <PannelLeft
                                            page={page}
                                            setPage={setPage}
                                            questions={specialQuestion}
                                            accessToken={state.answers.accessToken}
                                            answerToken={state.answers.answerToken}
                                            title={""}
                                        />
                                        <PannelRight
                                            questions={normalQuestion}
                                            state={state}
                                            isExpand={specialQuestion.length == 0}
                                            hasPanelLeft={true}
                                        />
                                    </SplitPane>
                                    
                                </div>
                            )
                            
                        }
                        
                        {/* </SplitPane> */}
                        <FooterTest
                            state={state}
                            hasNextPage={paginateData.hasNextPage}
                            currentPage={paginateData.currentPage}
                            setPage={setPage}
                            param={params.slug}
                        />
                    </div>
                )
            )}
        </>
    )
}

export default FullTest
