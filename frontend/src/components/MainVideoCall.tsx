import { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Center, VideoProperty } from '@styles/styled';

interface VideoCallProps {
    userName: string;
    stream?: MediaStream;
    video?: boolean;
}

function MainVideoCall({ userName, stream, video }: VideoCallProps) {
    const videoRef: React.RefObject<HTMLVideoElement> | null = useRef(null);

    useEffect(() => {
        if (!videoRef.current || !stream || !video) return;
        videoRef.current.srcObject = stream;
    }, [stream, video]);

    return (
        <Container>
            {video ? (
                <Video ref={videoRef} autoPlay playsInline></Video>
            ) : (
                <>
                    <CameraOffUserName>
                        <span>&#123;</span>
                        <span>{userName}</span>
                        <span>&#125;</span>
                    </CameraOffUserName>
                </>
            )}
        </Container>
    );
}

export default MainVideoCall;

const Container = styled.div`
    width: 328px;
    height: 183.69px;
    border: 2px solid ${({ theme }) => theme.color.whiteT2};
    border-radius: 32px;
    background: ${({ theme }) => theme.gradation.purplePrimary};
    margin-bottom: 7.31px;
`;

const Video = styled(VideoProperty)`
    border-radius: 32px;
`;

const CameraOffUserName = styled(Center)`
    height: 183.69px;
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
