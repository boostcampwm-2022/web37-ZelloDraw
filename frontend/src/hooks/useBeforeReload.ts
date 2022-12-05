import { useEffect } from 'react';

function useBeforeReload() {
    const preventClose = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = '';
    };

    const preventGoBack = () => {
        history.pushState(null, '', location.href);
    };

    useEffect(() => {
        (() => {
            history.pushState(null, '', location.href);
            window.addEventListener('popstate', preventGoBack);
            window.addEventListener('beforeunload', preventClose);
        })();

        return () => {
            window.removeEventListener('popstate', preventGoBack);
            window.removeEventListener('beforeunload', preventClose);
        };
    }, []);
}

export default useBeforeReload;
