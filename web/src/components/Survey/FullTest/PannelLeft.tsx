"use client"
import { Question } from "../../../constants/question.types"
import { LocalAnswerExam } from "../../../hook/useLocalAnswerExam"
import { SpecQuestionFactory } from "./Factory/SpecQuestionFactory"
import React, { useEffect, useRef, useState, useCallback } from "react"
import GlobalVariable from "../../../utils/GlobalVariable"
import Box from '@mui/system/Box';
import Modal from '@mui/material/Modal';
import DirectOnPanel from "./DirectOnPanel"


type Props = {
    questions: Question[]
    answerToken: string
    accessToken: string
    title: string
    setPage : (page: number) => void
    page: number
}

function PannelLeft({ questions, answerToken, accessToken, title, setPage, page }: Props) {

    const leftSectionRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (leftSectionRef.current) {
            leftSectionRef.current.scrollTop = 0
        }
    }, [questions])

    return (
        questions!.length > 0 && (
            <div
                ref={leftSectionRef}
                className="fulltest__section-left lg:w-full overflow-auto p-10 bg-[#ffed9bad] flex flex-col h-full flex-1 relative"
            >
                 <Box component="section" 
                    sx={{ 
                        p: 1, 
                        display: 'flex',
                        fontSize: 12,
                        flexWrap: 'wrap',
                        color: 'black',
                    }}
                 >
                     
                    {
                        GlobalVariable.getInstance().getPagesData().map((data, index) => {
                            const dataSection = data[Object.keys(data)[0]]
                            let textContent;
                            const htmlString = dataSection.title?.en_US
                            if(htmlString) {
                                const parser = new DOMParser()
                                const document = parser.parseFromString(htmlString, 'text/html');
                                const pTextContent = document.querySelector('p')?.textContent;
                                if(!pTextContent) {
                                    const h3TextContent = document.querySelector('h3')?.textContent
                                    textContent = h3TextContent?.toUpperCase()
                                } else textContent = pTextContent?.toUpperCase()
                               }
                            return (
                                textContent &&
                                <DirectOnPanel 
                                    key={index}
                                    index={index} 
                                    page={page} 
                                    textContent={textContent} 
                                    setPage={setPage}
                                />

                            )
                        })
                    }
                </Box>

                <div className="flex justify-center flex-col w-full flex-1 items-center">
                    <h3
                        className="left-title mb-3"
                        // dangerouslySetInnerHTML={{ __html: title }}
                    ></h3>

                    {questions!.map((question, index) => (
                        <div
                            key={index}
                            className=""
                        >
                            {SpecQuestionFactory(question, accessToken, answerToken)}
                        </div>
                    ))}
                </div>
            </div>
        )
    )
}

export default React.memo(PannelLeft)
