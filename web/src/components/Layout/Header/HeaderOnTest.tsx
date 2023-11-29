"use client"
import SendOutlinedIcon from "@mui/icons-material/SendOutlined"
import axios from "axios"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { ReactElement, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AnswerState, LocalAnswerExam } from "../../../hook/useLocalAnswerExam"
import { userAuthSelector } from "../../../redux/Selector/userAuthorSelector"
import { postToS3AWS } from "../../../utils/post_speak_s3"
import { makeErrorToast, makeSuccessToast } from "../../../utils/toast"
import { ConfirmModal } from "../../Elements/Models/ConfirmModal"
import Spinner from "../../Elements/Spinner/Spinner"
import { LocalStorageService, SURVEY_INPUT_KEY, SURVEY_KEY } from "../../../utils/local_survey"
import { type } from "os"
import { handleSubmit } from "../../../utils/api_call"
import TimerSection from "../../Elements/TimerSection"
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined"
import { Button } from "@mui/base"
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch"
import "react-responsive-modal/styles.css"
import { Modal } from "react-responsive-modal"
import { Table } from "react-bootstrap"
import GlobalVariable from "../../../utils/GlobalVariable"
import { useWindowWidth } from "@react-hook/window-size"
import { AppDispatch } from "../../../redux/store"
import { logOut } from "../../../redux/Slice/Auth/authSlice"

type HeaderTestProps = {
    params: any
    state: LocalAnswerExam
    timeLimit?: {
        isTimeLimit: number
        timeLimit: number
        startDateTime: number
    }
    hasNextPage: boolean
}

