import React, { useEffect, useRef } from 'react';

const LiveRegion = () => {
  const liveRegionRef = useRef(null);

  useEffect(() => {
    console.log('LiveRegion useEffect setup complete.');

    const handleAnnounce = (event) => {
      console.log('Event received in LiveRegion:', event.detail);

      if (liveRegionRef.current) {
        console.log(liveRegionRef.current, 'liveRegionRef current');
        liveRegionRef.current.textContent = event.detail;
      }
    };

    document.addEventListener('announce', handleAnnounce);

    return () => {
      document.removeEventListener('announce', handleAnnounce);
    };
  }, []);

  return (
    <span
      ref={liveRegionRef}
      aria-live="assertive"
      aria-atomic="true"
      style={
        {
          // position: 'absolute',
          // width: '1px',
          // height: '1px',
          // margin: '-1px',
          // overflow: 'hidden',
          // clip: 'rect(0, 0, 0, 0)',
        }
      }
    >
      {' '}
      WHERE AM I
    </span>
  );
};

export default LiveRegion;
