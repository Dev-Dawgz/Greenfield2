import React, { useState, useEffect } from 'react';

const Timer = ({ minutes, seconds }) => {
  return (
    <div className="live-timer">
      <p>Time left until the next words:</p>
      <p>{`${minutes} minutes ${seconds} seconds`}</p>
    </div>
  );
};
export default Timer