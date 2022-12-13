import styled from 'styled-components';
import { Center } from '@styles/styled';

function Loading() {
    const RandomMsgList = [
        '팔레트에 물감을 짜는 중',
        '스케치북을 가져오는 중',
        '붓을 깨끗이 씻는 중',
        '페인트 통을 비우는 중',
        '그리기 도구를 정리 중',
    ];

    function getRandomMsg() {
        const randomIndex = Math.floor(Math.random() * RandomMsgList.length);
        return RandomMsgList[randomIndex];
    }

    return (
        <>
            <Dimmed />
            <TextWrapper>
                <LoadingText>Loading...</LoadingText>
                <Msg>{getRandomMsg()}</Msg>
            </TextWrapper>
        </>
    );
}

export default Loading;

const Dimmed = styled.div`
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: ${({ theme }) => theme.color.blackT1};
`;
const TextWrapper = styled(Center)`
    flex-direction: column;
    position: absolute;
    margin: auto;
`;

const LoadingText = styled.h1`
    margin-bottom: 0.5rem;
    background: ${({ theme }) => theme.gradation.yellowPurple};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke: 1px ${({ theme }) => theme.color.white};
    font-family: 'Sniglet', cursive;
    font-size: ${({ theme }) => theme.typo.h1};
    font-weight: 800;
    letter-spacing: 0.02em;
    transform: translateX(16px);
`;

const Msg = styled.h5`
    color: ${({ theme }) => theme.color.yellow};
    -webkit-text-stroke: 1px ${({ theme }) => theme.color.purple};
    font-size: ${({ theme }) => theme.typo.h5};
    letter-spacing: 0.02em;
`;
