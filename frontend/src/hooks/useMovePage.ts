import { useNavigate, To, NavigateOptions } from 'react-router-dom';

export function useMovePage() {
    const navigate = useNavigate();
    const setPage = (url: To, state?: NavigateOptions) => {
        return navigate(url, { state });
    };

    return [setPage];
}

export default useMovePage;
