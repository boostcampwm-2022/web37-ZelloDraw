import styled from 'styled-components';
import { Center } from '@styles/styled';
import PrimaryButton from '@components/PrimaryButton';

export default function SubmitWord({ drawState }: { drawState: boolean }) {
    return (
        <Container>
            {!drawState ? <AnswerInput placeholder={'그림을 보고 답을 맞춰보세요!'} /> : <div />}
            <PrimaryButton topText={'SUBMIT'} bottomText={'제출하기'} />
        </Container>
    );
}

const Container = styled(Center)`
    width: 1120px;
    margin-top: 26px;

    > div {
        width: 100%;
    }
`;

const AnswerInput = styled.input`
    flex-grow: 1;
    height: 48px;
    padding: 4px 20px;
    margin-right: 16px;
    background-color: ${({ theme }) => theme.color.blackT1};
    color: ${({ theme }) => theme.color.green};
    border: 1px solid ${({ theme }) => theme.color.yellow};
    border-radius: 20px;
    font-size: ${({ theme }) => theme.typo.h4};
    font-weight: 800;

    &::placeholder {
        color: ${({ theme }) => theme.color.gray1};
        font-weight: 500;
    }

    &:focus {
        border-color: ${({ theme }) => theme.color.green};
    }
`;
