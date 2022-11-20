import React, { useEffect } from 'react';

function useOnClickOutside(
    ref: React.RefObject<HTMLElement>,
    handler: (event: MouseEvent) => void,
) {
    useEffect(() => {
        const listener = (event: MouseEvent) => {
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }
            handler(event);
        };

        document.addEventListener('mousedown', listener);
        return () => {
            document.removeEventListener('mousedown', listener);
        };
    }, [ref, handler]);
}

export default useOnClickOutside;
