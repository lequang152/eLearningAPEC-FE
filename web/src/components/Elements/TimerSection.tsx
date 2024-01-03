import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import checkTimer from '../../utils/check_timer';
import { useDispatch, useSelector } from 'react-redux';
import { userAuthSelector } from '../../redux/Selector/userAuthorSelector';
import { LocalStorageService, SURVEY_INPUT_KEY } from '../../utils/local_survey';
import { useParams, useRouter } from 'next/navigation';
import { handleSubmit } from '../../utils/api_call';
import { AppDispatch } from '../../redux/store';
import { logOut } from '../../redux/Slice/Auth/authSlice';
import { Popover, ArrowContainer } from 'react-tiny-popover';
import GlobalVariable from '../../utils/GlobalVariable';

interface Props {
    startTime: any;
    deadline: any;
    setDisablePage: (value: any) => void;
    setChangeSection: (value: any) => void;
}

const TimerSection: React.FC<Props> = ({ startTime, deadline, setDisablePage, setChangeSection }: Props) => {
    const timeLimitInMilliseconds = new Date(deadline.timeLimit).getTime() - new Date().getTime();
    const minutesLimit = Math.floor(timeLimitInMilliseconds / (1000 * 60));
    const secondsLimit = Math.floor((timeLimitInMilliseconds % (1000 * 60)) / 1000);
    const [minutes, setMinutes] = useState(!isNaN(minutesLimit) ? minutesLimit : 0);
    const [seconds, setSeconds] = useState(!isNaN(secondsLimit) ? secondsLimit : 0);

    const userInfo = useSelector(userAuthSelector);
    const userLocal = JSON.parse(localStorage.getItem('session') || '{}');
    const router = useRouter();
    const params = useParams();

    const [timeOutSection, setTimeOutSection] = useState<any>({});

    const GlobalVariableInstance = GlobalVariable.getInstance();
    const dispatch = useDispatch<AppDispatch>();
    const [popover, setPopover] = useState(false);
    // const [startSection, setStartSection] = useState<any>(() => {
    //   if (typeof window !== 'undefined' && window.localStorage) {
    //     if(JSON.parse(localStorage.getItem('pagesCount') || '{}').startSection)
    //       {
    //         return JSON.parse(localStorage.getItem('pagesCount') || '{}').startSection
    //       }
    //   }
    //   return {[1]: startTime}
    // });

    const getLocalStorage = JSON.parse(localStorage.getItem('survey') || '{}');
    const accessToken = getLocalStorage.current_input?.accessToken;
    const answerToken = getLocalStorage.current_input?.answerToken;
    const getAnswersLocal = answerToken ? getLocalStorage[accessToken][answerToken]?.answers.answers : {};

    const intervalRef = useRef<number | null>(null);

    // const [counts, setCounts] = useState<number[]>(() => {
    //   if (typeof window !== 'undefined' && window.localStorage) {
    //     const storedPages: any = JSON.parse(localStorage.getItem('pagesCount') || '{}');
    //     const storedCounts: any[] = storedPages.count
    //     return Array.isArray(storedCounts) ? storedCounts : [];
    //   }
    //   return [];
    // });

    // const countsRef = useRef<number[]>(counts);

    // useEffect(() => {
    //   const getLocalStorage = JSON.parse(localStorage.getItem('survey') || '{}');
    //   const currentInput = getLocalStorage.current_input;
    //   const pagesCount = JSON.parse(localStorage.getItem('pagesCount') || '{}')

    //   if (currentInput) {
    //     const initData = currentInput.initialData;
    //     const totalPages = Object.keys(initData).map((data, index) => index + 1);

    //     let pagesOnLocal = {};
    //     let newCounts = [...countsRef.current];

    //     totalPages.forEach((selectedPage) => {
    //         newCounts[selectedPage - 1] = countsRef.current[selectedPage - 1] || 0;

    //         pagesOnLocal = {
    //           ...pagesOnLocal,
    //           [selectedPage]: newCounts[selectedPage - 1],
    //         };

    //         if (selectedPage === deadline.page) {
    //           newCounts[deadline.page - 1] += 1;

    //           pagesOnLocal = {
    //               ...pagesOnLocal,
    //               [selectedPage]: newCounts[selectedPage - 1],
    //           };
    //         }
    //     });

    //     const newPagesCount = {
    //       ...pagesCount,
    //       'page': pagesOnLocal,
    //       'count': newCounts
    //     }

    //     localStorage.setItem("pagesCount", JSON.stringify(newPagesCount));

    //     // Cập nhật giá trị countsRef để giữ giá trị mà không trigger re-render
    //     countsRef.current = newCounts;

    //     // Trigger re-render bằng cách cập nhật state counts
    //     setCounts(newCounts);
    //   }
    // }, [deadline.page])

    // useEffect(() => {
    //   const pagesCount = {
    //     ...JSON.parse(localStorage.getItem('pagesCount') || '{}'),
    //     'startSection': startSection,
    //   };

    //   localStorage.setItem("pagesCount", JSON.stringify(pagesCount));
    // }, [startSection]);

    // useEffect(() => {
    //   if(counts[deadline.page - 1] === 1) {
    //     const timeStartSection = new Date()

    //     setStartSection((prevStartSection: any) => ({
    //       ...prevStartSection,
    //       [deadline.page]: timeStartSection,
    //     }));

    //   }
    // }, [counts])

    // useEffect(() => {
    //   const calculateTimeSection = new Date(startSection[deadline.page]).getTime() + deadline.timeLimit * 60 * 1000 - new Date().getTime()
    //   if(calculateTimeSection <= 0) {
    //     setTimeOutSection((prev: any) => ({
    //       ...prev,
    //       [deadline.page]: true
    //     }))
    //   } else {
    //     setTimeOutSection((prev: any) => ({
    //       ...prev,
    //       [deadline.page]: false
    //     }))
    //   }

    // }, [deadline.page, startSection])

    const onVisibilityChange = () => {
        if (!document.hidden) {
            const timeLeftSection = new Date(deadline.timeLimit).getTime() - new Date().getTime();
            const minutesLimitSection = Math.floor(timeLeftSection / (1000 * 60));
            const secondsLimitSection = Math.floor((timeLeftSection % (1000 * 60)) / 1000);
            if (timeLeftSection >= 0) {
                setMinutes(minutesLimitSection);
                setSeconds(secondsLimitSection);
            } else {
                setMinutes(0);
                setSeconds(0);
            }
        }
    };

    useEffect(() => {
        if (timeOutSection[deadline.page]) {
            setDisablePage(timeOutSection);
            setChangeSection(false);
        }
    }, [timeOutSection]);

    useLayoutEffect(() => {
        const timeLeftSection = new Date(deadline.timeLimit).getTime() - new Date().getTime();
        const minutesLimitSection = Math.floor(timeLeftSection / (1000 * 60));
        const secondsLimitSection = Math.floor((timeLeftSection % (1000 * 60)) / 1000);
        if (timeLeftSection >= 0) {
            setMinutes(minutesLimitSection);
            setSeconds(secondsLimitSection);
        } else {
            setTimeOutSection((prev: any) => ({
                ...prev,
                [deadline.page]: true,
            }));
        }

        const startInterval = () => {
            intervalRef.current = window.setInterval(() => {
                setSeconds((pre: any) => {
                    if (pre > 0) {
                        return pre - 1;
                    }
                    setMinutes((preMin: any) => {
                        if (preMin === 0) {
                            setTimeOutSection((prev: any) => ({
                                ...prev,
                                [deadline.page]: true,
                            }));
                            if (intervalRef.current !== null) {
                                clearInterval(intervalRef.current);
                            }
                            return 0;
                        }
                        return preMin - 1;
                    });
                    return pre >= 0 ? 59 : 0;
                });
            }, 1000);
        };

        document.addEventListener('visibilitychange', onVisibilityChange);

        startInterval();

        return () => {
            if (intervalRef.current !== undefined) {
                clearInterval(intervalRef.current!);
            }
            document.removeEventListener('visibilitychange', onVisibilityChange);
        };
    }, [deadline.page, deadline.timeLimit]);

    const autoSubmit = () => {
        // auto submit here
        const local = LocalStorageService.getLocalStorageInstance();
        const input = local.get([SURVEY_INPUT_KEY]);

        const accessToken = params.slug[0];
        const answerToken = params.slug[1];
        const answer = local.get([accessToken, answerToken, 'answers']);
        handleSubmit({
            state: answer,
            userInfo,
            userLocal,
            onSubmitSuccess: () => {
                GlobalVariableInstance.setIsSubmitted(true);
                router.push(`/survey/full-test/${params}/review`);
                localStorage.removeItem('pagesCount');
            },
            onSubmitDone() {
                if (intervalRef.current !== null) {
                    clearInterval(intervalRef.current);
                }
                localStorage.removeItem('answerOnTest');
                local.remove([input.accessToken], input.answerToken);
                input.answerToken = undefined;
                local.set([], SURVEY_INPUT_KEY, input);
            },
            onBeginSubmit() {
                GlobalVariableInstance.setTimeDoTest(GlobalVariableInstance.getTimeLimit() * 60 * 1000);
                GlobalVariableInstance.setAnswers(getAnswersLocal);
            },
            onError: () => {
                router.push('/survey/survey-list');
            },
            signOut: () => {
                dispatch(logOut());
                router.push('/sign-in');
            },
        });
    };

    useEffect(() => {
        if (minutes === 1 && seconds === 0) {
            setPopover(true);
            const audio = new Audio('/assets/sound/notification.mp3');
            audio.play();
        }
    }, [minutes, seconds]);

    useEffect(() => {
        const checkTimeToSubmit = checkTimer(new Date(startTime), GlobalVariableInstance.getTimeLimit());
        const minuteLeft = checkTimeToSubmit.timeLeft.minute;
        const secondLeft = checkTimeToSubmit.timeLeft.second;
        const timeLeft = minuteLeft * 60 * 1000 + secondLeft * 1000;
        const timeToSubmit = setTimeout(() => {
            autoSubmit();
        }, timeLeft);

        return () => {
            clearTimeout(timeToSubmit);
        };
    }, []);

    return (
        <React.Fragment>
            {timeOutSection[deadline.page] ? (
                <p className="text-red-500 mb-0 font-bold">Time out</p>
            ) : (
                <Popover
                    containerStyle={{
                        zIndex: '99',
                    }}
                    isOpen={popover}
                    positions={'bottom'}
                    onClickOutside={() => setPopover(false)}
                    content={({ position, childRect, popoverRect }) => (
                        <ArrowContainer
                            position={position}
                            childRect={childRect}
                            popoverRect={popoverRect}
                            arrowColor={'#00ab6b'}
                            arrowSize={10}
                            className="popover-arrow-container"
                            arrowClassName="popover-arrow"
                        >
                            <div style={{ backgroundColor: '#00ab6b', color: 'white', padding: 4 }}>
                                Hurry up! Only one minute left!
                            </div>
                        </ArrowContainer>
                    )}
                >
                    <div className="text-[#f78600]">
                        {' '}
                        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                    </div>
                </Popover>
            )}
        </React.Fragment>
    );
};

export default React.memo(TimerSection);
