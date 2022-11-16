import { useEffect, Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';

interface ToastPropsType {
    setToast: Dispatch<SetStateAction<boolean>>;
    text: string;
}

function ToastMessage({ setToast, text }: ToastPropsType) {
    useEffect(() => {
        const timer = setTimeout(() => {
            setToast(false);
        }, 1500);
        return () => {
            clearTimeout(timer);
        };
    }, [setToast]);

    return (
        <ToastContainer>
            <p>{text}</p>
        </ToastContainer>
    );
}

export default ToastMessage;

const ToastContainer = styled.div`
    z-index: 1;
    position: absolute;
    background: ${({ theme }) => theme.color.blackT1};
    border: 1px solid ${({ theme }) => theme.color.white};
    border-radius: 16px;
    padding: 10px;
    margin-top: -95px;
    margin-left: -50px;
    font-size: 16px;
`;
