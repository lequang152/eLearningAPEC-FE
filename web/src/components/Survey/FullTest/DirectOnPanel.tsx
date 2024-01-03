'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import Box from '@mui/system/Box';
import Modal from '@mui/material/Modal';
import { Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { Button } from '@mui/joy';
import GlobalVariable from '../../../utils/GlobalVariable';
import { LocalStorageService, SURVEY_INPUT_KEY } from '../../../utils/local_survey';
import { updateUserDataToBackend } from '../../../utils/api_call';

type Props = {
    index: number;
    page: number;
    textContent: string;
    setPage: (page: number) => void;
};

function DirectOnPanel({ index, page, textContent, setPage }: Props) {
    const [openModal, setOpenModal] = React.useState(false);

    const [directionPageNumber, setDirectionPageNumber] = useState(1);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const saveAnswersToBackend = () => {
        const local = LocalStorageService.getLocalStorageInstance();
        const data = local.get([SURVEY_INPUT_KEY]);
        if (data) {
            const accessToken = data.accessToken;
            const answerToken = data.answerToken;
            const examData = local.get([accessToken, answerToken]);
            updateUserDataToBackend(answerToken, examData);
        }
    };

    const handleToPage = () => {
        setPage(directionPageNumber);
        GlobalVariable.getInstance().removeQuestionID();
        saveAnswersToBackend();
        handleCloseModal();
    };

    const styleBox = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'white',
        border: '1px solid #ccc',
        boxShadow: 24,
        p: 4,
        borderRadius: '10px',
    };

    return (
        <div className="block">
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleBox}>
                    <div className="flex justify-center">
                        <WarningIcon sx={{ fontSize: 24 }} color="warning" />
                        <h4 className="ml-2 text-[#ed6c02]">Warning!</h4>
                    </div>
                    <Typography>You will lose one play. Are you sure you want to move to another page?</Typography>
                    <div className="flex justify-between mt-6">
                        <Button color="success" className="bg-[#198754] w-[75px] h-[40px]" onClick={handleCloseModal}>
                            Close
                        </Button>
                        <Button
                            color="success"
                            className="w-[75px] h-[40px]"
                            onClick={() => {
                                handleToPage();
                            }}
                        >
                            OK
                        </Button>
                    </div>
                </Box>
            </Modal>

            {index == 0 ? (
                <button
                    className={`font-bold hover:underline ${page == index + 1 ? 'text-sky-600' : ''}`}
                    key={index}
                    onClick={() => {
                        if (GlobalVariable.getInstance().getIsPlaying()) {
                            setDirectionPageNumber(index + 1);
                            handleOpenModal();
                        } else {
                            setPage(index + 1);
                            GlobalVariable.getInstance().removeQuestionID();
                            saveAnswersToBackend();
                        }
                    }}
                >
                    {textContent}
                </button>
            ) : index < page ? (
                <button
                    className={`font-bold ${page == index + 1 ? 'text-sky-600' : ''}`}
                    key={index}
                    onClick={() => {
                        if (GlobalVariable.getInstance().getIsPlaying()) {
                            setDirectionPageNumber(index + 1);
                            handleOpenModal();
                        } else {
                            setPage(index + 1);
                            GlobalVariable.getInstance().removeQuestionID();
                            saveAnswersToBackend();
                        }
                    }}
                >
                    <span> / </span>
                    <span className="hover:underline">{textContent}</span>
                </button>
            ) : (
                <></>
            )}
        </div>
    );
}

export default DirectOnPanel;
