import React, { useRef, useState, useEffect } from 'react';

export const useDraggableScroll = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const startY = useRef(0);
    const startX = useRef(0);
    const scrollTop = useRef(0);
    const scrollLeft = useRef(0);

    const onMouseDown = (e: React.MouseEvent) => {
        if (!ref.current) return;
        setIsDragging(true);
        startY.current = e.pageY;
        startX.current = e.pageX;
        scrollTop.current = ref.current.scrollTop;
        scrollLeft.current = ref.current.scrollLeft;
        document.body.style.cursor = 'grabbing';
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !ref.current) return;
        e.preventDefault();
        const y = e.pageY;
        const x = e.pageX;
        const walkY = (y - startY.current) * 1.5;
        const walkX = (x - startX.current) * 1.5;
        ref.current.scrollTop = scrollTop.current - walkY;
        ref.current.scrollLeft = scrollLeft.current - walkX;
    };

    const onMouseUp = () => {
        setIsDragging(false);
        document.body.style.cursor = 'default';
    };

    const onMouseLeave = () => {
        if (isDragging) {
            setIsDragging(false);
            document.body.style.cursor = 'default';
        }
    };

    return { ref, isDragging, events: { onMouseDown, onMouseMove, onMouseUp, onMouseLeave } };
};
