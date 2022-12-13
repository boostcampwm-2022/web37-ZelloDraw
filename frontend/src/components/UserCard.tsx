import React, { useCallback, useState } from 'react';
import { debounce } from 'lodash';
import styled from 'styled-components';
import { Center } from '@styles/styled';
import { motion } from 'framer-motion';
import { opacityVariants } from '@utils/framerMotion';
import { userState, userStreamState, userCamState } from '@atoms/user';
import { useRecoilState, useRecoilValue } from 'recoil';
import { networkServiceInstance as NetworkService } from '../services/socketService';
import Card from '@components/Card';
import CameraButton from '@components/CameraButton';
import MicButton from '@components/MicButton';
import useLocalStream from '@hooks/useLocalStream';
import MainVideoCall from '@components/MainVideoCall';
import { getParam } from '@utils/common';

function UserCard() {
    const paramIdValue = getParam('id');
    const [user, setUserState] = useRecoilState(userState);
    const userCam = useRecoilValue(userCamState);
    const currentUser = useRecoilValue(userState);
    const selfStream = useRecoilValue(userStreamState);
    const [isFirstUserNameChanging, setIsFirstUserNameChanging] = useState(true);

    useLocalStream();

    const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 유저 이름을 바꾼 적 있는지 확인
        isFirstUserNameChanging && setIsFirstUserNameChanging(false);
        const name = e.target.value;
        debounceOnChange(name);
    };

    const debounceOnChange = useCallback(
        debounce((name: string) => {
            setUserState({ name, isHost: paramIdValue === '' });
            NetworkService.emit('update-user-name', name);
        }, 500),
        [],
    );

    return (
        <Card>
            <CardInner>
                <MainVideoCall userName={currentUser.name} stream={selfStream} video={userCam} />
                <UserName>
                    <span>{'{'}</span>
                    <NameInput
                        type='text'
                        placeholder={user.name}
                        onChange={onChangeName}
                        maxLength={7}
                    />
                    <span>{'}'}</span>
                </UserName>
                {isFirstUserNameChanging && (
                    <Blink
                        animate={'enter'}
                        variants={opacityVariants}
                        transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.5 }}
                    >
                        WRITE YOUR USERNAME
                    </Blink>
                )}
                <ButtonWrapper>
                    <CameraButton />
                    <MicButton />
                </ButtonWrapper>
            </CardInner>
        </Card>
    );
}

export default UserCard;

const CardInner = styled(Center)`
    flex-direction: column;
    padding: 16px;
    height: 100%;
`;

const UserName = styled.div`
    text-align: center;

    span {
        // 중괄호
        color: ${({ theme }) => theme.color.whiteT2};
        font-family: 'Sniglet', cursive;
        font-weight: 800;
        font-size: 2.5rem;
        padding: 4px;
    }
`;

const ButtonWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-bottom: 0;
    margin-top: 77px;
`;

const NameInput = styled.input`
    width: 200px;
    background: transparent;
    text-align: center;
    margin: 0 2px;
    transform: translateY(-2px);
    font-style: normal;
    font-weight: 600;
    font-size: ${({ theme }) => theme.typo.h3};
    line-height: 160%;
    letter-spacing: -0.05em;
    color: ${({ theme }) => theme.color.yellow};
    -webkit-text-stroke: 1px ${({ theme }) => theme.color.blackT1};
`;

const Blink = styled(motion.div)`
    position: absolute;
    margin-top: 110px;
    color: ${({ theme }) => theme.color.yellow};
    font-family: 'Sniglet', cursive;
    font-size: ${({ theme }) => theme.typo.h5};
    letter-spacing: 0.02em;
`;
