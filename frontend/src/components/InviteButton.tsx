import styled from 'styled-components';
import { getParam } from '@utils/common';
import useCopyClipBoard from '@hooks/useCopyClipboard';
import toast, { Toaster } from 'react-hot-toast';

function InviteButton() {
    const [isCopied, onCopy] = useCopyClipBoard();

    const onClickInviteBtn = () => {
        const invitationLink = `${window.location.origin}?id=${getParam('id')}`;
        void onCopy(invitationLink);
        // TODO - setIsCopied 비동기 실행으로 인한 set 이슈 해결
        toast('🖇 클립보드에 복사되었습니다.');
    };

    return (
        <>
            <InviteBtn onClick={onClickInviteBtn}>
                INVITE<h3>초대하기</h3>
            </InviteBtn>
            <Toaster position='top-center' reverseOrder={false} toastOptions={{ duration: 1500 }} />
        </>
    );
}

export default InviteButton;

const InviteBtn = styled.button`
    all: unset;
    cursor: pointer;
    background: ${({ theme }) => theme.color.blackT1};
    border: 1px solid ${({ theme }) => theme.color.white};
    border-radius: 16px;
    width: 106px;
    height: 44px;

    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 21px;
    text-align: center;
    letter-spacing: -0.05em;
    color: ${({ theme }) => theme.color.yellow};

    h3 {
        margin-top: -2px;
        font-weight: 400;
    }
`;
