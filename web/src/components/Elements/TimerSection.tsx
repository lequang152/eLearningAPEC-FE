import React, { useEffect, useState } from "react"
import checkTimer from "../../utils/check_timer"
import { useDispatch, useSelector } from "react-redux"
import { userAuthSelector } from "../../redux/Selector/userAuthorSelector"
import { LocalStorageService } from "../../utils/local_survey"
import { useParams, useRouter } from "next/navigation"
import { handleSubmit } from "../../utils/api_call"
import GlobaleVariable from "../../utils/GlobalVariable"
import { AppDispatch } from "../../redux/store"
import { logOut } from "../../redux/Slice/Auth/authSlice"
import { Popover, ArrowContainer  } from 'react-tiny-popover'

interface Props {
    startTime: any
    timeLimit: number
}

const TimerSection: React.FC<Props> = ({ startTime, timeLimit }: Props) => {
    const time = checkTimer(new Date(startTime), timeLimit)
    
    const userInfo = useSelector(userAuthSelector)
    const userLocal = JSON.parse(localStorage.getItem("session") || "{}")
    const router = useRouter()
    const params = useParams()
    const [minutes, setMinutes] = useState(time.timeLeft.minute)
    const [seconds, setSeconds] = useState(time.timeLeft.second)
    const [isTimeout, setIsTimeout] = useState(false)
    const [isSubmit, setIsSubmit] = useState(false)
    const GlobaleVariableInstance = GlobaleVariable.getInstance();
    const dispatch = useDispatch<AppDispatch>()
    const [popover, setPopover] = useState(false)

    useEffect(() => {
        const onVisibilityChange = () => {
            if (!document.hidden) {
                const time = checkTimer(new Date(startTime), timeLimit)
                if (time.hasExpired) {
                    setMinutes(0)
                    setSeconds(0)
                } else {
                    setMinutes(time.timeLeft.minute)
                    setSeconds(time.timeLeft.second)
                }
            }
        }

        document.onvisibilitychange = onVisibilityChange

        let myInterval = setInterval(() => {
            setSeconds((pre) => {
                if (pre > 0) {
                    return pre - 1
                }

                setMinutes((preMin) => {
                    if (preMin == 0) {
                        setIsTimeout(true)
                        clearInterval(myInterval)
                        // auto submit here
                        const local = LocalStorageService.getLocalStorageInstance()
                        const accessToken = params.slug[0]
                        const answerToken = params.slug[1]
                        const answer = local.get([accessToken, answerToken, "answers"])
                        handleSubmit({
                            state: answer,
                            userInfo,
                            userLocal,
                            onSubmitSuccess: () => {
                                router.push("/survey/survey-list")
                            },
                            onSubmitDone() {
                                clearInterval(myInterval)
                            },
                            onBeginSubmit() {
                                GlobaleVariableInstance.setTimeDoTest(timeLimit*60*1000)
                            },
                            onError: () => {
                                router.push("/survey/survey-list")
                            },
                            signOut: () => {
                                dispatch(logOut())
                                router.push("/sign-in")
                                
                            }
                        })
                        return 0
                    }   
                    return preMin - 1
                })
                return pre >= 0 ? 59 : 0
            })
        }, 1000)
        return () => {
            document.removeEventListener("visibilitychange", onVisibilityChange)
        }
    }, [])

    useEffect(() => {
        if (minutes === 1 && seconds === 0) {
            setPopover(true);
            const audio = new Audio("/assets/sound/notification.mp3");
            audio.play();
        }
    }, [minutes, seconds]);

    return (
        <React.Fragment>
            {isTimeout ? (
                <p className="text-red-500 mb-0 font-bold">Time out</p>
            ) : (
                    <Popover
                        containerStyle={{
                            zIndex: "99",
                        }}
                        isOpen={popover}
                        positions={"bottom"} 
                        onClickOutside={() => setPopover(false)}
                        content={({ position, childRect, popoverRect }) => (
                            <ArrowContainer 
                              position={position}
                              childRect={childRect}
                              popoverRect={popoverRect}
                              arrowColor={'#00ab6b'}
                              arrowSize={10}
                              className='popover-arrow-container'
                              arrowClassName='popover-arrow'
                            >
                              <div
                                style={{ backgroundColor: '#00ab6b', color: "white", padding: 4 }}
                              >
                                Hurry up! Only one minute left!
                              </div>
                            </ArrowContainer>
                          )}
                        >
                    
                        <div className="text-yellow-500">
                            {" "}
                            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                        </div>
                    </Popover>
            )}
        </React.Fragment>
    )
}

export default React.memo(TimerSection)
