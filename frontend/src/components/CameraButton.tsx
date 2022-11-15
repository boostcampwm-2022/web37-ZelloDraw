import React, { useState } from 'react';
import cameraOffImg from '@assets/buttons/camera-off-btn.svg';
import cameraOnImg from '@assets/buttons/camera-on-btn.svg';
import styled from 'styled-components';

function CameraButton() {
    const [isOn, setIsOn] = useState<boolean>(true);
    const onBtnClick = () => setIsOn(!isOn);

    return (
        <CameraBtnSet>
            <CameraBtn onClick={onBtnClick}>
                <img src={isOn ? cameraOnImg : cameraOffImg} />
            </CameraBtn>
            <Label>CAMERA {isOn ? 'ON' : 'OFF'}</Label>
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
