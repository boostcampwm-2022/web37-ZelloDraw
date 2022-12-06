import { Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userStreamRefState } from '@atoms/user';

interface ProtectRouteProps {
    children: JSX.Element;
    redirectPath?: string;
}

const ProtectRoute = (props: ProtectRouteProps): JSX.Element => {
    const { children } = props;
    const userStreamInfo = useRecoilValue(userStreamRefState);
    const isRightAccess = !!userStreamInfo;
    if (!isRightAccess) {
        return <Navigate to={'/'} />;
    }
    return children;
};

export default ProtectRoute;
