"use client"
import React from "react"

interface Props {
    words: any
}

const PhonemeList: React.FC<Props> = ({ words }) => {
    const colorBlue = {
        color: "green",
    }
    const colorRed = {
        color: "red",
    }
    return (
        <div
            style={{
                paddingLeft: "5px",
                paddingRight: "5px",
                display: "flex",
                flexDirection: "row",
            }}
        >
            {words.map((phoneme: any, index: any) => (
                <span
                    key={index}
                    style={phoneme.decision === "correct" ? colorBlue : colorRed}
                >
                    {phoneme.trans}
                </span>
            ))}
        </div>
    )
}

export default PhonemeList
