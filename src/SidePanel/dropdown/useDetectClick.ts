import { useEffect, useState } from 'react';

export const useDetectClick = (element, initialState) => {
    const [isActive, setIsActive] = useState(initialState);

    useEffect(() => {
        const clickEvent = e => setIsActive(!isActive);

        if (isActive) {
            window.addEventListener('click', clickEvent);
        }

        return () => {
            window.removeEventListener('click', clickEvent);
        };
    }, [isActive, element]);

    return [isActive, setIsActive];
};

export default useDetectClick;
