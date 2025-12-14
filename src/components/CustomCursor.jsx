import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth physics for the trailing effect (The Comet Tail)
    const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
    const tailX = useSpring(mouseX, springConfig);
    const tailY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const moveCursor = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseDown = () => setIsHovered(true);
        const handleMouseUp = () => setIsHovered(false);

        // Add hover listeners to interactive elements
        const handleLinkHover = () => setIsHovered(true);
        const handleLinkLeave = () => setIsHovered(false);

        const interactiveElements = document.querySelectorAll('a, button, input, textarea, .interactive');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', handleLinkHover);
            el.addEventListener('mouseleave', handleLinkLeave);
        });

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            interactiveElements.forEach(el => {
                el.removeEventListener('mouseenter', handleLinkHover);
                el.removeEventListener('mouseleave', handleLinkLeave);
            });
        };
    }, [mouseX, mouseY, isVisible]);

    // Don't render on touch devices (simple check)
    if (typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
        return null;
    }

    return (
        <>
            {/* Main Dot - Instant follow */}
            <motion.div
                style={{
                    translateX: mouseX,
                    translateY: mouseY,
                    opacity: isVisible ? 1 : 0,
                    x: -4, // Center the 8px dot
                    y: -4,
                }}
                className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
            />

            {/* Trailing Comet Tail - Lagging physics */}
            <motion.div
                style={{
                    translateX: tailX,
                    translateY: tailY,
                    opacity: isVisible ? 0.6 : 0,
                    x: -16, // Center the 32px circle
                    y: -16,
                    scale: isHovered ? 1.5 : 1,
                }}
                className="fixed top-0 left-0 w-8 h-8 rounded-full border border-blue-500 pointer-events-none z-[9998] mix-blend-screen"
                transition={{ duration: 0.2 }}
            >
                {/* Optional: Add a glow effect inside */}
                <div className="w-full h-full rounded-full bg-blue-500 opacity-20 blur-sm" />
            </motion.div>
        </>
    );
};

export default CustomCursor;
