import styled from 'styled-components';
import { Center } from '@styles/styled';
import { canClearCanvasState, resetModalOpenState } from '@atoms/game';
import { useSetRecoilState } from 'recoil';

function ResetModal() {
    const setCanClearCanvas = useSetRecoilState(canClearCanvasState);
    const setResetModalOpen = useSetRecoilState(resetModalOpenState);

    function handleReset(state: boolean) {
        setResetModalOpen(false);
        setCanClearCanvas(state);
    }

    return (
        <Container>
            <Modal>
                <Question>그림을 전부 지울까요?</Question>
                <AnswerWrapper>
                    <div onClick={() => handleReset(false)}>아니요</div>
                    <div onClick={() => handleReset(true)}>지울래요</div>
                </AnswerWrapper>
            </Modal>
        </Container>
    );
}

export default ResetModal;

const Container = styled(Center)`
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
`;

const Modal = styled(Center)`
    flex-direction: column;
    width: 270px;
    height: 180px;
    padding: 14px 12px;
    background: ${({ theme }) => theme.gradation.purplePrimary};
    border: 1px solid ${({ theme }) => theme.color.brown};
    border-radius: 24px;
    box-shadow: ${({ theme }) => theme.shadow.card};

    div {
        font-size: ${({ theme }) => theme.typo.h4};
    }
`;

const Question = styled(Center)`
    width: 100%;
    flex-grow: 1;
    color: ${({ theme }) => theme.color.white};
    border-bottom: 1px solid ${({ theme }) => theme.color.gray1};
`;

const AnswerWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 8px 16px 4px;
    > div:first-of-type {
        color: ${({ theme }) => theme.color.green};
        transform: translateX(4px);
    }
    > div:last-of-type {
        color: ${({ theme }) => theme.color.red};
    }
    > div {
        cursor: pointer;
    }
`;
