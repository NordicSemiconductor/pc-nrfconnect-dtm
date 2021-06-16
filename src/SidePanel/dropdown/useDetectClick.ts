import { useEffect, useState } from 'react';

export const useDetectClick = (
    element: React.MutableRefObject<HTMLElement | null>,
    initialState: boolean
) => {
    const [isActive, setIsActive] = useState(initialState);

    useEffect(() => {
        const clickEvent = () => setIsActive(!isActive);

        if (isActive) {
            window.addEventListener('click', clickEvent);
        }

        return () => {
            window.removeEventListener('click', clickEvent);
        };
    }, [isActive, element]);

    return [isActive, setIsActive] as const;
};

export default useDetectClick;
