import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function useRemoveParams() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);

        if (queryParams.has('id')) {
            queryParams.delete('id');
            navigate(location.pathname, { replace: true });
        }
    }, []);
}

export default useRemoveParams;