const HeaderTest = ({ params, state, timeLimit, hasNextPage }: HeaderTestProps) => {
    const userInfo = useSelector(userAuthSelector)
    const userLocal = JSON.parse(localStorage.getItem("session") || "{}")
    const [popUp, setPopUp] = useState(false)
    const [popUpHome, setPopUpHome] = useState(false)
    const router = useRouter()
    const [showModal, setShowModal] = useState(false)
    const modalStyle = {
        modal: {
            maxWidth: "100%",
            borderRadius: "10px",
        },
    }
    const [logo, setLogo] = useState<ReactElement>()

    const [numColumns, setNumColumns] = useState(8)
    const windowWidth = useWindowWidth()

    useEffect(() => {
        if (windowWidth >= 1115) {
            setNumColumns(8)
        } else if (windowWidth < 1115 && windowWidth >= 980) {
            setNumColumns(6)
        } else if (windowWidth < 980 && windowWidth >= 670) {
            setNumColumns(4)
        } else if (windowWidth < 670 && windowWidth >= 530) {
            setNumColumns(3)
        } else if (windowWidth < 530 && windowWidth >= 420) {
            setNumColumns(2)
        } else {
            setNumColumns(1)
        }

        if (windowWidth >= 500) {
            setLogo(
                <Image
                    width={500}
                    height={64}
                    src="/assets/img/logo/odin-logo-login.png"
                    alt="logo"
                    style={{ height: "100%", width: "auto" }}
                />
            )
        } else {
            setLogo(
                <Image
                    width={500}
                    height={64}
                    src="/assets/img/logo/odin-logo-square.png"
                    alt="logo"
                    style={{ height: "100%", width: "auto" }}
                />
            )
        }
    }, [windowWidth])

    //answer from localstorage
    const getLocalStorage = JSON.parse(localStorage.getItem("survey") || "{}")
    const accessToken = getLocalStorage.current_input?.accessToken
    const answerToken = getLocalStorage.current_input?.answerToken
    const getAnswersLocal = getLocalStorage[accessToken][answerToken]?.answers.answers

    const GlobalVariableInstance = GlobalVariable.getInstance()
    const getTotalQuestions = GlobalVariableInstance.getTotalQuestions()
    getTotalQuestions.sort()

    useEffect(() => {
        const currentInput = getLocalStorage.current_input
        if (currentInput) {
            const initData = currentInput?.initialData
            const objects: { [key: string]: any } = initData
            let sortedObjectsArray = []

            const sortedObjects = Object.entries(objects).sort((a, b) => a[1].sequence - b[1].sequence)
            sortedObjectsArray = sortedObjects.map(([key, value]) => ({ [key]: value }))
            GlobalVariableInstance.setPagesData(sortedObjectsArray)
        }
    }, [])

    const userAnswer = JSON.parse(localStorage.getItem("answerOnTest") || "{}")

    GlobalVariableInstance.setIsSubmitted(false)
    GlobalVariableInstance.setTimeLimit(timeLimit?.timeLimit || 0)

    const [isSubmit, setIsSubmit] = useState(false)

    const onClickSubmit = async () => {
        setPopUp(true)
    }
    const handleClosePopUp = async () => {
        setPopUp(false)
    }
    const handleClosePopUpHome = async () => {
        setPopUpHome(false)
    }

    const dispatch = useDispatch<AppDispatch>()

    return isSubmit ? (
        <Spinner />
    ) : (
        <React.Fragment>
            {popUp && (
                <ConfirmModal
                    header="Submit your exam."
                    message="Are you sure to submit this exam?"
                    handleClose={handleClosePopUp}
                    handleSubmit={() => {
                        handleSubmit({
                            state: state.answers,
                            userInfo,
                            userLocal,
                            onBeginSubmit: () => {
                                setIsSubmit(true)
                                setPopUp(false)

                                GlobalVariableInstance.setAnswers(getAnswersLocal)
                                const getTime = getLocalStorage.current_input.startDateTime

                                const timeDoTest = new Date().getTime() - new Date(getTime).getTime()

                                GlobalVariableInstance.setTimeDoTest(timeDoTest)

                                GlobalVariableInstance.setAnswers(getAnswersLocal)
                            },
                            onSubmitDone: () => {
                                setPopUp(false)
                                // setIsSubmit(false)
                                localStorage.removeItem("answerOnTest")
                            },
                            onSubmitSuccess: () => {
                                GlobalVariableInstance.setIsSubmitted(true)
                                router.push(`/survey/full-test/${params}/review`)
                            },
                            onError: () => {
                                setIsSubmit(false)
                                GlobalVariableInstance.setIsSubmitted(false)
                            },
                            signOut: () => {
                                dispatch(logOut())
                                router.push("/sign-in")
                                localStorage.removeItem("USER")
                                localStorage.removeItem("session")
                            },
                        })
                    }}
                />
            )}

            {popUpHome && (
                <ConfirmModal
                    header="Do you want to return to home page?"
                    message="Some changes may be lost."
                    handleClose={handleClosePopUpHome}
                    handleSubmit={() => router.push("/")}
                />
            )}
            <div
                className={`z-30 px-4 py-3 bg-[#005e12] w-screen h-16  flex flex-row items-center box-border justify-between`}
            >
                <Link
                    href=""
                    className={`h-[100px] logoOdin:h-full w-auto`}
                    onClick={() => setPopUpHome(true)}
                >
                    {logo}
                </Link>
                {timeLimit?.isTimeLimit && (
                    <div
                        className={`text-3xl ${windowWidth < 600 && windowWidth > 400 ? "text-lg" : ""} 
                    ${windowWidth < 400 ? "text-sm" : ""}  gap-2 flex flex-row items-center justify-center`}
                    >
                        <TimerOutlinedIcon className="text-yellow-500" />
                        <TimerSection
                            startTime={timeLimit.startDateTime}
                            timeLimit={timeLimit.timeLimit}
                        />
                    </div>
                )}
                <div className="text-white flex">
                    {/* Review Answer */}
                    <Button
                        className={"px-2 bg-yellow-500 text-slate-950 mr-3 rounded"}
                        onClick={() => setShowModal(true)}
                    >
                        <ContentPasteSearchIcon />
                    </Button>
                    <div className="rounded">
                        <Modal
                            styles={modalStyle}
                            open={showModal}
                            onClose={() => setShowModal(false)}
                            center
                        >
                            <h3 className="mt-4 text-center text-[#294563]">Review your answers</h3>
                            {GlobalVariableInstance.getPagesData().map((data, index) => {
                                const dataSection = data[Object.keys(data)[0]]
                                let textContent
                                const htmlString = dataSection.title?.en_US
                                if (htmlString) {
                                    const parser = new DOMParser()
                                    const document = parser.parseFromString(htmlString, "text/html")
                                    const pTextContent = document.querySelector("p")?.textContent
                                    if (!pTextContent) {
                                        const h3TextContent = document.querySelector("h3")?.textContent
                                        textContent = h3TextContent?.toUpperCase()
                                    } else textContent = pTextContent?.toUpperCase()
                                }
                                const questions: any[] = []
                                const keys = Object.keys(dataSection?.questions)
                                for (let i = 0; i < keys.length; i++) {
                                    questions.push({ [keys[i]]: dataSection?.questions[keys[i]] })
                                }

                                questions.sort((a, b) => {
                                    const keysA = Object.keys(a)
                                    const keysB = Object.keys(b)
                                    return a[keysA[0]].label - b[keysB[0]].label
                                })

                                return (
                                    <div key={index}>
                                        <div
                                            style={{
                                                wordWrap: "normal",
                                                color: "#294563",
                                                fontWeight: 600,
                                                border: "none",
                                            }}
                                        >
                                            {textContent}
                                        </div>
                                        <Table
                                            striped
                                            bordered
                                        >
                                            <tbody>
                                                {Array.from(
                                                    { length: Math.ceil(questions.length / numColumns) },
                                                    (_, rowIndex) => (
                                                        <tr key={rowIndex}>
                                                            {Array.from({ length: numColumns }, (_, colIndex) => {
                                                                const questionIndex = rowIndex * numColumns + colIndex
                                                                if (questionIndex < questions.length) {
                                                                    const question = questions[questionIndex]
                                                                    const id = Object.keys(question)[0]
                                                                    const label = question[id]?.label
                                                                    return (
                                                                        <td
                                                                            key={colIndex}
                                                                            style={{
                                                                                paddingRight: "50px",
                                                                                width: `${80 / numColumns}%`,
                                                                            }}
                                                                        >
                                                                            {`Q${label}: `}
                                                                            <span className="font-semibold">
                                                                                {`${
                                                                                    userAnswer[id] === undefined
                                                                                        ? ""
                                                                                        : userAnswer[id].length < 30
                                                                                        ? userAnswer[id]
                                                                                        : userAnswer[id].substring(
                                                                                              0,
                                                                                              30
                                                                                          ) + "..."
                                                                                }`}
                                                                            </span>
                                                                        </td>
                                                                    )
                                                                } else {
                                                                    return <td key={colIndex}></td>
                                                                }
                                                            })}
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </Table>
                                    </div>
                                )
                            })}
                        </Modal>
                    </div>

                    {/* Submit */}
                    <button
                        className={"mr-2 px-3 py-1 rounded bg-red-1 hover:bg-red-1/80 flex items-center"}
                        onClick={onClickSubmit}
                    >
                        Submit
                        <SendOutlinedIcon className="ml-3" />
                    </button>
                </div>
            </div>
        </React.Fragment>
    )
}

export default HeaderTest
