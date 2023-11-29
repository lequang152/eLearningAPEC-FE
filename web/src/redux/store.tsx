"use client"

import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./Slice/Auth/authSlice"
import SurveySlice from "./Slice/Surveys/SurveySlice"
import InputExam from "./Slice/InputExam/InputExamSlice"
import AnswerExamSlice from "./Slice/AnswerExam/AnswerExamSlice"

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        survey: SurveySlice.reducer,
        exam: InputExam.reducer,
        answer: AnswerExamSlice.reducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// store.subscribe(() => {
//     console.log("store changed", store.getState())
// })
