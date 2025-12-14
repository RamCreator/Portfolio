import { useEffect, useState, useRef } from 'react';

const DynamicBackground = () => {
  const bgRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const rotate = scrollY / 10;
      
      if (bgRef.current) {
        bgRef.current.style.background = `linear-gradient(${120 + rotate}deg, #fdfbfb 0%, #ebedee 100%)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div id="dynamic-bg" ref={bgRef}></div>
  );
};

export default DynamicBackground;
