import React, { useCallback, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Card from '@components/Card';
import CameraButton from '@components/CameraButton';
import MicButton from '@components/MicButton';
import { userState, userStreamState, userCamState, userMicState } from '@atoms/user';
import { useRecoilState, useRecoilValue } from 'recoil';
import { networkServiceInstance as NetworkService } from '../services/socketService';
import { debounce } from 'lodash';
import useLocalStream from '@hooks/useLocalStream';
import MainVideoCall from '@components/MainVideoCall';

function UserCard() {
    const [user, setUserState] = useRecoilState(userState);
    const userCam = useRecoilValue(userCamState);
    const currentUser = useRecoilValue(userState);
    const selfStream = useRecoilValue(userStreamState);

    useLocalStream();

    const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setUserState({ ...user, name });
        debounceOnChange(name);
    };

    const debounceOnChange = useCallback(
        debounce((name: string) => {
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
                <ButtonWrapper>
                    <CameraButton />
                    <MicButton />
                </ButtonWrapper>
            </CardInner>
        </Card>
    );
}

export default UserCard;

const CardInner = styled.div`
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
    width: 201px;
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
