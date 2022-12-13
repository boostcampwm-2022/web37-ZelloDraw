import { useRecoilValue } from 'recoil';
import { currentSketchbookState } from '@atoms/result';
import styled from 'styled-components';

function QuizAuthor() {
    const currentSketchbook = useRecoilValue(currentSketchbookState);
    return (
        <Wrapper>
            <SmallBrace>{'{'}</SmallBrace>
            <QuizAuthorName>{currentSketchbook.author!.name}</QuizAuthorName>
            <SmallBrace>{'}'}</SmallBrace>
        </Wrapper>
    );
}

export default QuizAuthor;

const Wrapper = styled.div`
    position: relative;
    top: -56px;
`;

const QuizAuthorName = styled.span`
    background: ${({ theme }) => theme.gradation.whitePurple2};
    ${({ theme }) => theme.layout.gradientTypo}
    -webkit-text-stroke:${({ theme }) => theme.color.primaryLight};
    font-size: ${({ theme }) => theme.typo.h5};
    font-weight: 600;
    word-break: keep-all;
`;

const SmallBrace = styled.span`
    margin: 0 12px 0 6px;
    font-family: 'Sniglet', cursive;
    font-weight: 700;
    font-size: ${({ theme }) => theme.typo.h4};
    color: ${({ theme }) => theme.color.whiteT2};
`;
