import cameraOffImg from '@assets/buttons/camera-off-btn.svg';
import cameraOnImg from '@assets/buttons/camera-on-btn.svg';
import styled from 'styled-components';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userMicState, userCamState, userStreamRefState } from '@atoms/user';
import { networkServiceInstance as NetworkService } from '../services/socketService';

function CameraButton() {
    const selfStreamRef = useRecoilValue(userStreamRefState);
    const userMic = useRecoilValue(userMicState);
    const [userCam, setUserCam] = useRecoilState(userCamState);
    const onBtnClick = () => {
        if (!selfStreamRef?.current) return;
        selfStreamRef.current.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));

        const changed = !userCam;
        setUserCam(changed);
        NetworkService.emit('update-user-stream', { audio: userMic, video: changed });
    };

    return (
        <CameraBtnSet>
            <CameraBtn onClick={onBtnClick}>
                <img src={userCam ? cameraOnImg : cameraOffImg} />
            </CameraBtn>
            <Label>CAMERA {userCam ? 'ON' : 'OFF'}</Label>
        </CameraBtnSet>
    );
}

export default CameraButton;

const CameraBtnSet = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 85px;
`;

const CameraBtn = styled.button`
    all: unset;
    cursor: pointer;
    width: 64px;

    img {
        width: 64px;
        height: 64px;
    }
`;

const Label = styled.div`
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 18px;
    text-align: center;
    letter-spacing: -0.04em;
    color: ${({ theme }) => theme.color.whiteT2};
`;
