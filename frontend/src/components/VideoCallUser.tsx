import { useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as MicOffIcon } from '@assets/icons/mic-off-video-icon.svg';
import { ReactComponent as MicOnIcon } from '@assets/icons/mic-on-video-icon.svg';
import { ReactComponent as HostIconS } from '@assets/icons/host-icon-s.svg';
import { ReactComponent as HostIconL } from '@assets/icons/host-icon-l.svg';
import { Center, VideoProperty } from '@styles/styled';

interface VideoCallProps {
    userName: string;
    video?: React.RefObject<HTMLVideoElement> | undefined;
}

function VideoCallUser({ userName, video }: VideoCallProps) {
    const [hostState, setHostState] = useState<boolean>(false);
    const [micState, setMicState] = useState<boolean>(true);

    return (
        <Container>
            {video ? (
                <>
                    <Video ref={video} autoPlay playsInline></Video>
                    <CameraOnUserName>
                        <span>{userName}</span>
                        {hostState && <HostIconS />}
                    </CameraOnUserName>
                </>
            ) : (
                <>
                    <CameraOffUserName>
                        <span>&#123;</span>
                        <span>{userName}</span>
                        <span>&#125;</span>
                        {hostState && <HostIconL />}
                    </CameraOffUserName>
                </>
            )}
            <MicIconWrapper>{micState ? <MicOnIcon /> : <MicOffIcon />}</MicIconWrapper>
        </Container>
    );
}

export default VideoCallUser;

const Container = styled(Center)`
    flex-direction: column;
    width: 220px;
    height: 124px;
    position: relative;
    background: ${({ theme }) => theme.gradation.purplePrimary};
    border: 2px solid ${({ theme }) => theme.color.whiteT2};
    border-radius: 24px;
`;

const CameraOffUserName = styled(Center)`
    margin: auto;

    span {
        &:not(:nth-of-type(2)) {
            // 중괄호
            color: ${({ theme }) => theme.color.primaryLight};
            font-family: 'Sniglet', cursive;
            font-weight: 800;
            font-size: 2rem;
        }

        :nth-child(2) {
            // 유저 이름
            margin: 0 2px;
            color: ${({ theme }) => theme.color.gray1};
            font-size: ${({ theme }) => theme.typo.h5};
            transform: translateY(-2px);
        }
    }

    svg {
        position: absolute;
        top: 16px;
        left: 16px;
    }
`;

const CameraOnUserName = styled(Center)`
    position: absolute;
    top: 8px;
    left: 8px;
    padding: 2px 6px;
    background-color: ${({ theme }) => theme.color.blackT1};
    border-radius: 40px;

    span {
        color: ${({ theme }) => theme.color.gray1};
        font-size: 0.625rem;
        font-weight: bold;
    }

    svg {
        transform: translateY(2px);
    }
`;

const Video = styled(VideoProperty)`
    border-radius: 22px;
`;

const MicIconWrapper = styled.div`
    position: absolute;
    top: 8px;
    right: 8px;
`;
