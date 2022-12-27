import { Toaster } from 'react-hot-toast';
import styled from 'styled-components';
import { ScaledDiv } from '@styles/styled';

function ToasterFromTop() {
    return (
        <ToasterWrapper>
            <Toaster position='top-center' reverseOrder={false} toastOptions={{ duration: 1500 }} />
        </ToasterWrapper>
    );
}

export default ToasterFromTop;

const ToasterWrapper = styled(ScaledDiv)`
    position: absolute;
    top: 0;
    width: 100%;
`;
