import micOffImg from '@assets/buttons/mic-off-btn.svg';
import micOnImg from '@assets/buttons/mic-on-btn.svg';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { userMicState } from '@atoms/user';

function MicButton() {
    const [userMic, setUserMic] = useRecoilState(userMicState);
    const onBtnClick = () => {
        setUserMic(!userMic);
    };

    return (
        <MicBtnSet>
            <MicBtn onClick={onBtnClick}>
                <img src={userMic ? micOnImg : micOffImg} />
            </MicBtn>
            <Label>MIC {userMic ? 'ON' : 'OFF'}</Label>
        </MicBtnSet>
    );
}

export default MicButton;

const MicBtnSet = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 85px;
`;

const MicBtn = styled.button`
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
