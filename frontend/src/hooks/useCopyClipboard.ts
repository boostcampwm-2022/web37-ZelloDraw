import { useState } from 'react';

type onCopyFnType = (text: string) => Promise<boolean>;

function useCopyClipBoard(): [boolean, onCopyFnType] {
    const [isCopied, setIsCopied] = useState<boolean>(false);

    const onCopy: onCopyFnType = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            return true;
        } catch (error) {
            console.error(error);
            setIsCopied(false);
            return false;
        }
    };
    return [isCopied, onCopy];
}

export default useCopyClipBoard;
