import React, { CSSProperties, useEffect, useState } from 'react';

interface Props {
    onClick: () => void;
    children: any;
    styleButton: CSSProperties;
}

type myStyle = {
    backgroundColor: string;
    border: string;
    borderColor: string;
    color: string;
    padding: string;
    display: string;
    alignItems: string;
    justifyContent: string;
};

function ButtonQuestion({ onClick, children, styleButton }: Props) {
    const [isHovered, setIsHovered] = useState(false);

    const handleHover = () => {
        setIsHovered(true);
    };

    const handleHoverOut = () => {
        setIsHovered(false);
    };

    const buttonStyle: CSSProperties = {
        ...styleButton,
        color: isHovered ? 'green' : styleButton.color,
        border: isHovered ? '1px solid green' : styleButton.border,
    };

    return (
        <button
            onClick={onClick}
            className=" w-[60px] buttonPallette:min-w-[60px]
        rounded-full buttonPallette:mr-2 hover:bg-[#b2e9aa]"
            style={buttonStyle}
            onMouseEnter={handleHover}
            onMouseLeave={handleHoverOut}
        >
            {children}
        </button>
    );
}

export default ButtonQuestion;
