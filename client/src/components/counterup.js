import React, { useState, useEffect } from 'react';

const CountUpAnimation = ({ endValue, duration }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = Math.ceil(endValue / (duration / 50)); // Adjust the interval to control animation smoothness

    const timer = setInterval(() => {
      start += increment;
      if (start >= endValue) {
        clearInterval(timer);
        setCount(endValue);
      } else {
        setCount(start);
      }
    }, 50); // Interval in milliseconds

    return () => {
      clearInterval(timer); // Clean up the timer on unmounting
    };
  }, [endValue, duration]);

  return <span>{count}</span>;
};

export default CountUpAnimation;
