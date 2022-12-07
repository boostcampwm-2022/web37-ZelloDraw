export const slideVariants = {
    enter: ({ direction, xValue }: { direction: number; xValue: number }) => {
        return {
            x: direction * xValue * -1,
            opacity: 0,
        };
    },
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
    },
    exit: ({ direction, xValue }: { direction: number; xValue: number }) => {
        return {
            zIndex: 0,
            x: direction * xValue,
            opacity: 0,
        };
    },
};

export const flipVariants = {
    enter: (direction: number) => {
        return {
            opacity: 0,
            rotateX: direction > 0 ? -120 : 0,
            backgroundColor: direction > 0 ? '#A8B2C2' : '#F6F5F8',
        };
    },
    center: {
        zIndex: 2,
        opacity: 1,
        rotateX: 0,
        backgroundColor: '#F6F5F8',
    },
    exit: (direction: number) => {
        return {
            zIndex: 0,
            opacity: 0,
            rotateX: direction < 0 ? -120 : 0,
            backgroundColor: direction < 0 ? '#A8B2C2' : '#F6F5F8',
        };
    },
};
