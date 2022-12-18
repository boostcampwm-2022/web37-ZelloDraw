import { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { ReactComponent as MicOffIcon } from '@assets/icons/mic-off-video-icon.svg';
import { ReactComponent as MicOnIcon } from '@assets/icons/mic-on-video-icon.svg';
import { ReactComponent as HostIconS } from '@assets/icons/host-icon-s.svg';
import { ReactComponent as HostIconL } from '@assets/icons/host-icon-l.svg';
import { Center, VideoProperty } from '@styles/styled';
import useDetectSelfAudioVolume from '@hooks/useDetectSelfAudioVolume';
import useDetectPeerAudioVolume from '@hooks/useDetectPeerAudioVolume';

interface VideoCallProps {
    userName: string;
    stream?: MediaStream;
    audio?: boolean;
    video?: boolean;
    isCurUser?: boolean;
    isHost?: boolean;
    pc?: RTCPeerConnection;
}

function VideoCallUser({
    userName,
    stream,
    audio,
    video,
    pc,
    isHost,
    isCurUser = false,
}: VideoCallProps) {
    const videoRef: React.RefObject<HTMLVideoElement> | null = useRef(null);
    const { highlightUserVideo } = useDetectSelfAudioVolume();
    const { highlightPeerVideo } = useDetectPeerAudioVolume();

    const getCameraOnComponent = () => {
        return (
            <CameraOnUserName>
                <span>{userName}</span>
                {isHost && <HostIconS />}
            </CameraOnUserName>
        );
    };

    const getCameraOffComponent = () => {
        return (
            <CameraOffUserName>
                <span>&#123;</span>
                <span>{userName}</span>
                <span>&#125;</span>
                {isHost && <HostIconL />}
            </CameraOffUserName>
        );
    };

    useEffect(() => {
        if (!videoRef.current || !stream) return;
        videoRef.current.srcObject = stream;
    }, [stream, video, audio]);

    useEffect(() => {
        if (!isCurUser || !stream) return;
        const interval = highlightUserVideo(stream, videoRef);
        return () => {
            clearInterval(interval);
        };
    }, [isCurUser, stream]);

    useEffect(() => {
        if (!pc) return;
        const interval = highlightPeerVideo(pc, videoRef);
        return () => {
            interval && clearInterval(interval);
        };
    }, [pc]);

    return (
        <Container>
            {video && stream ? (
                <>
                    <Video ref={videoRef} autoPlay playsInline muted={!!isCurUser}></Video>
                    {getCameraOnComponent()}
                </>
            ) : audio && stream ? (
                <>
                    <EmptyVideo
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted={!!isCurUser}
                    ></EmptyVideo>
                    {getCameraOffComponent()}
                </>
            ) : (
                <>{getCameraOffComponent()}</>
            )}
            <MicIconWrapper>{audio ? <MicOnIcon /> : <MicOffIcon />}</MicIconWrapper>
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

    .speaking {
        border: 3px solid ${({ theme }) => theme.color.yellow};
    }
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

const EmptyVideo = styled(VideoProperty)`
    display: none;
`;

const MicIconWrapper = styled.div`
    position: absolute;
    top: 8px;
    right: 8px;
`;
