import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Card from '@components/Card';
import PrimaryButton from '@components/PrimaryButton';
import InfoCarousel from '@components/InfoCarousel';
import { userState } from '@atoms/user';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { lobbyIdState } from '@atoms/game';
import { getParam } from '@utils/common';
import { AnimatePresence, motion } from 'framer-motion';
import { opacityVariants } from '@utils/framerMotion';

function InfoCard({ onHandleEnterLobby }: { onHandleEnterLobby: () => void }) {
    const paramIdValue = getParam('id');
    const [current, setCurrent] = useState<number>(0);
    const [user, setUser] = useRecoilState(userState);
    const setLobbyId = useSetRecoilState(lobbyIdState);

    useEffect(() => {
        if (user.isHost) return;
        // 호스트는 주소 복사로 들어오지 않고 가장 먼저 들어온 사람이기 때문에 lobbyId는 ''이다. isHost가 true가 된다.
        setUser({ ...user, isHost: paramIdValue === '' });
        setLobbyId(paramIdValue);
    }, [user]);

    const headingContents = [
        'WELCOME!',
        'MAKE YOUR WORD',
        'DRAW THE WORD',
        'GUESS THE DRAWING',
        'ENJOY THE RESULTS!',
    ];
    return (
        <Card>
            <CardInner>
                <AnimatePresence initial={false}>
                    <Heading
                        key={current}
                        initial={'enter'}
                        animate={'animate'}
                        exit={'exit'}
                        variants={opacityVariants}
                    >
                        {headingContents[current]}
                    </Heading>
                </AnimatePresence>
                <InfoDiv>
                    <InfoCarousel current={current} setCurrent={setCurrent} />
                </InfoDiv>
                <ButtonWrapper
                    onClick={onHandleEnterLobby}
                    role={'button'}
                    aria-label={user.isHost ? '방 만들기' : '입장하기'}
                >
                    {user.isHost ? (
                        <PrimaryButton topText='NEW ROOM' bottomText='방만들기' />
                    ) : (
                        <PrimaryButton topText='ENTER ROOM' bottomText='입장하기' />
                    )}
                </ButtonWrapper>
            </CardInner>
        </Card>
    );
}

export default InfoCard;

const CardInner = styled.div`
    padding: 40px 0 44px;
    position: relative;
`;

const Heading = styled(motion.h1)`
    position: absolute;
    font-family: 'Sniglet', cursive;
    font-style: normal;
    font-weight: 400;
    font-size: ${({ theme }) => theme.typo.h1};
    line-height: 111.5%;
    letter-spacing: 0.01em;
    color: ${({ theme }) => theme.color.white};
    margin-bottom: 8px;
    margin-left: 66px;

    background: ${({ theme }) => theme.gradation.yellowPurple};
    -webkit-background-clip: text;
    -webkit-text-stroke: 2px transparent;
`;

const InfoDiv = styled.div`
    font-style: normal;
    font-weight: 400;
    font-size: ${({ theme }) => theme.typo.h3};
    line-height: 160%;
    letter-spacing: -0.05em;
    color: ${({ theme }) => theme.color.white};
    display: flex;
    justify-content: center;

    h3 {
        width: 403px;
        font-style: normal;
        font-weight: 400;
        font-size: ${({ theme }) => theme.typo.h3};
        line-height: 160%;
        letter-spacing: -0.05em;
        color: ${({ theme }) => theme.color.white};
    }
`;

const ButtonWrapper = styled.div`
    margin-top: 14px;
    margin-left: 318px;
`;
