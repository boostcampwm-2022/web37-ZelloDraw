import styled from 'styled-components';
import Card from '@components/Card';
import GameModeItem from '@components/GameModeItem';
import { ReactComponent as GirlWithPencilChar } from '@assets/girl-with-pencil 1.svg';
import PrimaryButton from '@components/PrimaryButton';
import { useRecoilValue } from 'recoil';
import { userState, userStateType } from '@atoms/user';

function GameModeList() {
    const user = useRecoilValue<userStateType>(userState);

    const modes = [
        {
            title: 'RANDOM KEYWORD',
            description: '무작위 단어로 시작해보세요!',
            illustration: <GirlWithPencilChar />,
        },
    ];

    return (
        <Card>
            <CardInner>
                {modes.map((mode, idx) => (
                    <GameModeItem mode={mode} key={mode.title} isSelected={idx === 0} />
                ))}
                {user.isHost ? (
                    <ButtonWrapper>
                        <PrimaryButton topText='START GAME' bottomText='시작하기' />
                    </ButtonWrapper>
                ) : (
                    <TextWrapper>
                        <span>*</span> 게임 시작을 기다리고 있어요... <span>*</span>
                    </TextWrapper>
                )}
            </CardInner>
        </Card>
    );
}

export default GameModeList;

const CardInner = styled.div`
    padding: 20px 18px;
    height: 616px;
    display: flex;
    flex-direction: column;
`;

const ButtonWrapper = styled.div`
    margin: auto 0 0 auto;
`;

const TextWrapper = styled.div`
    font-style: normal;
    font-weight: 400;
    font-size: ${({ theme }) => theme.typo.h5};
    line-height: 26px;
    text-align: center;
    letter-spacing: -0.045em;
    color: ${({ theme }) => theme.color.white};
    margin: auto;
    margin-bottom: 16px;

    background: ${({ theme }) => theme.gradation.yellowPurple};
    -webkit-background-clip: text;
    -webkit-text-stroke: 1px transparent;

    span {
        font-family: 'Sniglet';
        font-weight: 800;
        letter-spacing: -0.05em;
    }
`;
